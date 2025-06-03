#!/usr/bin/env bash
set -euo pipefail

command -v jq >/dev/null 2>&1 || { echo "Error: jq is required but not installed." >&2; exit 1; }
command -v curl >/dev/null 2>&1 || { echo "Error: curl is required but not installed." >&2; exit 1; }
[[ -n "${OPENAI_API_KEY:-}" ]] || { echo "Error: OPENAI_API_KEY env var must be set." >&2; exit 1; }

MODEL="${OPENAI_MODEL:-gpt-4-0613}"

echo "Starting MCP Server and fetching list of tools..."
export TOOLS_JSON=$(echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | timeout 3s node index.js)
echo "MCP server received tools list."
#echo "$TOOLS_JSON" | jq .

TOOLS=$(echo "$TOOLS_JSON" | jq -c '.result.tools')

echo "Submitting user prompts with MCP server tools..."
PROMPTS=(
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
  echo "Prompt: $prompt"
  REQUEST_PAYLOAD=$(jq -n --arg model "$MODEL" \
    --arg prompt "$prompt" \
    --argjson functions "$TOOLS" \
    '{model: $model, messages:[{role:"user", content:$prompt}], functions:$functions, function_call:"auto"}')
  RESPONSE=$(curl -sS https://api.openai.com/v1/chat/completions \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$REQUEST_PAYLOAD")

  CALL_NAME=$(echo "$RESPONSE" | jq -r '.choices[0].message.function_call.name // empty')
  if [[ -n "$CALL_NAME" ]]; then
    echo "SUCCESS: Model requested tool \"$CALL_NAME\""
  else
    echo "FAILURE: Model did not request a tool call for prompt: $prompt"
    FAIL_COUNT=$((FAIL_COUNT+1))
  fi
done

if [[ $FAIL_COUNT -eq 0 ]]; then
  exit 0
else
  exit 1
fi
