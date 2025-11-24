# Claude MCP Orchestrator - Analysis Phase Prompt

This document shows the exact prompt sent to Claude Sonnet in the **Analysis Phase** (second Claude API call).

---

## Phase Overview

**Purpose**: Analyze all gathered data and generate a comprehensive summary.

**Node**: `Prepare Analysis Data` → `Call Claude (Analyze)`

**Has Tools**: NO - This phase is pure analysis with no tool access

---

## Analysis Phase Prompt

```
Based on the following ticket and all the gathered query results, analyze and create a comprehensive summary:

**Original Ticket:**
- Key: {ticket_key}
- Summary: {summary}
- Description: {description}
- Project: {project}
- Issue Type: {issue_type}
- Status: {status}
- Priority: {priority}
- Assignee: {assignee}
- Reporter: {reporter}
- Created: {created}
- Updated: {updated}

**Gathered Data:**
The conversation below contains all Jira queries performed and their results:

{full_query_conversation_json}

**YOUR TASK (Analysis Phase):**
Analyze all the gathered information and create a comprehensive summary that includes:

1. **Ticket Overview**: Brief summary of the ticket
2. **Similar Tickets Found**: List similar/related tickets with links
3. **Solutions Extracted**: Key solutions and fixes found from similar ticket comments
4. **Resolution Patterns**: Patterns identified from changelogs of resolved tickets
5. **Key Insights**: Important insights and recommendations
6. **Suggested Next Steps**: Actionable next steps for resolving this ticket

Format the summary clearly with sections and use markdown. Do NOT use any tools - this is pure analysis based on the data already gathered.

The final summary should be ready to post as a comment on ticket {ticket_key}.
```

---

## Available Tools (Analysis Phase)

**None** - This phase is pure analysis with no tool access.

---

## Key Points

- This phase receives the **complete query conversation** from Phase 1
- Claude analyzes all data without making additional API calls
- Output is a formatted markdown summary
- Summary is posted directly to the original Jira ticket as a comment
- Focus is on synthesizing information, not gathering it

---

## Output Format

The summary should be well-structured markdown with:
- Clear section headers
- Bullet points for easy scanning
- Links to similar tickets
- Actionable next steps
- Professional tone suitable for team collaboration
