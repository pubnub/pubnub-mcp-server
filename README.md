# PubNub MCP Server

A hosted Model Context Protocol (MCP) server that exposes [PubNub SDK documentation](https://www.pubnub.com/docs/sdks) and PubNub API resources to LLM-powered tools. This improves the LLM AI Agent's ability to understand and interact with PubNub's SDKs and APIs. Uses HTTP transport with OAuth authentication.

![PubNub MCP Server](https://github.com/pubnub/pubnub-mcp-server/raw/master/images/pubnub-mcp-server.jpg)

## Features

- **📚 Comprehensive SDK Documentation** - Access detailed documentation, code examples, and implementation guides for 20+ programming languages including JavaScript, Python, Java, Swift, Kotlin, C#, Ruby, Go, and more
- **🏗️ Application & Keyset Management** - Create, configure, and manage PubNub applications and keysets with features like message persistence, file sharing, presence tracking, and app context
- **💬 Real-time Communication** - Send and receive messages across channels, implement live chat, notifications, and real-time updates with support for both messages and lightweight signals
- **👥 User & Channel Management** - Manage user profiles, channel metadata, and membership relationships with full CRUD operations for building community and social features. In addition, there is an option to view & manage user profiles, channels and memberships in PubNub Admin Portal (this requires Manage Premium).
- **📍 Presence & Activity Tracking** - Monitor real-time user presence, see who's online in channels, and track user activity across your application
- **📊 Real-time Decisioning & Analytics** - Trigger the right action when it matters, measure its impact, and adjust as conditions change -- all in real-time. Requires Illuminate.
- **📈 Channel, User & Message Analytics** - Spot patterns in aggregated app activity, from top channels and country breakdowns to new vs. recurring users and device distribution, to understand engagement, usage, and performance. In addition, limited metrics are available for viewing in PubNub Admin Portal without Manage Premium; full analytics require Manage Premium.
- **🔍 Usage & Monitoring** — Track billable usage across apps and keysets, review current and historical consumption, and export reports to understand cost drivers.
- **🔧 Multi-Platform Integration** - Works with Cursor, Visual Studio Code, Claude Code, and other MCP-compatible AI assistants
- **⚡ Developer Experience** - Built with TypeScript for type safety, includes testing infrastructure

## Quick Start

The [hosted server](https://mcp.pubnub.com) is managed by PubNub and provides the easiest way to get started — no installation required, and authentication is handled automatically via OAuth. If your AI tool doesn't support remote MCP servers, use the [locally installed version](#local-pubnub-mcp-server) (`npx @pubnub/mcp@latest`) instead.

> **Note:** To switch to the hosted server (https://mcp.pubnub.com), remove the old local configuration from your AI client first, then follow the setup steps below.

### Hosted PubNub MCP Server

Connect your AI assistant to `https://mcp.pubnub.com` — no installation required. Authentication is handled automatically via OAuth.

#### VS Code

[![Open in VS Code](https://github.com/pubnub/pubnub-mcp-server/raw/master/images/add-to-vscode.png)](https://vscode.dev/redirect/mcp/install?name=pubnub&config=%7B%22url%22%3A%22https%3A%2F%2Fmcp.pubnub.com%22%7D)

Click the button above, then select **Open in Visual Studio Code**. Back in VS Code, click **Install**, then select the organization you want to authorize and click **Allow access**.

Alternatively, add the following to your VS Code `settings.json` manually:

```json
{
  "mcp": {
    "servers": {
      "pubnub": {
        "url": "https://mcp.pubnub.com"
      }
    }
  }
}
```

[Learn more in VS Code documentation](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)

#### Cursor

[![Add to Cursor](https://github.com/pubnub/pubnub-mcp-server/raw/master/images/add-to-cursor.png)](https://tinyurl.com/pubnub-mcp-hosted)

Click the button above, then select **Open Cursor**. In Cursor, click **Install**, select the organization you want to authorize, and click **Allow access**. Navigate to Cursor Settings → **Tools & MCP** to verify PubNub is enabled.

Alternatively, add the following to `.cursor/mcp.json` (or `~/.cursor/mcp.json` for global configuration) manually:

```json
{
  "mcpServers": {
    "pubnub": {
      "url": "https://mcp.pubnub.com"
    }
  }
}
```

When you save the file, a notification is displayed. Click **Enable** to activate the MCP server. [Learn more in Cursor documentation](https://docs.cursor.com/context/model-context-protocol)

#### Claude Code

In the terminal, run:

```bash
claude mcp add --scope user --transport http pubnub https://mcp.pubnub.com
```

Then run `claude` to open Claude Code and enter `/mcp`. Select **pubnub**, then **authenticate**, and click **Allow access** to complete authorization. [Learn more in Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code/mcp)

#### Claude Desktop

> **Note:** The following instructions apply to **Pro** and **Max** plans. For **Enterprise** plans, the setup is configured by your organization administrator. Refer to [Anthropic's documentation](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) for details.

1. In Claude Desktop, navigate to **Customize → Connectors**.
2. Click **+** and select **Add custom connector**.
3. Enter `https://mcp.pubnub.com` as the connector URL.
4. Complete the OAuth login when prompted.

[Learn more in Claude Desktop documentation](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)

#### Codex

In the terminal, run:

```bash
codex mcp add pubnub --url https://mcp.pubnub.com
```

Then run `codex mcp login pubnub` to authenticate, select the organization you want to authorize, and click **Allow access**. [Learn more in Codex documentation](https://platform.openai.com/docs/guides/tools/model-context-protocol)

#### Codex Desktop

1. Navigate to **Settings → MCP servers** and click **+ Add server**.
2. Select **Streamable HTTP** as the transport type.
3. Enter `https://mcp.pubnub.com` as the server URL.
4. Follow the OAuth login prompt to complete authorization.

[Learn more in Codex Desktop documentation](https://help.openai.com/en/articles/11487775)

#### Gemini CLI

In the terminal, run:

```bash
gemini mcp add pubnub --scope user --transport http https://mcp.pubnub.com
```

Then run `gemini` to open Gemini CLI and run `/mcp auth pubnub` to authenticate. [Learn more in Gemini CLI documentation](https://github.com/google-gemini/gemini-cli)

#### OpenCode

Add the following to `~/.config/opencode/config.json`:

```json
{
  "mcp": {
    "pubnub": {
      "type": "remote",
      "url": "https://mcp.pubnub.com",
      "enabled": true
    }
  }
}
```

Then run `opencode mcp auth pubnub` to authenticate. [Learn more in OpenCode documentation](https://opencode.ai/docs)

### Local PubNub MCP Server

If your AI tool doesn't support remote MCP servers, run the server locally with:

```bash
npx @pubnub/mcp@latest
```

#### API Key

Before you begin, we highly recommend [creating a Service Integration](https://www.pubnub.com/docs/general/portal/service-integrations#create-a-service-integration) in the PubNub Admin Portal and providing your API key to the MCP server. While some basic features will work without it, adding an API key unlocks much more functionality. Alternatively, refer to [Local server configuration](https://www.pubnub.com/docs/ai/pubnub-mcp-server#local-server-configuration) for instructions on configuring the server to work with a single PubNub keyset.

The installation process for an MCP server depends on the AI assistant you're using. For the standard setup, you'll need [Node.js](https://nodejs.org/en) (v20.0.0 or higher).

#### VS Code

[![Open in VS Code](https://github.com/pubnub/pubnub-mcp-server/raw/master/images/add-to-vscode.png)](https://vscode.dev/redirect/mcp/install?name=pubnub&inputs=%5B%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22pubnub-api-key%22%2C%22description%22%3A%22PubNub%20API%20Key%22%7D%5D&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40pubnub%2Fmcp%40latest%22%5D%2C%22env%22%3A%7B%22PUBNUB_API_KEY%22%3A%22%24%7Binput%3Apubnub-api-key%7D%22%7D%7D)

Just click the link above, then select "Open in Visual Studio Code" on the page that appears. Back in VS Code, click "Install". You'll be prompted to enter your PubNub API Key. Once provided, your MCP server is ready to use. For additional configuration options, refer to [Local server configuration](https://www.pubnub.com/docs/ai/pubnub-mcp-server#local-server-configuration).

#### Cursor

[![Add to Cursor](https://github.com/pubnub/pubnub-mcp-server/raw/master/images/add-to-cursor.png)](https://tinyurl.com/pubnub-mcp-v2)

Click the link above, then select "Open Cursor" on the page that appears. Back in Cursor, there's a "Install MCP Server?" prompt. Make sure to provide the value for variable holding your PubNub API Key. Once you do, click "Install". Your MCP server is now ready to use. For additional configuration options, refer to [Local server configuration](https://www.pubnub.com/docs/ai/pubnub-mcp-server#local-server-configuration).

#### Claude Code

With Claude Code installed run this command to have the MCP added to your configuration. Make sure to replace the value of `<your-api-key>`:

```bash
claude mcp add pubnub --env PUBNUB_API_KEY=<your-api-key> --scope user --transport stdio -- npx -y @pubnub/mcp@latest
```

Server is added in the "User" scope which means it will be available across all projects. For additional configuration options, refer to [Local server configuration](https://www.pubnub.com/docs/ai/pubnub-mcp-server#local-server-configuration).

#### Codex

With Codex installed run this command to have the MCP added to your configuration. Make sure to replace the value of `<your-api-key>`:

```bash
codex mcp add pubnub --env PUBNUB_API_KEY=<your-api-key> -- npx -y @pubnub/mcp@latest
```

For additional configuration options, refer to [Local server configuration](https://www.pubnub.com/docs/ai/pubnub-mcp-server#local-server-configuration).

#### Gemini CLI

Gemini CLI does not support automatic MCP installations. You'll have to manually edit your [settings.json](https://geminicli.com/docs/cli/settings/) file and add the section below. Make sure to replace the value of `<your-api-key>`:

```json
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

For additional configuration options, refer to the [Local server configuration](https://www.pubnub.com/docs/ai/pubnub-mcp-server#local-server-configuration) section in the PubNub documentation.

## Development

### Prerequisites

- Node.js >= 20.0.0

### Running locally

```bash
npm install
npm run dev
```

### Environment variables

| Variable | Description | Required |
|---|---|---|
| `PORT` | HTTP server port (default: 3000) | No |
| `MCP_OAUTH_ENABLED` | Enable OAuth authentication | Yes (for production) |
| `OAUTH_ISSUER` | OAuth authorization server URL | When OAuth enabled |
| `OAUTH_CLIENT_ID` | OAuth client ID | When OAuth enabled |
| `OAUTH_CLIENT_SECRET` | OAuth client secret | When OAuth enabled |
| `ADMIN_API_RESOURCE_URL` | Admin API resource identifier | When OAuth enabled |
| `MCP_RESOURCE_URL` | MCP resource URL | When OAuth enabled |
| `MCP_CLOUD_MODE` | Cloud deployment mode | No |
| `MCP_SESSION_SUPPORT` | Enable session persistence | No |
| `ADMIN_API_V2_URL` | Override Admin API v2 endpoint | No |
| `PUBNUB_ORIGIN` | Override PubNub origin | No |
| `SDK_DOCS_API_URL` | Override docs API endpoint | No |

### Testing

```bash
npm run test:unit        # Unit tests
npm run test:integration # Integration tests (requires build)
npm run test:coverage    # Coverage report
```

## API Reference

This PubNub MCP server provides a comprehensive set of tools, resources, and prompts to help you build real-time applications. Below is a complete reference of all available functionality:

### Tools

#### Documentation Access

- **`get_sdk_documentation`** - Get PubNub Core SDK documentation for specific programming languages and features
- **`get_chat_sdk_documentation`** - Get PubNub Chat SDK documentation for specific programming languages and features
- **`how_to`** - Get PubNub conceptual guides for specific use cases and integrations
- **`write_pubnub_app`** - Get PubNub best practices guide covering architecture, security, channel modeling, and optimization
- **`get_sdk_migration_guide`** - Get SDK version migration guides
- **`get_general_migration_guide`** - Get general platform migration guides

#### App & Keyset Management

- **`manage_apps`** - Manage PubNub apps (list, create, update)
- **`manage_keysets`** - Manage PubNub keysets (get, list, create, update)
- **`get_usage_metrics`** - Fetch usage metrics for an account, app, or keyset

#### Real-time Communication

- **`send_pubnub_message`** - Send messages or lightweight signals to PubNub channels in real-time
- **`subscribe_and_receive_pubnub_messages`** - Subscribe to channels and receive real-time messages with configurable timeout and message limits
- **`get_pubnub_messages`** - Fetch historical messages from one or more PubNub channels
- **`get_pubnub_presence`** - Get presence data using HereNow (channel occupancy) or WhereNow (user's channels)
- **`manage_app_context`** - Manage PubNub App Context (Objects API) for users, channels, and memberships with full CRUD operations

#### Illuminate Analytics & Automation

- **`manage_illuminate`** - Manage PubNub Illuminate resources (business objects, queries, metrics, decisions, dashboards) with full CRUD, activation, analytics queries, action log inspection, and test data publishing

#### Insights Analytics

- **`insights`** - Query PubNub Insights for aggregated analytics metrics: unique channels/users, message volume, top-N rankings (channels, users, message types), country breakdowns, new vs. recurring user trends, user duration, and device type distributions. Requires a Service Integration API key with Account-level Insights Read access and Insights Premium tier.

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

#### Illuminate Analytics & Automation

- **`illuminate-spam-detection`** - Set up an Illuminate spam detection pipeline with escalating moderation actions
- **`illuminate-reward-engagement`** - Build an Illuminate engagement reward pipeline for live events and gaming
- **`illuminate-use-case`** - Guided setup of any Illuminate analytics and automation use case
- **`illuminate-test-verify`** - Test and verify an existing Illuminate configuration end-to-end

#### Insights Analytics

- **`insights-snapshot`** - Quick high-level analytics snapshot for a date range: unique channels, unique users, message volume, top 20 channels by messages, and anomaly callouts
- **`insights-channel-analysis`** - Deep dive into top channels by ranking category, channel naming patterns, and cross-category engagement comparisons
- **`insights-user-growth`** - New vs. recurring user trends, daily/weekly/monthly breakdowns, top countries, and whale user identification
- **`insights-engagement-deep-dive`** - Average user duration, session-length bucket histogram, top channels by user-minutes, and device-type breakdown across publishes, subscribers, and unique users

### Resources

- **`pubnub_sdk_docs`** - Access PubNub SDK documentation via URI scheme: `pubnub-docs://sdk/{language}/{feature}`

**Supported languages**: asyncio, c-core, c-sharp, dart, freertos, go, java, javascript, kotlin, mbed, objective-c, php, posix-c, posix-cpp, python, ruby, rust, swift, unity, unreal, windows-c, windows-cpp

**Supported features**: access-manager, access-manager-v2, channel-groups, configuration, encryption, files, message-actions, misc, mobile-push, objects, presence, publish-and-subscribe, storage-and-playback

- **`pubnub_chat_sdk_docs`** - Access PubNub Chat SDK documentation via URI scheme: `pubnub-docs://chat-sdk/{language}/{feature}`

**Supported Languages**: javascript, kotlin, swift, unity, unreal

**Supported Features**: channels-create, channels-delete, channels-details, channels-invite, channels-join, channels-leave, channels-list, channels-membership, channels-references, channels-typing-indicator, channels-updates, channels-watch, connection-management, custom-events, error-logging, messages-delete, messages-details, messages-drafts, messages-files, messages-forward, messages-history, messages-links, messages-moderation, messages-pinned, messages-quotes, messages-reactions, messages-read-receipts, messages-restore, messages-send-receive, messages-threads, messages-unread, messages-updates, moderation, push-notifications, users-create, users-delete, users-details, users-list, users-mentions, users-moderation, users-moderation-user, users-permissions, users-presence, users-updates, utility-methods
