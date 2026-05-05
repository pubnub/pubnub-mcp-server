# PubNub MCP Server

A hosted Model Context Protocol (MCP) server that exposes [PubNub SDK documentation](https://www.pubnub.com/docs/sdks) and PubNub API resources to LLM-powered tools. This improves the LLM AI Agent's ability to understand and interact with PubNub's SDKs and APIs. Uses HTTP transport with OAuth authentication.

![PubNub MCP Server](https://github.com/pubnub/pubnub-mcp-server/raw/main/pubnub-mcp-server.jpg)

## Features

- **📚 Comprehensive SDK Documentation** - Access detailed documentation, code examples, and implementation guides for 20+ programming languages including JavaScript, Python, Java, Swift, Kotlin, C#, Ruby, Go, and more
- **🏗️ Application & Keyset Management** - Create, configure, and manage PubNub applications and keysets with features like message persistence, file sharing, presence tracking, and app context
- **💬 Real-time Communication** - Send and receive messages across channels, implement live chat, notifications, and real-time updates with support for both messages and lightweight signals
- **👥 User & Channel Management** - Manage user profiles, channel metadata, and membership relationships with full CRUD operations for building community and social features
- **📍 Presence & Activity Tracking** - Monitor real-time user presence, see who's online in channels, and track user activity across your application
- **🔧 Multi-Platform Integration** - Works with Cursor, Visual Studio Code, Claude Code, and other MCP-compatible AI assistants
- **⚡ Developer Experience** - Built with TypeScript for type safety, includes testing infrastructure

## Quick Start

For step-by-step setup instructions for your AI assistant (VS Code, Cursor, Claude Code, Claude Desktop, Codex, Gemini CLI, and more), refer to the [Setup](https://www.pubnub.com/docs/ai/pubnub-mcp-server#setup) section in the PubNub documentation.


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
