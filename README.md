# thunderbird-mcp

This repository contains a Thunderbird extension that exposes experimental APIs for
accessing the Thunderbird search index, managing the calendar, searching contacts, and sending mail.
The extension also starts a small HTTP server (referred to as the MCP server)
that exposes these capabilities using JSON-RPC 2.0 messages.
MCP stands for **Model Context Protocol**; see <https://modelcontextprotocol.io/specification/2025-06-18> for the specification.

## Extension contents

```
extension/
├── background.js        - Starts the MCP server
├── manifest.json        - Extension manifest
├── search_index/
│   ├── api.mjs
│   └── schema.json
├── calendar/
│   ├── api.mjs
│   └── schema.json
└── contacts/
    ├── api.mjs
    └── schema.json
```

The experimental APIs integrate with Thunderbird's search index and calendar
services and are usable from other scripts via the MCP server.

## Loading the extension in Thunderbird

1. Open Thunderbird and navigate to `Add-ons and Themes`.
2. Use `Debug Add-ons` to load the `extension` directory as a temporary add-on.
3. The extension will start the MCP server on `http://localhost:8765`.
   Send JSON-RPC requests via `POST /`.
   - `tools/list` returns available tools
   - `tools/call` invokes one of the tools with arguments

The extension requires Thunderbird 102 or later.
