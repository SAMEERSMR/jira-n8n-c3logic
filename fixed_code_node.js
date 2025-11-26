// Fixed Code Node - Proper n8n multiple output format
const items = $input.all();

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

console.log(`\nOutput Summary:`);
console.log(`  Output 0 (search_jira): ${search_jira.length} items`);
console.log(`  Output 1 (get_jira_issue): ${get_jira_issue.length} items`);
console.log(`  Output 2 (get_jira_comments): ${get_jira_comments.length} items`);
console.log(`  Output 3 (get_jira_changelog): ${get_jira_changelog.length} items`);
console.log(`  Output 4 (get_jira_attachments): ${get_jira_attachments.length} items`);

// Return 5 outputs - n8n expects array of item arrays
// Each output is an array of items (items already have {json: ...} format)
return [
  search_jira,       // Output 0
  get_jira_issue,    // Output 1
  get_jira_comments, // Output 2
  get_jira_changelog,// Output 3
  get_jira_attachments // Output 4
];
