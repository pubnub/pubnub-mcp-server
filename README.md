![MCP Server Logo](https://github.com/pubnub/pubnub-mcp-server/raw/main/context/pubnub-mcp-server-model-context-protocol.jpg)

# PubNub Model Context Protocol (MCP) Server for Cursor IDE

This repository provides a CLI-based Model Context Protocol (MCP) server that exposes PubNub SDK documentation and PubNub API resources to LLM-powered tools.
This improves the LLM AI Agent's ability to understand and interact with PubNub's SDKs and APIs.

![With PubNub MCP vs Without](https://github.com/pubnub/pubnub-mcp-server/raw/main/context/pubnub-mcp-vs-no-mcp.jpg)

## Features

- MCP server exposing tools for interacting with PubNub via JSON-RPC over STDIN/STDOUT.
- Retrieve official PubNub SDK documentation (HTML → Markdown) for:
  - Languages: JavaScript, Python, Java, Go, Ruby, Swift, Objective-C, C#, PHP, Rust, Unity, Kotlin, Unreal.
  - API reference sections: configuration, publish-and-subscribe, presence, access-manager, channel-groups, storage-and-playback, mobile-push, objects, files, message-actions, misc, functions.
- Fetch PubNub conceptual guides and how-to documentation from local markdown files in the `resources` directory (e.g., `pubnub_concepts`, `pubnub_features`, `pubnub_security`, `how_to_send_receive_json`, `how_to_encrypt_messages_files`, etc.).
- Publish messages to PubNub channels with `publish_pubnub_message`, returning a timetoken.
- Fetch historical messages from one or more channels with `get_pubnub_messages`, returning message content and metadata in JSON.
- Retrieve real-time presence information (occupancy counts, subscriber UUIDs) for channels and channel groups with `get_pubnub_presence`.
- Generate step-by-step instructions for creating a PubNub application, including code snippets for initializing the PubNub SDK in multiple languages using `write_pubnub_app`.
- Environment variable configuration: supports `PUBNUB_PUBLISH_KEY` and `PUBNUB_SUBSCRIBE_KEY` for authenticating SDK operations.
- Converts remote HTML articles to Markdown using `jsdom` and `turndown` for consistent documentation formatting.
- Input validation via Zod schemas for all tool parameters, ensuring robust error handling.
- Extensible tool definitions leveraging the Model Context Protocol SDK (`@modelcontextprotocol/sdk`) with `McpServer` and `StdioServerTransport`.

## Example Prompts

- "Write a PubNub app that lets the user watch streaming videos with built-in multi-user chat with PubNub."
- "Write a PubNub app for on-demand delivery of groceries with a map."
- "Write a PubNub app that tracks the location of a package in real-time."
- "Write a PubNub app that shows the weather forecast in real-time."
- "Write a PubNub app that lets users play multiplayer games with friends."
- "Write a PubNub app that shows live stock prices and news updates."
- "Write a PubNub app that lets users create and share playlists with friends."
- "Build a PubNub JavaScript app that subscribes to the `my_channel` channel and logs messages to the console."
- "Publish a message to the `my_channel` channel with the message `Hello, PubNub!`."
- "Show me the PubNub JavaScript SDK documentation for `subscribe()`."
- "List all available PubNub Functions."
- "Fetch the Python SDK docs for the `publish()` method."
- "Fetch the message history for the `test` channel."
- "Retrieve presence information (occupancy and UUIDs) for the `test` channel and the `default` channel group."

This requires Node.js (>= 18) and npm (https://nodejs.org/).
`npx` will automatically fetch and run the latest MCP server.

## Prerequisites

- Node.js (>= 18) and npm
- Cursor IDE with MCP support
- (Optional) PubNub account and API keys for live examples

## Installation

The preferred way to run the PubNub MCP server locally or add it to Cursor IDE via npx:

```bash
npx -y @pubnub/mcp
```

## Configuration

> *Cursor must be in AGENT MODE to use MCP servers.*

Cursor IDE discovers MCP servers via a JSON config file.
Configure the PubNub MCP server globally or per project.

### Global Configuration

Edit or create `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "pubnub": {
      "command": "npx",
      "args": ["-y", "@pubnub/mcp"],
      "env": {
        "PUBNUB_PUBLISH_KEY": "YOUR_PUBLISH_KEY",
        "PUBNUB_SUBSCRIBE_KEY": "YOUR_SUBSCRIBE_KEY"
      }
    }
  }
}
```

### Project Configuration

In your project directory, create `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "pubnub": {
      "command": "npx",
      "args": ["-y", "@pubnub/mcp"],
      "env": {
        "PUBNUB_PUBLISH_KEY": "YOUR_PUBLISH_KEY",
        "PUBNUB_SUBSCRIBE_KEY": "YOUR_SUBSCRIBE_KEY"
      }
    }
  }
}
```

### Docker-Based Configuration

If you prefer to run the MCP server via Docker, set your PubNub keys as environment variables:

```bash
export PUBNUB_PUBLISH_KEY=YOUR_PUBLISH_KEY
export PUBNUB_SUBSCRIBE_KEY=YOUR_SUBSCRIBE_KEY
```

Then configure your `~/.cursor/mcp.json` (or `.cursor/mcp.json` in your project):

```json
{
  "mcpServers": {
    "pubnub": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "-e",
        "PUBNUB_PUBLISH_KEY",
        "-e",
        "PUBNUB_SUBSCRIBE_KEY",
        "pubnub/pubnub-mcp-server"
      ]
    }
  }
}
```

- `command` specifies the executable to launch the MCP server.
- `args` specifies the arguments to pass to the command.
- `env` sets environment variables for the server process.

## Using in Cursor IDE

1. Restart Cursor IDE or open a new session.
2. Open the MCP settings pane and verify the **pubnub** server is listed under **Available Tools & Resources**.
3. In chat, invoke available resources:
   - `pubnub://docs/javascript` — Fetch PubNub JavaScript SDK documentation
   - `pubnub://docs/python` — Fetch PubNub Python SDK documentation
   - `pubnub://docs/java` — Fetch PubNub Java SDK documentation
   - `pubnub://functions` — List PubNub Functions (static content from `resources/pubnub_functions.md`)
4. Approve resource execution when prompted, or enable **auto-run** in settings for trusted resources.

## Claude Code

```shell
## Install the MCP server if you have node >= 18
claude mcp add pubnub -e PUBNUB_PUBLISH_KEY=your_publish_key -e PUBNUB_SUBSCRIBE_KEY=your_subscribe_key -- npx -y @pubnub/mcp

## Install the MCP server if you have node < 18 and need to point to the full path of node
claude mcp add pubnub -e PUBNUB_PUBLISH_KEY=your_publish_key -e PUBNUB_SUBSCRIBE_KEY=your_subscribe_key -- /Users/stephen/.nvm/versions/node/v22.14.0/bin/node /Users/stephen/Projects/mcp-pubnub/index.js

## Install the MCP server using Docker
# Ensure your PubNub keys are set as environment variables:
export PUBNUB_PUBLISH_KEY=your_publish_key
export PUBNUB_SUBSCRIBE_KEY=your_subscribe_key

# Depending on your machine’s CPU architecture, you may need to specify the target platform.
# For example:
#   docker run --platform linux/arm64 -i pubnub/pubnub-mcp-server
#   docker run --platform linux/amd64 -i pubnub/pubnub-mcp-server

claude mcp add pubnub -- docker run -i \
  -e PUBNUB_PUBLISH_KEY=$PUBNUB_PUBLISH_KEY \
  -e PUBNUB_SUBSCRIBE_KEY=$PUBNUB_SUBSCRIBE_KEY \
  pubnub/pubnub-mcp-server
```

And the output will be:
```shell
Added stdio MCP server pubnub with command: npx -y @pubnub/mcp to local config
```

### Example prompt
```shell
claude "publish a message 'hi' to the 'my_channel' pubnub channel."
```

```shell
claude "publish a message 'hi' to the 'my_channel' pubnub channel."

╭───────────────────────────────────────────────────╮
│ ✻ Welcome to Claude Code research preview!        │
│                                                   │
│   /help for help, /status for your current setup  │
│                                                   │
│   cwd: /Users/stephen/Projects/mcp-pubnub         │
╰───────────────────────────────────────────────────╯

 ※ Tip: Press Option+Enter to send a multi-line message

> publish a message 'hi' to the 'my_channel' pubnub channel.

⏺ I'll publish a message to the PubNub channel for you.

⏺ pubnub:publish_pubnub_message (MCP)(channel: "my_channel", message: "hi")…
  ⎿  Message published successfully. Timetoken: 17467422499409217

⏺ Message published successfully to "my_channel".
```

Remove the MCP server with:

```shell
claude mcp remove pubnub
```

## Using Claude Desktop

If you prefer the Docker-based MCP server in Claude Desktop:

1. Ensure your PubNub keys are exported in your shell:
   ```bash
   export PUBNUB_PUBLISH_KEY=your_publish_key
   export PUBNUB_SUBSCRIBE_KEY=your_subscribe_key
   ```
2. In the **Tools** section of Claude Desktop, add a new tool named **pubnub**.
3. Set the **Command** to `docker`.
4. Set **Arguments** to:
   ```json
   [
     "run",
     "-i",
     "-e",
     "PUBNUB_PUBLISH_KEY",
     "-e",
     "PUBNUB_SUBSCRIBE_KEY",
     "pubnub/pubnub-mcp-server"
   ]
   ```

> **Note:** On some machines (e.g., Apple Silicon), you may need to specify the Docker platform.
> Insert `--platform linux/arm64` (or `--platform linux/amd64`) immediately after `"run"` in the Arguments array. For example:
>
> ```json
> [
>   "run",
>   "--platform", "linux/arm64",
>   "-i",
>   "-e", "PUBNUB_PUBLISH_KEY",
>   "-e", "PUBNUB_SUBSCRIBE_KEY",
>   "pubnub/pubnub-mcp-server"
> ]
> ```
5. Save the configuration.

Claude Desktop will invoke the PubNub MCP server container via Docker.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Troubleshooting

- Must be in agent mode to use MCP servers.
- Verify Node.js and npm installation.
- Ensure `index.js` has execute permission.
- Check that the `command`, `args`, and `env` settings are correct.
- Review Cursor IDE logs for MCP startup errors.

## Direct JSON-RPC Command-Line Usage

You can invoke the MCP server directly over STDIN/STDOUT using JSON-RPC v2.0.
Ensure your PubNub keys are set in the environment, for example:
```bash
PUBNUB_PUBLISH_KEY=YOUR_PUBLISH_KEY \
PUBNUB_SUBSCRIBE_KEY=YOUR_SUBSCRIBE_KEY \
  node index.js
```

Once the server is running (or using a one-off invocation), send requests by piping JSON into `node index.js`. Examples:
```bash
# 1) List available tools
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' \
  | node index.js

# 2) Read PubNub JavaScript SDK documentation
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":
  {"name":"read_pubnub_sdk_docs","arguments":{"language":"javascript"}}}' \
  | node index.js

# 3) Read PubNub Functions Resource docs (static Markdown)
echo '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"read_pubnub_resources","arguments":{"document":"pubnub_functions"}}}' \
  | node index.js

```

## Quick JSON-RPC Examples

Below are simplified JSON-RPC v2.0 command-line examples using STDIN/STDOUT to fetch PubNub SDK documentation and publish messages.

### 1) Fetch PubNub JavaScript SDK documentation
```bash
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"read_pubnub_sdk_docs","arguments":{"language":"javascript"}}}' | node index.js
```

### 2) Publish a message to a PubNub channel
```bash
PUBNUB_PUBLISH_KEY=demo \
PUBNUB_SUBSCRIBE_KEY=demo \
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"publish_pubnub_message","arguments":{"channel":"my_channel","message":"Hello, PubNub MCP JSON-RPC!"}}}' \
  | node index.js
```

