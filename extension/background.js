/* global messenger */
const { HttpServer } = ChromeUtils.import("resource://testing-common/httpd.js");
const { NetUtil } = ChromeUtils.import("resource://gre/modules/NetUtil.jsm");

function readRequestBody(request) {
  const stream = request.bodyInputStream;
  const available = stream.available();
  return NetUtil.readInputStreamToString(stream, available);
}

const tools = [
  {
    name: "searchMessages",
    title: "Search Mail",
    description: "Find messages using Thunderbird's search index",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
    },
  },
  {
    name: "sendMail",
    title: "Send Mail",
    description: "Compose and send a new message",
    inputSchema: {
      type: "object",
      properties: {
        to: { type: "string" },
        subject: { type: "string" },
        body: { type: "string" },
      },
      required: ["to", "subject", "body"],
    },
  },
  {
    name: "listCalendars",
    title: "List Calendars",
    description: "Return the user's calendars",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "searchContacts",
    title: "Search Contacts",
    description: "Find contacts the user interacted with",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
    },
  },
];

async function callTool({ name, arguments: args }) {
  switch (name) {
    case "searchMessages":
      return messenger.searchIndex.query({ text: args.query });
    case "sendMail":
      const created = await messenger.compose.beginNew({
        to: [args.to],
        subject: args.subject,
        body: args.body,
      });
      await messenger.compose.sendMessage(created.id, { mode: "sendNow" });
      return "sent";
    case "listCalendars":
      return messenger.calendarMcp.listCalendars();
    case "searchContacts":
      return messenger.contactsMcp.search(args.query);
    default:
      throw new Error(`Unknown tool ${name}`);
  }
}

function startServer() {
  const server = new HttpServer();

  server.registerPathHandler("/", async (req, res) => {
    if (req.method !== "POST") {
      res.setStatusLine("1.1", 405, "Method Not Allowed");
      res.write("POST only");
      return;
    }

    let message;
    try {
      const body = readRequestBody(req);
      message = JSON.parse(body);
    } catch (e) {
      res.setStatusLine("1.1", 400, "Bad Request");
      res.write("invalid JSON");
      return;
    }

    const { id, method, params } = message;
    let result;
    try {
      switch (method) {
        case "tools/list":
          result = { tools };
          break;
        case "tools/call":
          result = { content: await callTool(params) };
          break;
        default:
          res.setStatusLine("1.1", 404, "Not Found");
          res.write("Unknown method");
          return;
      }
      res.setStatusLine("1.1", 200, "OK");
      res.setHeader("Content-Type", "application/json", false);
      res.write(JSON.stringify({ jsonrpc: "2.0", id, result }));
    } catch (e) {
      res.setStatusLine("1.1", 500, "Internal Server Error");
      res.write(JSON.stringify({ jsonrpc: "2.0", id, error: e.toString() }));
    }
  });

  server.start(8765);
  console.log("MCP server listening on port 8765");
}

messenger.runtime.onInstalled.addListener(startServer);
messenger.runtime.onStartup.addListener(startServer);
