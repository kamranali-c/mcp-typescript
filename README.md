# mcp-typescript

# Simple MCP Server Setup for Codex

This guide shows how to:

1. Create a basic MCP server in TypeScript
2. Add a simple tool
3. Run it locally
4. Connect it to Codex

---

## 1. Create the project

Run:

```bash
mkdir my-mcp-server
cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk
npm install zod
npm install -D typescript tsx @types/node
brew install codex
```
2. Update package.json

Replace the contents of package.json with:
```bash
{
  "name": "my-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "start": "tsx src/index.ts"
  }
}
```
and create a tsconfig.json file in the root of the project:

```bash
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts"]
}
```

3. Create the source file

Run:
```
mkdir -p src
touch src/index.ts
```

4. Add empty boilerplate

Start with a minimal MCP server.

Put this in src/index.ts:

```bash
#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "my-mcp-server",
  version: "1.0.0",
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("MCP server failed to start:", error);
  process.exit(1);
});
```

5. Add a tool

Now add a simple tool so Codex has something to call.

Replace src/index.ts with:

```
#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "my-mcp-server",
  version: "1.0.0",
});

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
  console.error("MCP server failed to start:", error);
  process.exit(1);
});
```

6. Run the server

Run:

```bash
npm run start
```

If it looks like it is hanging, that is normal.
It is waiting for an MCP client to connect.

7. Connect to Codex

Add the server to Codex:

```bash
codex mcp add my-mcp-server -- npx -y tsx /absolute/path/to/my-mcp-server/src/index.ts
```

Example:

```bash
codex mcp add my-mcp-server -- npx -y tsx /Users/kamran/Documents/Repos/my-mcp-server/src/index.ts
```

Then check it is registered:
```bash
codex mcp list
```
8. Test in Codex

Ask Codex to use the tool:

```bash
Use the say_hello tool with name "Kamran"
```

Expected result:

```bash
Hello, Kamran
```
