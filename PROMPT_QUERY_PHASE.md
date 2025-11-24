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
You need to gather all relevant information about this Jira ticket using JQL queries and Jira API calls:

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
1. **Find Similar Tickets**: Use search_jira with JQL queries (ALWAYS include project = {project}) based on summary and description keywords to find duplicate or related tickets within the {project} project only.

2. **Get Ticket Details**: For similar tickets found in {project}, use get_jira_issue to get full details, especially resolved ones.

3. **Extract Comments**: Use get_jira_comments on similar resolved tickets from {project} to find solutions and fixes.

4. **Get Changelog**: Use get_jira_changelog on relevant tickets from {project} to understand resolution patterns.

5. **Collect Attachments**: Use get_jira_attachments if needed for tickets in {project}.

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

- This phase uses an **iterative loop** to handle multiple tool calls
- Claude can call tools multiple times until all necessary data is gathered
- All tool calls and results are stored in the `query_conversation` array
- When Claude stops calling tools, the workflow moves to Analysis Phase
- **Critical**: All JQL queries must be project-scoped for security and relevance
