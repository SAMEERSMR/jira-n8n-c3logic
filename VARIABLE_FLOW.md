# Variable Flow Documentation - V_18NOV_2350

## Node Reference Syntax Fixed

All nodes now use correct n8n syntax:
- `$input.first().json` or `$input.item.json` - Current input data
- `$("NodeName").first().json` - First item from a previous node
- `$("NodeName").item.json` - Corresponding item by index from previous node
- `$input.all()` - All items from input

## Variable Flow Through Workflow

### Phase 1: Query Loop

1. **Initialize Data**
   - Creates: `ticketData`, `query_conversation`, `iteration`, `max_iterations`, `phase`
   - Outputs: All ticket data + query conversation array

2. **Call Claude (Query)**
   - Input: `$json.query_conversation`
   - Sends: `{ model, messages: query_conversation, tools }`
   - Outputs: Claude API response with `choices[0].message`

3. **Parse Query Response**
   - Input: `response.choices[0].message`
   - Gets previous data from:
     - First iteration: `$('Initialize Data').first().json`
     - Subsequent iterations: `$("Merge Query Results").first().json`
   - Builds: `query_conversation` array with assistant message
   - Outputs: `query_conversation`, `has_tools`, `tool_calls`, `iteration`, `query_complete`

4. **Has More Queries?**
   - Checks: `$json.has_tools === true`
   - Routes: TRUE → Split Query Tools, FALSE → Prepare Analysis Data

5. **Split Query Tools**
   - Input: `$input.first().json.tool_calls`
   - Creates for each tool: `tool_id`, `tool_name`, `tool_args`
   - Outputs: Array of tool metadata (preserves conversation data)

6. **Which Query Tool?**
   - Routes based on: `$json.tool_name`
   - Passes through: All data including `tool_id`, `tool_name`, `tool_args`

7. **Jira Nodes** (Search Jira, Get Issue, Get Comments, Get Changelog, Get Attachments)
   - Use: `$json.tool_args.query` or `$json.tool_args.issue_key`
   - Output: Jira API response (REPLACES input JSON)

8. **Format Query Results**
   - Input Jira response: `$input.item.json`
   - Retrieves metadata: `$("Which Query Tool?").item.json`
   - Extracts: `tool_id`, `tool_name`, `tool_args` from metadata
   - Formats result using: `toolResultMap[toolName]()`
   - Outputs: `{ tool_id, tool_name, tool_args, result }`

9. **Merge Query Results**
   - Input: `$input.all()` - all formatted results
   - Gets base data: `$('Parse Query Response').first().json`
   - Builds tool results: `{ role: 'tool', tool_call_id, content }`
   - Appends to: `query_conversation`
   - Outputs: Complete data with updated `query_conversation`
   - **Loops back to**: Call Claude (Query)

### Phase 2: Analysis

10. **Prepare Analysis Data**
    - Input: `$input.first().json` (from Has More Queries? FALSE branch)
    - Gets ticket data: `$('Initialize Data').first().json`
    - Creates: `analysis_conversation` with full query results
    - Outputs: `ticketData + queryData + analysis_conversation + phase: 'analysis'`

11. **Call Claude (Analyze)**
    - Input: `$json.analysis_conversation`
    - Sends: `{ model, messages: analysis_conversation }` (NO TOOLS)
    - Outputs: Claude API response

12. **Parse Analysis**
    - Input: `response.choices[0].message`
    - Gets: `$('Prepare Analysis Data').first().json`
    - Extracts: `message.content` as `final_summary`
    - Outputs: All data + `final_summary`, `analysis_complete`

13. **Prep Comment**
    - Input: `$input.first().json`
    - Extracts: `ticket_key`, `jira_url`, `final_summary` as `comment`
    - Outputs: `{ ticket_key, jira_url, comment }`

14. **Add Comment to Jira**
    - Uses: `$json.ticket_key`, `$json.comment`
    - Posts comment to Jira

## Key Variable Names

### Throughout Query Phase:
- `query_conversation` - Array of messages for Query Claude
- `tool_id` - Unique ID from Claude's tool_calls
- `tool_name` - Function name (search_jira, get_jira_issue, etc.)
- `tool_args` - Arguments for the tool call
- `has_tools` - Boolean indicating if more queries needed
- `iteration` - Loop counter

### Throughout Analysis Phase:
- `analysis_conversation` - Array of messages for Analysis Claude
- `final_summary` - Generated summary text
- `ticket_key` - Jira ticket identifier

### Ticket Data (preserved throughout):
- `ticket_key`, `summary`, `description`, `project`, `issue_type`, `status`, `priority`
- `assignee`, `reporter`, `created`, `updated`, `labels`, `components`

## Critical Fixes Applied

1. **Format Query Results**: Uses `$("Which Query Tool?").item.json` to preserve `tool_id`
2. **Parse Query Response**: Checks for previous iteration data from Merge Query Results
3. **All tool results**: Properly use `tool_call_id` matching Claude's `tool_calls[].id`
4. **Assistant messages**: Set `content: null` when `tool_calls` present

