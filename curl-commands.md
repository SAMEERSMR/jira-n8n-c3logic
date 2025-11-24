# cURL Commands for Jira Ticket Analysis

## 1. OpenRouter (Claude 3.5 Sonnet)

```bash
curl --location 'https://openrouter.ai/api/v1/chat/completions' \
--header 'Authorization: Bearer YOUR_OPENROUTER_API_KEY' \
--header 'Content-Type: application/json' \
--data '{
  "model": "anthropic/claude-3.5-sonnet",
  "messages": [
    {
      "role": "user",
      "content": "Analyze this Jira ticket with all available details:\n\n**Basic Information:**\n- Key: KAN-830\n- Summary: testing sameer\n- Description: No description\n- Project: KAN\n- Issue Type: Task\n- Status: To Do\n- Priority: Medium\n- Resolution: Unresolved\n\n**People:**\n- Assignee: Unassigned\n- Reporter: John Doe\n\n**Dates:**\n- Created: 2024-01-15T10:30:00.000Z\n- Updated: 2024-01-15T10:30:00.000Z\n- Due Date: Not set\n\n**Metadata:**\n- Labels: None\n- Components: None\n- Fix Versions: None\n\n**YOUR TASK:**\nAnalyze this ticket comprehensively and use the available Jira tools to:\n1. Search for duplicate or similar tickets\n2. Get detailed information about related issues\n3. Review comments and changelog history\n4. Add comments, attachments, or update the ticket as needed\n5. Provide comprehensive analysis with actionable insights\n\nUse the appropriate tools based on what you need to accomplish."
    }
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "search_jira",
        "description": "Search for Jira issues using JQL query",
        "parameters": {
          "type": "object",
          "properties": {
            "query": {
              "type": "string",
              "description": "JQL query string"
            }
          },
          "required": ["query"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "get_jira_issue",
        "description": "Get full details of a specific Jira issue",
        "parameters": {
          "type": "object",
          "properties": {
            "issue_key": {
              "type": "string",
              "description": "Jira issue key (e.g., PROJ-123)"
            }
          },
          "required": ["issue_key"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "create_jira_issue",
        "description": "Create a new Jira issue",
        "parameters": {
          "type": "object",
          "properties": {
            "project": {
              "type": "string",
              "description": "Project key"
            },
            "summary": {
              "type": "string",
              "description": "Issue summary"
            },
            "description": {
              "type": "string",
              "description": "Issue description"
            },
            "issue_type": {
              "type": "string",
              "description": "Issue type (e.g., Bug, Task, Story)"
            }
          },
          "required": ["project", "summary"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "update_jira_issue",
        "description": "Update an existing Jira issue",
        "parameters": {
          "type": "object",
          "properties": {
            "issue_key": {
              "type": "string",
              "description": "Jira issue key"
            },
            "summary": {
              "type": "string",
              "description": "Updated summary"
            },
            "description": {
              "type": "string",
              "description": "Updated description"
            },
            "status": {
              "type": "string",
              "description": "Status name to transition to"
            }
          },
          "required": ["issue_key"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "add_jira_comment",
        "description": "Add a comment to a Jira issue",
        "parameters": {
          "type": "object",
          "properties": {
            "issue_key": {
              "type": "string",
              "description": "Jira issue key"
            },
            "comment": {
              "type": "string",
              "description": "Comment text"
            }
          },
          "required": ["issue_key", "comment"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "get_jira_comments",
        "description": "Get all comments for a Jira issue",
        "parameters": {
          "type": "object",
          "properties": {
            "issue_key": {
              "type": "string",
              "description": "Jira issue key"
            }
          },
          "required": ["issue_key"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "get_jira_changelog",
        "description": "Get changelog/history for a Jira issue",
        "parameters": {
          "type": "object",
          "properties": {
            "issue_key": {
              "type": "string",
              "description": "Jira issue key"
            }
          },
          "required": ["issue_key"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "add_jira_attachment",
        "description": "Add an attachment to a Jira issue",
        "parameters": {
          "type": "object",
          "properties": {
            "issue_key": {
              "type": "string",
              "description": "Jira issue key"
            },
            "filename": {
              "type": "string",
              "description": "Attachment filename"
            },
            "content": {
              "type": "string",
              "description": "Base64 encoded file content"
            }
          },
          "required": ["issue_key", "filename", "content"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "get_jira_attachments",
        "description": "Get all attachments for a Jira issue",
        "parameters": {
          "type": "object",
          "properties": {
            "issue_key": {
              "type": "string",
              "description": "Jira issue key"
            }
          },
          "required": ["issue_key"]
        }
      }
    }
  ],
  "max_tokens": 4096
}'
```

## 2. OpenAI (GPT-4 Turbo with Function Calling)

```bash
curl --location 'https://api.openai.com/v1/chat/completions' \
--header 'Authorization: Bearer YOUR_OPENAI_API_KEY' \
--header 'Content-Type: application/json' \
--data '{
  "model": "gpt-4-turbo-preview",
  "messages": [
    {
      "role": "user",
      "content": "Analyze this Jira ticket with all available details:\n\n**Basic Information:**\n- Key: KAN-830\n- Summary: testing sameer\n- Description: No description\n- Project: KAN\n- Issue Type: Task\n- Status: To Do\n- Priority: Medium\n- Resolution: Unresolved\n\n**People:**\n- Assignee: Unassigned\n- Reporter: John Doe\n\n**Dates:**\n- Created: 2024-01-15T10:30:00.000Z\n- Updated: 2024-01-15T10:30:00.000Z\n- Due Date: Not set\n\n**Metadata:**\n- Labels: None\n- Components: None\n- Fix Versions: None\n\n**YOUR TASK:**\nAnalyze this ticket comprehensively and use the available Jira tools to:\n1. Search for duplicate or similar tickets\n2. Get detailed information about related issues\n3. Review comments and changelog history\n4. Add comments, attachments, or update the ticket as needed\n5. Provide comprehensive analysis with actionable insights\n\nUse the appropriate tools based on what you need to accomplish."
    }
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "search_jira",
        "description": "Search for Jira issues using JQL query",
        "parameters": {
          "type": "object",
          "properties": {
            "query": {
              "type": "string",
              "description": "JQL query string"
            }
          },
          "required": ["query"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "get_jira_issue",
        "description": "Get full details of a specific Jira issue",
        "parameters": {
          "type": "object",
          "properties": {
            "issue_key": {
              "type": "string",
              "description": "Jira issue key (e.g., PROJ-123)"
            }
          },
          "required": ["issue_key"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "create_jira_issue",
        "description": "Create a new Jira issue",
        "parameters": {
          "type": "object",
          "properties": {
            "project": {
              "type": "string",
              "description": "Project key"
            },
            "summary": {
              "type": "string",
              "description": "Issue summary"
            },
            "description": {
              "type": "string",
              "description": "Issue description"
            },
            "issue_type": {
              "type": "string",
              "description": "Issue type (e.g., Bug, Task, Story)"
            }
          },
          "required": ["project", "summary"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "update_jira_issue",
        "description": "Update an existing Jira issue",
        "parameters": {
          "type": "object",
          "properties": {
            "issue_key": {
              "type": "string",
              "description": "Jira issue key"
            },
            "summary": {
              "type": "string",
              "description": "Updated summary"
            },
            "description": {
              "type": "string",
              "description": "Updated description"
            },
            "status": {
              "type": "string",
              "description": "Status name to transition to"
            }
          },
          "required": ["issue_key"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "add_jira_comment",
        "description": "Add a comment to a Jira issue",
        "parameters": {
          "type": "object",
          "properties": {
            "issue_key": {
              "type": "string",
              "description": "Jira issue key"
            },
            "comment": {
              "type": "string",
              "description": "Comment text"
            }
          },
          "required": ["issue_key", "comment"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "get_jira_comments",
        "description": "Get all comments for a Jira issue",
        "parameters": {
          "type": "object",
          "properties": {
            "issue_key": {
              "type": "string",
              "description": "Jira issue key"
            }
          },
          "required": ["issue_key"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "get_jira_changelog",
        "description": "Get changelog/history for a Jira issue",
        "parameters": {
          "type": "object",
          "properties": {
            "issue_key": {
              "type": "string",
              "description": "Jira issue key"
            }
          },
          "required": ["issue_key"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "add_jira_attachment",
        "description": "Add an attachment to a Jira issue",
        "parameters": {
          "type": "object",
          "properties": {
            "issue_key": {
              "type": "string",
              "description": "Jira issue key"
            },
            "filename": {
              "type": "string",
              "description": "Attachment filename"
            },
            "content": {
              "type": "string",
              "description": "Base64 encoded file content"
            }
          },
          "required": ["issue_key", "filename", "content"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "get_jira_attachments",
        "description": "Get all attachments for a Jira issue",
        "parameters": {
          "type": "object",
          "properties": {
            "issue_key": {
              "type": "string",
              "description": "Jira issue key"
            }
          },
          "required": ["issue_key"]
        }
      }
    }
  ],
  "max_tokens": 4096
}'
```

## Notes:

1. **OpenRouter**: Replace `YOUR_OPENROUTER_API_KEY` with your OpenRouter API key
2. **OpenAI**: Replace `YOUR_OPENAI_API_KEY` with your OpenAI API key
3. **Model Options for OpenAI**:
   - `gpt-4-turbo-preview` (recommended for function calling)
   - `gpt-4-1106-preview`
   - `gpt-4`
4. **Update ticket details** in the message content with actual values from your Jira ticket
5. Both APIs support the same function calling format, so the tools structure is identical

