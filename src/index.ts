#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "kamran-tools",
  version: "1.0.0",
});

// Tool 1: simple sanity check
server.registerTool(
  "say_hello",
  {
    title: "Say hello",
    description: "Return a hello message for a given name.",
    inputSchema: z.object({
      name: z.string().min(1),
    }),
    outputSchema: z.object({
      message: z.string(),
    }),
  },
  async ({ name }) => {
    const output = { message: `Hello, ${name}` };

    return {
      content: [{ type: "text", text: output.message }],
      structuredContent: output,
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  // Important: stderr is safe for stdio MCP servers
  console.error("MCP server failed to start:", error);
  process.exit(1);
});
