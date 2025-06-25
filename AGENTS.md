# Repository Guidelines

This project targets the latest Thunderbird release. Use modern JavaScript (ES6 or newer) supported by that version.

MCP stands for **Model Context Protocol**, a lightweight HTTP API specification described at <https://modelcontextprotocol.io/specification/2025-06-18>.

## Style rules
- Prefer `const` and `let` over `var`.
- Follow Thunderbird's extension guidelines unless they conflict with the core objectives.

## Core objectives
- Expose a server compliant with the Model Context Protocol (MCP).
- Allow searching for mails using Thunderbird's index.
- Allow sending mail.
- Allow searching for email addresses the user had contact with.
- Allow managing the calendar.
