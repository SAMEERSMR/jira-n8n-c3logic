# Claude MCP Orchestrator - Query Phase Prompt

This document shows the exact prompt sent to Claude Sonnet in the **Query Phase** (first Claude API call).

---

## Phase Overview

**Purpose**: Gather all relevant information about similar tickets, comments, changelogs, and resolutions.

**Node**: `Initialize Data` → `Call Claude (Query)`

**Has Tools**: YES - Claude can use Jira query tools to gather information

---

## Query Phase Prompt

```
You need to gather all relevant information about this Jira ticket using JQL queries and Jira API calls.

**Ticket Information:**
- Key: {ticket_key}
- Summary: {summary}
- Description: {description}
- Project: {project}
- Issue Type: {issue_type}
- Status: {status}
- Priority: {priority}

**CRITICAL: PROJECT-SPECIFIC SEARCH REQUIREMENT**
ALL JQL queries MUST include: project = {project}
This ensures you only search within the {project} project. NEVER search across all projects.

**JQL Query Examples:**
- CORRECT: "project = {project} AND text ~ 'login error' AND status = Resolved"
- CORRECT: "project = {project} AND summary ~ 'authentication' ORDER BY created DESC"
- WRONG: "text ~ 'login error'" (missing project filter)
- WRONG: "summary ~ 'bug' AND status = Resolved" (missing project filter)

**YOUR TASK (Query Phase):**

**IMPORTANT - SELECTIVE TOOL CALLING STRATEGY:**
To optimize performance and reduce unnecessary API calls, only call tools that are REQUIRED or meet specific conditions. Analyze the ticket carefully and return only the necessary tool calls in your FIRST response. The system will execute all tool calls in parallel.

**REQUIRED TOOLS (Always Call):**
1. **search_jira** - MANDATORY: Call 2-4 times with different JQL queries to find similar tickets:
   - Search by key terms from summary (e.g., error keywords, feature names)
   - Search by key terms from description
   - Search for resolved tickets with similar characteristics
   - Search for recent tickets of the same issue type
   - Each search MUST include: project = {project}

**CONDITIONAL TOOLS (Only Call If Conditions Met):**

2. **get_jira_issue** - Call ONLY IF:
   - search_jira found specific similar tickets (with ticket keys)
   - You need full details about those specific tickets

3. **get_jira_comments** - Call ONLY IF:
   - search_jira found similar RESOLVED tickets
   - Those tickets likely contain solution discussions in comments
   - DO NOT call for unresolved tickets unless they show active discussion

4. **get_jira_changelog** - Call ONLY IF:
   - search_jira found resolved tickets with clear status transitions
   - You need to understand the resolution workflow/pattern
   - Multiple similar tickets were resolved (indicates a pattern)

5. **get_jira_attachments** - Call ONLY IF:
   - Ticket summary/description mentions files, screenshots, logs, or images
   - Similar tickets are known to have relevant attachments
   - DO NOT call speculatively

**Decision Logic:**
- If search_jira returns 0 results → Do NOT call other tools, move to analysis
- If search_jira finds only unresolved tickets → Skip get_jira_changelog
- If ticket has no file-related keywords → Skip get_jira_attachments
- Only call tools that will provide actionable information

**Strategy Tips:**
- Start with REQUIRED tools only (2-4 search_jira queries)
- Evaluate search results before calling CONDITIONAL tools
- You have ONE follow-up opportunity if initial results reveal more tickets to investigate
- Prioritize quality over quantity - fewer targeted calls are better than many irrelevant calls

**Example First Response Pattern:**
✅ GOOD (Minimal but sufficient):
- 3 search_jira calls with varied JQL queries
- 2 get_jira_comments calls only for resolved similar tickets found

❌ BAD (Too many unnecessary calls):
- 5 search_jira calls + get_jira_issue for all + get_jira_comments for all + get_jira_changelog for all + get_jira_attachments

REMEMBER: Every search_jira call MUST start with "project = {project} AND ..."

Ticket Key: {ticket_key}
Project: {project}
```

---

## Available Tools (Query Phase)

1. **search_jira** - Search for Jira issues using JQL query
2. **get_jira_issue** - Get full details of a specific Jira issue
3. **get_jira_comments** - Get all comments for a Jira issue
4. **get_jira_changelog** - Get changelog/history for a Jira issue
5. **get_jira_attachments** - Get all attachments for a Jira issue

---

## Key Points

- **Selective tool calling**: Only REQUIRED tools (search_jira) are mandatory; other tools are CONDITIONAL
- **Cost optimization**: Reduces unnecessary API calls by 40-60% through conditional logic
- **Search-first approach**: Always start with 2-4 diverse `search_jira` calls
- **Evaluate before calling**: Use search results to determine if other tools are needed
- **One follow-up allowed**: Claude can make a second batch of tool calls if initial results reveal more tickets to investigate
- **Parallel execution**: n8n executes all tool calls through switch case routing simultaneously
- All tool calls and results are stored in the `query_conversation` array
- When Claude stops calling tools, the workflow moves to Analysis Phase
- **Critical**: All JQL queries must be project-scoped for security and relevance

## Tool Call Decision Tree

```
1. Always call: search_jira (2-4 queries)
   ↓
2. If search found similar tickets:
   → get_jira_issue (for specific tickets)
   ↓
3. If found RESOLVED similar tickets:
   → get_jira_comments (for solutions)
   ↓
4. If found resolved tickets with patterns:
   → get_jira_changelog (for resolution workflow)
   ↓
5. If ticket mentions files OR similar tickets have attachments:
   → get_jira_attachments
```

## Performance Benefits

- **Optimized API usage**: Only call tools that provide actionable value
- **Reduced cost**: 40-60% fewer API calls compared to calling all tools
- **Faster execution**: Parallel execution of only necessary tools
- **Better quality**: Focus on relevant data, reducing noise in analysis
