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
This ensures you only search within the {project} project.

**YOUR TASK (Query Phase):**

**STEP 1 - ANALYZE TICKET CONTENT:**
Before calling tools, analyze the ticket to determine what information you need:
- What keywords from summary/description are most relevant?
- Are specific files, screenshots, or logs mentioned? (indicates attachments)
- Are specific ticket keys referenced? (e.g., "same as KAN-500")
- What type of similar tickets should you search for?

**STEP 2 - CALL APPROPRIATE TOOLS:**
Based on your analysis, call the tools you need. All tools will execute in parallel.

**Tool Selection Guidelines:**

1. **search_jira** - ALWAYS CALL with smart JQL query:
   - Extract key terms from ticket summary/description
   - Build relevant JQL query with project filter
   - Examples:
     * Ticket: "Create landing page" → Query: "project = {project} AND summary ~ 'landing page' ORDER BY created DESC"
     * Ticket: "Login authentication error" → Query: "project = {project} AND (summary ~ 'login' OR summary ~ 'authentication') AND status = Resolved ORDER BY resolutiondate DESC"
     * Ticket: "Fix bug in checkout flow" → Query: "project = {project} AND type = Bug AND summary ~ 'checkout' ORDER BY created DESC"

2. **get_jira_issue** - Call IMMEDIATELY if:
   - Ticket mentions specific issue key (e.g., "similar to KAN-500", "duplicate of PROJ-123")
   - Call with the referenced issue key

3. **get_jira_comments** - Call IMMEDIATELY if:
   - Ticket mentions specific resolved issue key
   - You want to see solution discussions right away

4. **get_jira_attachments** - Call IMMEDIATELY if:
   - Ticket summary/description mentions: "screenshot", "image", "log", "file", "attached", "attachment", "see image", "error log"
   - Call for the current ticket: {ticket_key}

5. **get_jira_changelog** - Call ONLY IN LATER ITERATIONS if:
   - You found resolved tickets and need to understand resolution patterns
   - DO NOT call in first response unless specifically needed

**EXECUTION BEHAVIOR:**
- You can call multiple tools in your first response
- All tools will execute in parallel (simultaneously)
- The system waits for ALL results before returning to you
- You can iterate up to {max_iterations} times
- When you have enough information, stop calling tools (return text to move to analysis)

**DECISION EXAMPLES:**

Example 1 - Simple task, no special mentions:
Ticket: "Create landing page for new product"
Your response: [1× search_jira with JQL: "project = {project} AND summary ~ 'landing page'"]

Example 2 - Ticket mentions files:
Ticket: "Login error, see attached screenshot and error logs"
Your response: [1× search_jira with JQL: "project = {project} AND summary ~ 'login error'", 1× get_jira_attachments for {ticket_key}]

Example 3 - Ticket references another ticket:
Ticket: "Same authentication issue as KAN-500"
Your response: [1× search_jira with JQL: "project = {project} AND summary ~ 'authentication'", 1× get_jira_issue for KAN-500, 1× get_jira_comments for KAN-500]

**SUBSEQUENT ITERATIONS:**
After receiving results from your first tool calls, you may:
- Call additional search_jira with different keywords if needed
- Call get_jira_comments for resolved tickets you found
- Call get_jira_changelog if you need resolution patterns
- Or stop if you have sufficient information

**REMEMBER:**
- Analyze ticket content to decide which tools to call
- Always include smart, relevant JQL queries
- All tools you call execute in parallel
- Don't call unnecessary tools
- Every search MUST include: project = {project}

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

- **Content-aware strategy**: Claude analyzes ticket content before selecting tools
- **Smart JQL queries**: Extracts keywords from ticket to build relevant JQL
- **Conditional tool calling**: Auto-triggers tools based on ticket content
  - Files mentioned → get_jira_attachments
  - Ticket referenced → get_jira_issue + get_jira_comments
  - No special mentions → search_jira only
- **Parallel execution**: All selected tools execute simultaneously via switch node
- **Adaptive behavior**: Simple tickets = 1 tool, complex tickets = multiple tools
- **Iteration support**: Can make up to 3 iterations if needed
- All tool calls and results are stored in the `query_conversation` array
- When Claude stops calling tools, the workflow moves to Analysis Phase
- **Critical**: All JQL queries must be project-scoped for security and relevance

---

## Tool Call Decision Logic

### First Response Decision Tree

```
Analyze Ticket Content
    ↓
┌───────────────┬──────────────┬─────────────────┐
│               │              │                 │
▼               ▼              ▼                 ▼
Simple Task   Files Mentioned  Ticket Referenced  Complex Bug
│               │              │                 │
▼               ▼              ▼                 ▼
[search_jira]  [search_jira,  [search_jira,    [search_jira,
                attachments]   get_issue,        attachments]
                               get_comments]
```

### Content Triggers

| Ticket Content Contains | Auto-Trigger Tool |
|-------------------------|-------------------|
| "screenshot", "image", "attached" | `get_jira_attachments` |
| "logs", "log file", "error log" | `get_jira_attachments` |
| "KAN-500", "PROJ-123" (issue key) | `get_jira_issue`, `get_jira_comments` |
| "similar to KAN-X", "duplicate of" | `get_jira_issue`, `get_jira_comments` |
| No special mentions | `search_jira` only |

---

## Smart JQL Examples

| Ticket Summary | Smart JQL Query |
|----------------|-----------------|
| "Create landing page" | `project = KAN AND summary ~ 'landing page' ORDER BY created DESC` |
| "Login authentication failed" | `project = KAN AND (summary ~ 'login' OR summary ~ 'authentication') AND status = Resolved` |
| "Fix checkout bug" | `project = KAN AND type = Bug AND summary ~ 'checkout' ORDER BY created DESC` |
| "Payment gateway timeout" | `project = KAN AND (summary ~ 'payment' OR summary ~ 'gateway' OR summary ~ 'timeout') AND status = Resolved` |

---

## Performance Benefits

### Cost Optimization

**Before (Rigid Strategy)**:
- Every ticket: 3-4 search_jira calls automatically
- Total: 3-4 API calls (even if unnecessary)

**After (Adaptive Strategy)**:
- Simple ticket: 1 search_jira call
- Ticket with attachments: 2 calls (search + attachments)
- Ticket with reference: 3 calls (search + issue + comments)
- **Average savings**: ~50% fewer API calls

### Parallel Execution

```
Claude returns: [search_jira, get_jira_attachments]
                          ↓
         Split Query Tools (1 → 2 items)
                          ↓
            Which Query Tool? (Switch)
                ↓              ↓
          Search Jira    Get Attachments
                ↓              ↓
         ALL EXECUTE IN PARALLEL
                ↓              ↓
        Format Query Results (waits for ALL)
                         ↓
        Merge Query Results (combines ALL)
                         ↓
         Back to Claude with ALL results
```

---

## Testing Scenarios

### Test Case 1: Simple Ticket
**Input**: `Summary: "Create landing page", Description: null`
**Expected**: `[1× search_jira]`
**Result**: 1 API call

### Test Case 2: Ticket with Attachments
**Input**: `Summary: "Login error", Description: "See attached screenshot"`
**Expected**: `[1× search_jira, 1× get_jira_attachments]`
**Result**: 2 API calls (parallel)

### Test Case 3: Ticket Referencing Another
**Input**: `Summary: "Same issue as KAN-500", Description: "Duplicate"`
**Expected**: `[1× search_jira, 1× get_jira_issue, 1× get_jira_comments]`
**Result**: 3 API calls (parallel)

### Test Case 4: Complex Bug
**Input**: `Summary: "Production DB error", Description: "Attached thread dumps and logs"`
**Expected**: `[1× search_jira with resolved filter, 1× get_jira_attachments]`
**Result**: 2 API calls (parallel)

---

## Strategy: Content-Aware Adaptive Tool Selection

**Philosophy**: Analyze first, then act intelligently

**Benefits**:
- ✅ Reduces unnecessary API calls (~50% savings)
- ✅ Smart, relevant JQL queries based on ticket content
- ✅ Maintains parallel execution for selected tools
- ✅ Adapts to ticket complexity automatically
- ✅ Better use of iteration budget (max 3 iterations)

**Key Difference from Previous Approach**:
- **Old**: Call 2-4 search_jira queries every time
- **New**: Call only what's needed based on ticket analysis
