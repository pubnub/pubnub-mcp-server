# PubNub MCP Server v2

This repository provides a CLI-based Model Context Protocol (MCP) server that exposes PubNub SDK documentation and PubNub API resources to LLM-powered tools. This improves the LLM AI Agent's ability to understand and interact with PubNub's SDKs and APIs.

![PubNub MCP Server v2](https://github.com/pubnub/pubnub-mcp-server/raw/main/images/pubnub-mcp-server.jpg)


## Features

- **📚 Comprehensive SDK Documentation** - Access detailed documentation, code examples, and implementation guides for 20+ programming languages including JavaScript, Python, Java, Swift, Kotlin, C#, Ruby, Go, and more
- **🏗️ Application & Keyset Management** - Create, configure, and manage PubNub applications and keysets with features like message persistence, file sharing, presence tracking, and app context
- **💬 Real-time Communication** - Send and receive messages across channels, implement live chat, notifications, and real-time updates with support for both messages and lightweight signals
- **👥 User & Channel Management** - Manage user profiles, channel metadata, and membership relationships with full CRUD operations for building community and social features
- **📍 Presence & Activity Tracking** - Monitor real-time user presence, see who's online in channels, and track user activity across your application
- **🔧 Multi-Platform Integration** - Works with Cursor, Visual Studio Code, Claude Code, and other MCP-compatible AI assistants
- **⚡ Developer Experience** - Built with TypeScript for type safety, includes testing infrastructure, and can be installed as either a Node package or a Docker image

## Quick Start

### API Key

Before you begin, we highly recommend [creating a Service Integration](https://www.pubnub.com/docs/admin-api#get-the-api-key) in the PubNub Admin Portal and providing your API key to the MCP server. While some basic features will work without it, adding an API key unlocks much more functionality. Alternatively, see Advanced Usage for instructions on configuring the server to work with a single PubNub keyset.

The installation process for an MCP server depends on the AI assistant you’re using. For the standard setup, you’ll need [Node.js](https://nodejs.org/en).

### VS Code

[![Open in VS Code](https://github.com/pubnub/pubnub-mcp-server/raw/main/images/add-to-vscode.png)](https://vscode.dev/redirect/mcp/install?name=PubNub&inputs=%5B%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22pubnub-api-key%22%2C%22description%22%3A%22PubNub%20API%20Key%22%7D%5D&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40pubnub%2Fmcp%40latest%22%5D%2C%22env%22%3A%7B%22PUBNUB_API_KEY%22%3A%22%24%7Binput%3Apubnub-api-key%7D%22%7D%7D)

Just click the link above, then select “Open in Visual Studio Code” on the page that appears. Back in VS Code, click “Install”. You’ll be prompted to enter your PubNub API Key. Once provided, your MCP server is ready to use. For additional configuration options, see Advanced usage.


### Cursor

[![Add to Cursor](https://github.com/pubnub/pubnub-mcp-server/raw/main/images/add-to-cursor.png)](https://tinyurl.com/pubnub-mcp-v2)

Click the link above, then select "Open Cursor" on the page that appears. Back in Cursor, there's a "Install MCP Server?" prompt. Make sure to provide the value for variable holding your PubNub API Key. Once you do, click "Install". Your MCP server is now ready to use. For additional configuration options, see Advanced usage.

### Claude Code

With Claude Code installed run this command to have the MCP added to your configuration. Make sure to replace the value of `<your-api-key>`:

```
claude mcp add PubNub --env PUBNUB_API_KEY=<your-api-key> --scope user --transport stdio -- npx -y @pubnub/mcp@latest
```

Server is added in the "User" scope which means it will be available accross all projects. For additional configuration options, see Advanced usage.

### Codex

With Codex installed run this command to have the MCP added to your configuration. Make sure to replace the value of `<your-api-key>`:

```
codex mcp add PubNub --env PUBNUB_API_KEY=<your-api-key> -- npx -y @pubnub/mcp@latest
```

For additional configuration options, see Advanced usage.

### Gemini CLI

Gemini CLI does not support automatic MCP installations. You'll have manually edit your [settings.json](https://geminicli.com/docs/cli/settings/) file and add the section below. Make sure to replace the value of `<your-api-key>`:

```
"mcpServers": {
  "pubnub": {
    "command": "npx",
    "args": [
      "-y",
      "@pubnub/mcp@latest"
    ],
    "env": {
      "PUBNUB_API_KEY": "<your-api-key>"
    }
  }
}
```

For additional configuration options, see Advanced usage.

## Advanced usage

### Configuration

- **`PUBNUB_API_KEY`** - Your PubNub API Key. Required for all operations related to your account/keyset
- **`PUBNUB_PUBLISH_KEY`** - Optional PubNub publish key for real-time operations
- **`PUBNUB_SUBSCRIBE_KEY`** - Optional PubNub subscribe key for real-time operations
- **`PUBNUB_USER_ID`** - Optional variable that can be provided to change the User ID for the SDK (real-time) operations (default: `pubnub-mcp`)
- **`PUBNUB_EMAIL`** - (Deprecated - use API Key instead) Your PubNub account email. Required for all operations related to your account/keyset
- **`PUBNUB_PASSWORD`** - (Deprecated - use API Key instead) Your PubNub account password. Required for all operations related to your account/keyset

### PubNub Keys Configuration

The MCP server supports two modes for handling PubNub publish/subscribe keys:

#### Dynamic Mode (No env keys set)

When `PUBNUB_PUBLISH_KEY` and `PUBNUB_SUBSCRIBE_KEY` are **not provided**, the server operates in dynamic mode:

- Tools will request keys as parameters in each call
- The AI agent can work with **multiple keysets** in a single session
- Keys can be discovered dynamically via `list_keysets` tool
- More autonomous - the agent decides which keyset to use based on context

This mode is ideal when you want the AI to help manage multiple applications or when the keyset should be determined at runtime.

#### Fixed Mode (Env keys set)

When both `PUBNUB_PUBLISH_KEY` and `PUBNUB_SUBSCRIBE_KEY` are **provided**, the server operates in fixed mode:

- PubSub Keys parameters are **hidden** from tool schemas entirely
- All real-time operations use the configured keys automatically
- Operations are **limited to a single keyset**

This mode is ideal for focused workflows where you're working with a specific application and want streamlined interactions.

**Example configuration with fixed keys:**

```json
{
  "env": {
    "PUBNUB_API_KEY": "<your-api-key>",
    "PUBNUB_PUBLISH_KEY": "pub-c-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "PUBNUB_SUBSCRIBE_KEY": "sub-c-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }
}
```

### Docker-Based Usage

If you prefer to run the MCP server via Docker, use the snippet below in your editor's config file `mcpServers` or `servers` section of the mcp.json:

```json
{
  "mcpServers": {
    "PubNub": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "PUBNUB_API_KEY",
        "pubnub/pubnub-mcp-server"
      ],
      "env": {
        "PUBNUB_API_KEY": "<your-api-key>",
      }
    }
  }
}
```

## API Reference

This PubNub MCP server provides a comprehensive set of tools, resources, and prompts to help you build real-time applications. Below is a complete reference of all available functionality:

### Tools

#### Documentation Access

- **`get_sdk_documentation`** - Get PubNub SDK documentation for specific programming languages and features
- **`get_chat_sdk_documentation`** - Get PubNub Chat SDK documentation for specific programming languages and features

#### Account & App Management

- **`get_account_info`** - Retrieve account subscription status and feature availability
- **`list_apps`** - List all PubNub apps on your account
- **`create_app`** - Create a new PubNub app with custom name
- **`update_app`** - Update an existing PubNub app name
- **`get_usage_metrics`** - Fetch usage metrics for an account, app, or keyset (requires API key authentication)

#### Keyset Management

- **`list_keysets`** - List all keysets on your account or within a specific app
- **`create_keyset`** - Create a new keyset with default features enabled (Message Persistence, App Context, Files, Presence)
- **`update_keyset`** - Modify properties of an existing keyset

#### Real-time Communication

- **`send_pubnub_message`** - Send messages or lightweight signals to PubNub channels in real-time
- **`subscribe_and_receive_pubnub_messages`** - Subscribe to channels and receive real-time messages with configurable timeout and message limits

#### Other PubNub features

- **`manage_app_context`** - Manage PubNub App Context (Objects API) for users, channels, and memberships with full CRUD operations
- **`get_pubnub_presence`** - Get presence data using HereNow (channel occupancy) or WhereNow (user's channels)

### Prompts

#### Healthcare & HIPAA Compliance

- **`hipaa-chat-short`** - Quick prompt to create HIPAA compliant chat applications
- **`hipaa-chat-long`** - Detailed prompt for HIPAA compliant chat with Pub/Sub, Presence, and App Context

#### React Development

- **`react-app-short`** - Scaffold a React app with PubNub Pub/Sub and Presence
- **`react-app-long`** - Comprehensive React app with real-time messaging, presence indicators, and user metadata

#### Gaming Applications

- **`gamelobby-short`** - Build multiplayer game lobby with chat and presence
- **`gamelobby-long`** - Advanced multiplayer lobby with team assignments and real-time features

#### OEM & Multi-Tenant Solutions

- **`oem-client-management`** - Create apps and configure keysets for OEM client deployments
- **`multi-tenant-onboarding-short`** - Implement automated tenant onboarding for SaaS applications
- **`multi-tenant-onboarding-long`** - Enterprise-grade multi-tenant onboarding with data isolation and error handling


### Resources

- **`pubnub_sdk_docs`** - Access PubNub SDK documentation via URI scheme: `pubnub-docs://sdk/{language}/{feature}`

**Supported languages**: asyncio, c-core, c-sharp, dart, freertos, go, java, javascript, kotlin, mbed, objective-c, php, posix-c, posix-cpp, python, ruby, rust, swift, unity, unreal, windows-c, windows-cpp

**Supported features**: access-manager, access-manager-v2, channel-groups, configuration, encryption, files, message-actions, misc, mobile-push, objects, presence, publish-and-subscribe, storage-and-playback


- **`pubnub_chat_sdk_docs`** - Access PubNub Chat SDK documentation via URI scheme: `pubnub-docs://chat-sdk/{language}/{feature}`

**Supported Languages**: javascript, kotlin, swift, unity, unreal

**Supported Features**: channels-create, channels-delete, channels-details, channels-invite, channels-join, channels-leave, channels-list, channels-membership, channels-references, channels-typing-indicator, channels-updates, channels-watch, connection-management, custom-events, error-logging, messages-delete, messages-details, messages-drafts, messages-files, messages-forward, messages-history, messages-links, messages-moderation, messages-pinned, messages-quotes, messages-reactions, messages-read-receipts, messages-restore, messages-send-receive, messages-threads, messages-unread, messages-updates, moderation, push-notifications, users-create, users-delete, users-details, users-list, users-mentions, users-moderation, users-moderation-user, users-permissions, users-presence, users-updates, utility-methods