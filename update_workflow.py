#!/usr/bin/env python3
"""
Script to replace the "Which Query Tool?" switch node with a Code node
in the n8n workflow JSON.
"""

import json

# Read the original workflow
with open('2V_25NOV_n8n_c3logic.json', 'r') as f:
    workflow = json.load(f)

# Update workflow name
workflow['name'] = 'Claude MCP Orchestrator - 3V_25NOV_code_routing'
workflow['versionId'] = '3v25nov-code-routing-001'
workflow['id'] = '3v25nov-code-routing'

# Find and remove the switch node
nodes = workflow['nodes']
switch_node_index = None
for i, node in enumerate(nodes):
    if node.get('id') == 'which-query-tool':
        switch_node_index = i
        switch_position = node['position']
        break

if switch_node_index is not None:
    # Remove the switch node
    nodes.pop(switch_node_index)
    print(f"Removed switch node at index {switch_node_index}")
else:
    print("Warning: Switch node not found!")
    switch_position = [-1408, 128]  # Default position

# Create the new Code node with routing logic
code_node = {
    "parameters": {
        "jsCode": """const items = $input.all();

console.log(`=== Which Query Tool (Code Router) ===`);
console.log(`Total items received: ${items.length}`);

// Initialize output arrays (5 outputs matching 5 tool types)
const search_jira = [];
const get_jira_issue = [];
const get_jira_comments = [];
const get_jira_changelog = [];
const get_jira_attachments = [];

// Route each item to correct output based on tool_name
items.forEach((item, index) => {
  const toolName = item.json.tool_name;
  console.log(`Item ${index}: tool_name="${toolName}", tool_id="${item.json.tool_id}"`);

  switch(toolName) {
    case 'search_jira':
      search_jira.push(item);
      console.log(`  → Routed to Output 0 (search_jira)`);
      break;
    case 'get_jira_issue':
      get_jira_issue.push(item);
      console.log(`  → Routed to Output 1 (get_jira_issue)`);
      break;
    case 'get_jira_comments':
      get_jira_comments.push(item);
      console.log(`  → Routed to Output 2 (get_jira_comments)`);
      break;
    case 'get_jira_changelog':
      get_jira_changelog.push(item);
      console.log(`  → Routed to Output 3 (get_jira_changelog)`);
      break;
    case 'get_jira_attachments':
      get_jira_attachments.push(item);
      console.log(`  → Routed to Output 4 (get_jira_attachments)`);
      break;
    default:
      console.error(`  ✗ ERROR: Unknown tool_name: "${toolName}"`);
  }
});

console.log(`\\nOutput Summary:`);
console.log(`  Output 0 (search_jira): ${search_jira.length} items`);
console.log(`  Output 1 (get_jira_issue): ${get_jira_issue.length} items`);
console.log(`  Output 2 (get_jira_comments): ${get_jira_comments.length} items`);
console.log(`  Output 3 (get_jira_changelog): ${get_jira_changelog.length} items`);
console.log(`  Output 4 (get_jira_attachments): ${get_jira_attachments.length} items`);

// Return 5 outputs (n8n expects array of arrays for multiple outputs)
return [
  search_jira,
  get_jira_issue,
  get_jira_comments,
  get_jira_changelog,
  get_jira_attachments
];"""
    },
    "name": "Which Query Tool?",
    "type": "n8n-nodes-base.code",
    "typeVersion": 2,
    "position": switch_position,
    "id": "which-query-tool"
}

# Add the new code node
nodes.append(code_node)
print(f"Added new Code node at position {switch_position}")

# Connections remain the same - they reference node IDs which haven't changed
print("Connections preserved (using same node ID)")

# Write the new workflow
output_filename = '3V_25NOV_n8n_code_routing.json'
with open(output_filename, 'w') as f:
    json.dump(workflow, f, indent=2)

print(f"\n✓ Successfully created {output_filename}")
print(f"  - Replaced switch node with Code node")
print(f"  - Code node has 5 outputs for routing")
print(f"  - All connections preserved")
print(f"\nNext steps:")
print(f"1. Import {output_filename} into n8n")
print(f"2. Save and activate the workflow")
print(f"3. Run a test execution")
