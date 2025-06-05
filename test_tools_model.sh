#!/usr/bin/env bash
set -euo pipefail

# Terminal colors and formatting
BOLD='\033[1m'
RESET='\033[0m'
GREEN='\033[1;32m'
RED='\033[1;31m'

command -v jq >/dev/null 2>&1 || { echo -e "${RED}Error: jq is required but not installed.${RESET}" >&2; exit 1; }
command -v curl >/dev/null 2>&1 || { echo -e "${RED}Error: curl is required but not installed.${RESET}" >&2; exit 1; }
[[ -n "${OPENAI_API_KEY:-}" ]] || { echo -e "${RED}Error: OPENAI_API_KEY env var must be set.${RESET}" >&2; exit 1; }

MODEL="${OPENAI_MODEL:-gpt-4-0613}"

echo -e "${BOLD}Starting MCP Server and fetching list of tools...${RESET}"
export TOOLS_JSON=$(echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | timeout 3s node index.js)
echo -e "${BOLD}MCP server received tools list.${RESET}"
#echo "$TOOLS_JSON" | jq .

TOOLS=$(echo "$TOOLS_JSON" | jq -c '.result.tools')

echo -e "${BOLD}Submitting user prompts with MCP server tools...${RESET}"
PROMPTS=(
  "Write a PubNub App that is a simple blank screen with a number in the middle. The number is super big. The number represents how many users are present on the screen. Use PubNub Presence to track number of users on the screen. Make sure to use a random userId when initializing the PubNub SDK."
  "Create a PubNub-powered web-based social mapping app. The App uses OpenStreetMap, displayed in the main window. When a user launches the app, they must enter their username and chose a color for their marker. Any user can click to create a marker anywhere on the map, and upload an image. Each image will be stored using the PubNub Files API. The user, their markers, and image URLs will be stored in PubNub AppContext. As users create markers and upload images, those images will be instantly visible to everyone else as well automatically via PubNub. Each user can pan and zoom the map to their own location, so zoom level is individual; i.e. not synced via PubNub. The app also has a global chat window to the right side of the map where all users can chat with text and emojis. Make sure to use the PubNub MCP server for pubnub concepts and docs."
  "Please retrieve the API reference for the PubNub JavaScript SDK, publish-and-subscribe section."
  "Fetch the PubNub Chat SDK documentation for Swift for the 'thread-channel' topic."
  "Provide the pubnub_concepts guide from resources."
  "Publish the message 'Hello, world!' to the channel 'test-channel'."
  "Get historical messages from the channels 'channel1' and 'channel2'."
  "Retrieve presence information for channel 'room42'."
  "Generate step-by-step instructions on how to write a PubNub application."
  "Generate step-by-step instructions on how to write a PubNub chat application."
  "Generate step-by-step instructions on how to write a PubNub word game application."
  "Generate step-by-step instructions on how to write a PubNub synchronized video player application."
  "Generate step-by-step instructions on how to write a PubNub delivery application."
  "Generate step-by-step instructions on how to write a PubNub JavaScript chat application."
  "Fetch the PubNub control plane documentation for software deployment."
  "Retrieve the PubNub Access Manager API reference for granting and revoking permissions."
  "Provide the PubNub resource guide on how to encrypt messages and files."
  "Fetch the PubNub serverless Functions API documentation for JavaScript."
)
FAIL_COUNT=0
for prompt in "${PROMPTS[@]}"; do
  echo -e "${BOLD}Prompt:${RESET} $prompt"
  REQUEST_PAYLOAD=$(jq -n --arg model "$MODEL" \
    --arg prompt "$prompt" \
    --argjson functions "$TOOLS" \
    '{model: $model, messages:[{role:"user", content:$prompt}], functions:$functions, function_call:"auto"}')
  RESPONSE=$(curl -sS https://api.openai.com/v1/chat/completions \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$REQUEST_PAYLOAD")

  #echo $RESPONSE

  CALL_NAME=$(echo "$RESPONSE" | jq -r '.choices[0].message.function_call.name // empty')
  if [[ -n "$CALL_NAME" ]]; then
    echo -e "${GREEN}SUCCESS:${RESET} Model requested tool \"$CALL_NAME\""
  else
    echo -e "${RED}FAILURE:${RESET} Model did not request a tool call for prompt: $prompt"
    FAIL_COUNT=$((FAIL_COUNT+1))
  fi
done

if [[ $FAIL_COUNT -eq 0 ]]; then
  exit 0
else
  exit 1
fi
