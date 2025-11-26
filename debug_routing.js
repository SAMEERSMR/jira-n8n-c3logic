// DEBUG VERSION - Use this to replace "Which Query Tool?" switch temporarily
// This will show exactly what items are being received and routed

const items = $input.all();

console.log('=== DEBUG: Which Query Tool Routing ===');
console.log(`Total items received: ${items.length}`);

// Log each item
items.forEach((item, index) => {
  console.log(`\nItem ${index}:`);
  console.log(`  tool_name: "${item.json.tool_name}"`);
  console.log(`  tool_id: "${item.json.tool_id}"`);
  console.log(`  tool_index: ${item.json.tool_index}`);
});

// Initialize output arrays (5 outputs matching 5 tool types)
const search_jira = [];
const get_jira_issue = [];
const get_jira_comments = [];
const get_jira_changelog = [];
const get_jira_attachments = [];

// Route each item to correct output based on tool_name
items.forEach((item, index) => {
  const toolName = item.json.tool_name;

  console.log(`\nRouting Item ${index} with tool_name="${toolName}"`);

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

console.log('\n=== Output Summary ===');
console.log(`Output 0 (search_jira): ${search_jira.length} items`);
console.log(`Output 1 (get_jira_issue): ${get_jira_issue.length} items`);
console.log(`Output 2 (get_jira_comments): ${get_jira_comments.length} items`);
console.log(`Output 3 (get_jira_changelog): ${get_jira_changelog.length} items`);
console.log(`Output 4 (get_jira_attachments): ${get_jira_attachments.length} items`);

// Return 5 outputs (n8n expects array of arrays for multiple outputs)
return [
  search_jira,
  get_jira_issue,
  get_jira_comments,
  get_jira_changelog,
  get_jira_attachments
];
