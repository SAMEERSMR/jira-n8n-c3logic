# Jira Ticket Auto-Analysis with Claude AI

Automatically analyzes new Jira tickets, finds similar tickets and solutions, searches Confluence docs, and posts a smart summary.

---

## 🎯 Quick Overview

When a new Jira ticket is created, this workflow:
1. Finds similar tickets
2. Extracts solutions from their comments
3. Searches Confluence documentation
4. Generates a summary
5. Posts it as a comment

---

## 📊 Complete Flow Diagram

```
┌───────────────────────────────────────────────────────────────┐
│                    NEW JIRA TICKET CREATED                    │
└────────────────────────────┬──────────────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Extract Data   │
                    │  (Ticket Info)  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Call Claude AI │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ Search Similar│   │  Get Comments │   │ Search        │
│   Tickets     │   │  & Solutions  │   │ Confluence    │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                    │
        └───────────────────┴────────────────────┘
                            │
                            ▼
                    ┌─────────────────┐
                    │  Analyze All    │
                    │  Data Together  │
                    └───────┬─────────┘
                            │
                            ▼
                    ┌─────────────────┐
                    │ Generate Summary│
                    └───────┬─────────┘
                            │
                            ▼
                    ┌─────────────────┐
                    │  Post Comment   │
                    │  to Jira Ticket │
                    └─────────────────┘
```

---

## 🔄 Step-by-Step Process

### **Step 1: Find Similar Tickets**
```
Search Jira → Find duplicates/related tickets → Check if resolved
```

### **Step 2: Extract Solutions** (if matches found)
```
Get Comments → Analyze solutions → Extract fixes
```

### **Step 3: Search Confluence**
```
Search Docs → Find relevant pages → Extract info
```

### **Step 4: Generate Summary**
```
Combine: Ticket + Similar Tickets + Solutions + Docs
         ↓
    Create Summary
```

### **Step 5: Post Comment**
```
Format Summary → Post to Original Ticket
```

---

## 🛠️ Setup (3 Steps)

### **1. Import Workflow**
- Import `Claude MCP Orchestrator - Expanded.json` into n8n

### **2. Add Credentials**
- **Jira**: Cloud credentials
- **OpenRouter**: API key for Claude

### **3. Configure Webhook**
- Jira webhook → n8n trigger URL
- Event: `jira:issue_created`
- Activate workflow

---

## 🔧 Tools Available

| Tool | What It Does |
|------|--------------|
| `search_jira` | Find similar tickets |
| `get_jira_issue` | Get ticket details |
| `get_jira_comments` | Get comments (for solutions) |
| `search_confluence` | Find docs |
| `get_confluence_page` | Get doc content |

---

## 📝 Summary Includes

- ✅ **Ticket Overview** - What the issue is about
- 🔗 **Similar Tickets** - Links to related tickets
- 💡 **Solutions Found** - Solutions from similar tickets
- 📚 **Documentation** - Relevant Confluence pages
- 🎯 **Next Steps** - What to do next

---

## 🚀 Quick Start

```bash
1. Import workflow JSON into n8n
2. Add Jira + OpenRouter credentials
3. Set up Jira webhook
4. Activate workflow
5. Create a test ticket → Watch it work!
```

---

## 📋 Requirements

- n8n (Cloud or Self-hosted)
- Jira Cloud account
- OpenRouter API key
- Confluence access (optional)

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| Not triggering | Check webhook URL & workflow status |
| Claude not working | Verify OpenRouter API key |
| Summary not posting | Check Jira credentials & permissions |

---

## 📚 Resources

- [n8n Docs](https://docs.n8n.io/)
- [Jira API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [Confluence API](https://developer.atlassian.com/cloud/confluence/rest/)
- [OpenRouter](https://openrouter.ai/docs)

---

## 📄 Project Files

- `Claude MCP Orchestrator - Expanded.json` - Main workflow
- `curl-commands.md` - API test commands
- `README.md` - This file

---

**Version**: 1.0
