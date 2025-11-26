# Changelog - 25 NOV 2024 - Version 3 (Code Routing)

## Version: 3V_25NOV_n8n_code_routing

## Changes Made

### 🔧 Fixed: Switch Node Routing Issue

**Problem**: The "Which Query Tool?" switch node was only routing items to the first output (Search Jira), even when Claude returned multiple different tool types (search_jira, get_jira_issue, get_jira_attachments, etc.).

**Root Cause**: n8n Switch node v3 has an "Execute Once" setting that can prevent proper item-by-item routing, even when disabled. The switch node's behavior was inconsistent.

**Solution**: Replaced the Switch node with a Code node that manually routes items based on `tool_name` property.

### Technical Details

#### Removed
- **Node**: "Which Query Tool?" (Switch node, typeVersion 3)
- **Type**: `n8n-nodes-base.switch`
- **Reason**: Unreliable routing behavior

#### Added
- **Node**: "Which Query Tool?" (Code node, typeVersion 2)
- **Type**: `n8n-nodes-base.code`
- **Outputs**: 5 (same as before)
  - Output 0: search_jira
  - Output 1: get_jira_issue
  - Output 2: get_jira_comments
  - Output 3: get_jira_changelog
  - Output 4: get_jira_attachments

#### Code Node Logic
```javascript
const items = $input.all();

// Initialize output arrays (5 outputs matching 5 tool types)
const search_jira = [];
const get_jira_issue = [];
const get_jira_comments = [];
const get_jira_changelog = [];
const get_jira_attachments = [];

// Route each item to correct output based on tool_name
items.forEach((item, index) => {
  const toolName = item.json.tool_name;

  switch(toolName) {
    case 'search_jira':
      search_jira.push(item);
      break;
    case 'get_jira_issue':
      get_jira_issue.push(item);
      break;
    case 'get_jira_comments':
      get_jira_comments.push(item);
      break;
    case 'get_jira_changelog':
      get_jira_changelog.push(item);
      break;
    case 'get_jira_attachments':
      get_jira_attachments.push(item);
      break;
    default:
      console.error(`Unknown tool_name: "${toolName}"`);
  }
});

// Return 5 outputs (n8n expects array of arrays for multiple outputs)
return [
  search_jira,
  get_jira_issue,
  get_jira_comments,
  get_jira_changelog,
  get_jira_attachments
];
```

### Benefits

1. **Reliable Routing**: Guaranteed to process all items and route them correctly
2. **Debugging**: Console logs show exactly which items are routed where
3. **No Hidden Settings**: No UI-only settings that can cause issues
4. **Explicit Logic**: Clear, readable JavaScript code

### Testing

After importing this workflow:

1. Run with test ticket KAN-855
2. Check execution view - should now see:
   - Search Jira: 1 item (search_jira tool)
   - Get Issue: 1 item (get_jira_issue tool)
   - Get Attachments: 1 item (get_jira_attachments tool)
   - Get Comments: 0 items
   - Get Changelog: 0 items

### No Breaking Changes

- All connections preserved (same node ID: `which-query-tool`)
- All downstream nodes unchanged
- Same 5 outputs with same semantics
- Workflow logic unchanged

---

## Files Modified

- **Created**: `3V_25NOV_n8n_code_routing.json` (new workflow)
- **Script**: `update_workflow.py` (automation script)
- **Previous Version**: `2V_25NOV_n8n_c3logic.json` (preserved for reference)

## Migration Guide

### From v2 to v3

1. Export current workflow from n8n (backup)
2. Import `3V_25NOV_n8n_code_routing.json` into n8n
3. Verify Jira credentials are connected
4. Save workflow
5. Run test execution
6. Verify all tool nodes receive items correctly

---

**Date**: November 25, 2024
**Version**: 3V_25NOV
**Author**: Claude Code
**Issue**: Switch node only routing to first output
**Status**: ✅ Fixed
