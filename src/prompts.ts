const generateHandler = (text: string) => {
  return () => ({
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text,
        },
      },
    ],
  });
};

const hipaaChatShort = {
  name: "hipaa-chat-short",
  definition: {
    title: "Create a HIPAA Compliant Chat app",
    description:
      "Example of how to prompt PubNub MCP to create a HIPAA compliant chat application - short version",
  },
  handler: generateHandler(
    "Act as a senior software engineer and use PubNub MCP server to create a chat application for healthcare that is HIPAA compliant."
  ),
};

const hipaaChatLong = {
  name: "hipaa-chat-long",
  definition: {
    title: "Create a HIPAA Compliant Chat app",
    description:
      "Example of how to prompt PubNub MCP to create a HIPAA compliant chat application - long version",
  },
  handler: generateHandler(
    "Act as a senior software engineer and use PubNub MCP server to create a chat application for healthcare that is HIPAA compliant, with Pub/Sub messaging for real-time chat, Presence for patient/doctor availability, and App Context for roles."
  ),
};

const reactAppShort = {
  name: "react-app-short",
  definition: {
    title: "Scaffold React App with PubNub",
    description:
      "Example of how to scaffold a React application with PubNub Pub/Sub and Presence - short version",
  },
  handler: generateHandler(
    "Act as a frontend developer and use PubNub MCP server to scaffold a React app with Pub/Sub messaging and Presence."
  ),
};

const reactAppLong = {
  name: "react-app-long",
  definition: {
    title: "Scaffold React App with PubNub",
    description:
      "Example of how to scaffold a React application with PubNub Pub/Sub and Presence - long version",
  },
  handler: generateHandler(
    "Act as a frontend developer and use PubNub MCP server to scaffo ld a React app with Pub/Sub messaging for real-time updates, Presence to show when users are online or typing, and App Context to handle user metadata. Include sample React components for subscribing to a channel, publishing messages, and displaying presence indicators for active participants."
  ),
};

const gamelobbyShort = {
  name: "gamelobby-short",
  definition: {
    title: "Build Multiplayer Game Lobby",
    description:
      "Example of how to build a multiplayer game lobby with chat and presence - short version",
  },
  handler: generateHandler(
    "Act as a game developer and use PubNub MCP server to build a multiplayer lobby with chat and Presence indicators."
  ),
};

const gamelobbyLong = {
  name: "gamelobby-long",
  definition: {
    title: "Build Multiplayer Game Lobby",
    description:
      "Example of how to build a multiplayer game lobby with chat and presence - long version",
  },
  handler: generateHandler(
    "As a game developer, use PubNub MCP server to build a multiplayer game lobby that supports real-time chat using Pub/Sub, Presence for tracking when players come online or leave, and App Context for managing team assignments (e.g., red vs. blue team)."
  ),
};

const oemClientManagement = {
  name: "oem-client-management",
  definition: {
    title: "OEM Client Management",
    description: "Example of how to create apps and configure keysets for OEM clients",
  },
  handler: generateHandler(
    "[OEM (building resources used by someone else)] As a developer, use PubNub MCP to create a new app, configure and assign keysets to clients."
  ),
};

const multiTenantOnboardingShort = {
  name: "multi-tenant-onboarding-short",
  definition: {
    title: "Implement Multi-Tenant Onboarding",
    description:
      "Example of how to implement automated tenant onboarding for multi-tenant applications - short version",
  },
  handler: generateHandler(
    "[OEM] Act as a senior developer and use PubNub MCP server to implement automated tenant onboarding for a multi-tenant chat application in SaaS or healthcare industries."
  ),
};

const multiTenantOnboardingLong = {
  name: "multi-tenant-onboarding-long",
  definition: {
    title: "Implement Multi-Tenant Onboarding",
    description:
      "Example of how to implement automated tenant onboarding for multi-tenant applications - long version",
  },
  handler: generateHandler(
    "Act as a senior developer and use PubNub MCP (which leverages Admin API for Keysets and Usage & Monitoring) to implement a multi-tenant chat application with automated tenant onboarding. The tenant Application will use: pubsub, History, App-Context, Presence For every new tenant or end-customer the application should: Create a new App (if required by your OEM model). Create and configure a new Keyset to ensure data isolation Make sure publish and subscribe keys are properly retrieved and propagated to the tenant's application as configuration variables The implementation should be fully automated, idempotent, and include error handling, and retries."
  ),
};

export const prompts = [
  hipaaChatShort,
  hipaaChatLong,
  reactAppShort,
  reactAppLong,
  gamelobbyShort,
  gamelobbyLong,
  oemClientManagement,
  multiTenantOnboardingShort,
  multiTenantOnboardingLong,
];
