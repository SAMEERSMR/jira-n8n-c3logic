# Claude MCP Orchestrator - Prompt Documentation

This document shows the exact prompts sent to Claude Sonnet in the two-phase workflow (V_18NOV_2350).

## Workflow Overview

The workflow uses **two separate Claude API calls**:

1. **Query Phase**: First Claude call focuses on gathering data using Jira query tools
2. **Analysis Phase**: Second Claude call focuses on analysis and summary generation (no tools)

---

## Prompt 1: Query Phase

**Node**: `Initialize Data` → `Call Claude (Query)`

**Purpose**: Gather all relevant information about similar tickets, comments, changelogs, and resolutions.

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

**Available Tools (Query Phase)**:
1. **search_jira** - Search for Jira issues using JQL query
2. **get_jira_issue** - Get full details of a specific Jira issue
3. **get_jira_comments** - Get all comments for a Jira issue
4. **get_jira_changelog** - Get changelog/history for a Jira issue
5. **get_jira_attachments** - Get all attachments for a Jira issue

---

## Prompt 2: Analysis Phase

**Node**: `Prepare Analysis Data` → `Call Claude (Analyze)`

**Purpose**: Analyze all gathered data and generate a comprehensive summary.

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

**Available Tools (Analysis Phase)**: None - This phase is pure analysis with no tool access.

