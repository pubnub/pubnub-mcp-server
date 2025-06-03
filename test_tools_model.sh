#!/usr/bin/env bash
set -euo pipefail

command -v jq >/dev/null 2>&1 || { echo "Error: jq is required but not installed." >&2; exit 1; }
command -v curl >/dev/null 2>&1 || { echo "Error: curl is required but not installed." >&2; exit 1; }
[[ -n "${OPENAI_API_KEY:-}" ]] || { echo "Error: OPENAI_API_KEY env var must be set." >&2; exit 1; }

MODEL="${OPENAI_MODEL:-gpt-4-0613}"

echo "Fetching list of tools..."
export TOOLS_JSON=$(echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | timeout 3s node index.js)
echo "Received tools list:"
#echo "$TOOLS_JSON" | jq .

TOOLS=$(echo "$TOOLS_JSON" | jq -c '.result.tools')

echo "Submitting user prompt to OpenAI API with available tools..."
REQUEST_PAYLOAD=$(jq -n --arg model "$MODEL" \
  --arg prompt "write a pubnub chat app" \
  --argjson functions "$TOOLS" \
  '{model: $model, messages:[{role:"user", content:$prompt}], functions:$functions, function_call:"auto"}')

RESPONSE=$(curl -sS https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$REQUEST_PAYLOAD")

#echo "OpenAI API response:"
#echo "$RESPONSE" | jq .

CALL_NAME=$(echo "$RESPONSE" | jq -r '.choices[0].message.function_call.name // empty')
if [[ -n "$CALL_NAME" ]]; then
  echo "SUCCESS: Model requested tool \"$CALL_NAME\""
  exit 0
else
  echo "FAILURE: Model did not request a tool call"
  exit 1
fi
