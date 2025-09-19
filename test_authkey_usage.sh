#!/usr/bin/env bash
set -euo pipefail

# Terminal colors and formatting
BOLD='\033[1m'
RESET='\033[0m'
GREEN='\033[1;32m'
RED='\033[1;31m'
YELLOW='\033[1;33m'

command -v jq >/dev/null 2>&1 || { echo -e "${RED}Error: jq is required but not installed.${RESET}" >&2; exit 1; }
command -v curl >/dev/null 2>&1 || { echo -e "${RED}Error: curl is required but not installed.${RESET}" >&2; exit 1; }
[[ -n "${OPENAI_API_KEY:-}" ]] || { echo -e "${RED}Error: OPENAI_API_KEY env var must be set.${RESET}" >&2; exit 1; }

MODEL="${OPENAI_MODEL:-gpt-4-0613}"

echo -e "${BOLD}Starting MCP Server and fetching list of tools...${RESET}"
export TOOLS_JSON=$(echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | timeout 3s node index.js)
echo -e "${BOLD}MCP server received tools list.${RESET}"

TOOLS=$(echo "$TOOLS_JSON" | jq -c '.result.tools')
# echo -e "${YELLOW}DEBUG:${RESET} Available tools: $TOOLS"

# Function to execute MCP tool call
execute_mcp_tool() {
  local tool_name="$1"
  local tool_args="$2"
  
  # echo -e "${YELLOW}DEBUG:${RESET} Executing MCP tool: $tool_name with args: $tool_args"
  
  # Create the tool call payload
  local tool_payload=$(jq -n --arg method "$tool_name" --argjson params "$tool_args" \
    '{jsonrpc:"2.0", id:1, method:$method, params:$params}')
  
  # echo -e "${YELLOW}DEBUG:${RESET} Tool payload: $tool_payload"
  
  # Execute the tool via the MCP server with timeout
  local tool_response=$(echo "$tool_payload" | timeout 8s node index.js 2>/dev/null)
  
  # echo -e "${YELLOW}DEBUG:${RESET} Tool response: $tool_response"
  
  # Extract the result
  echo "$tool_response" | jq -r '.result // empty'
}

# Function to execute a single test attempt with proper function calling
execute_test() {
  local prompt="$1"
  local messages=$(jq -n --arg content "$prompt" '[{"role":"user","content":$content}]')
  
  # First API call - let model choose to use tools
  local request_payload=$(jq -n --arg model "$MODEL" \
    --argjson messages "$messages" \
    --argjson functions "$TOOLS" \
    '{model: $model, messages:$messages, functions:$functions, function_call:"auto"}')
  
  local response=$(curl -sS https://api.openai.com/v1/chat/completions \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$request_payload")
  
  # Check if model made a function call
  local call_name=$(echo "$response" | jq -r '.choices[0].message.function_call.name // empty')
  
  if [[ -n "$call_name" ]]; then
    echo -e "${GREEN}INFO:${RESET} Model requested tool \"$call_name\""
    
    # Get function arguments
    local call_args=$(echo "$response" | jq -r '.choices[0].message.function_call.arguments // empty')
    # echo -e "${YELLOW}DEBUG:${RESET} Function call args: $call_args"
    
    # If the args are empty, provide defaults for the tools we know about
    if [[ "$call_args" == "{}" ]]; then
      case "$call_name" in
        "read_pubnub_sdk_docs")
          call_args='{"language":"javascript","apiReference":"configuration"}'
          ;;
        *)
          call_args='{"language":"javascript"}'
          ;;
      esac
      # echo -e "${YELLOW}DEBUG:${RESET} Using default args: $call_args"
    fi
    
    # Execute the MCP tool
    local tool_result=$(execute_mcp_tool "$call_name" "$call_args")
    
    # Add the function call and result to the conversation
    local assistant_message=$(echo "$response" | jq -r '.choices[0].message')
    local function_message=$(jq -n --arg name "$call_name" --arg content "$tool_result" \
      '{role:"function", name:$name, content:$content}')
    
    # Update messages array
    messages=$(echo "$messages" | jq --argjson assistant "$assistant_message" \
      --argjson function "$function_message" \
      '. + [$assistant] + [$function]')
    
    # Make second API call to get the final response
    request_payload=$(jq -n --arg model "$MODEL" \
      --argjson messages "$messages" \
      --argjson functions "$TOOLS" \
      '{model: $model, messages:$messages, functions:$functions}')
    
    response=$(curl -sS https://api.openai.com/v1/chat/completions \
      -H "Authorization: Bearer $OPENAI_API_KEY" \
      -H "Content-Type: application/json" \
      -d "$request_payload")
  else
    echo -e "${YELLOW}INFO:${RESET} Model did not request any tools"
  fi
  
  # Extract the final response content
  local response_content=$(echo "$response" | jq -r '.choices[0].message.content // empty')
  
  if [[ -z "$response_content" ]]; then
    echo -e "${RED}FAILURE:${RESET} No response content received"
    return 1
  fi
  
  # Extract JavaScript code blocks from response
  local code_blocks=$(echo "$response_content" | sed -n '/```javascript/,/```/p' | sed '1d;$d' || true)
  
  if [[ -z "$code_blocks" ]]; then
    code_blocks=$(echo "$response_content" | sed -n '/```js/,/```/p' | sed '1d;$d' || true)
  fi
  
  if [[ -z "$code_blocks" ]]; then
    code_blocks=$(echo "$response_content" | sed -n '/```/,/```/p' | sed '1d;$d' || true)
  fi
  
  if [[ -z "$code_blocks" ]]; then
    echo -e "${RED}FAILURE:${RESET} No code blocks found in response"
    return 1
  fi
  
  # Check for correct authKey usage and incorrect token usage
  local uses_auth_key=$(echo "$code_blocks" | grep -E "authKey\s*:" || true)
  local uses_token_in_config=$(echo "$code_blocks" | grep -E "token\s*:" | grep -v "grantToken\|setToken\|parseToken\|revokeToken" || true)
  
  if [[ -n "$uses_auth_key" && -z "$uses_token_in_config" ]]; then
    echo -e "${GREEN}SUCCESS:${RESET} Model correctly used 'authKey' in PubNub configuration"
    echo -e "${GREEN}Found:${RESET} $uses_auth_key"
    return 0
  elif [[ -n "$uses_token_in_config" ]]; then
    echo -e "${RED}FAILURE:${RESET} Model incorrectly used 'token' in PubNub configuration"
    echo -e "${RED}Found:${RESET} $uses_token_in_config"
    echo -e "${YELLOW}Should use 'authKey' instead of 'token' for client configuration${RESET}"
    return 1
  elif [[ -z "$uses_auth_key" ]]; then
    echo -e "${YELLOW}WARNING:${RESET} No authKey found in configuration, but no incorrect token usage either"
    return 0
  else
    echo -e "${RED}FAILURE:${RESET} Unexpected configuration pattern"
    return 1
  fi
}

# Function to execute test with retry logic
execute_test_with_retry() {
  local prompt="$1"
  local max_attempts=3
  local attempt=1
  
  while [[ $attempt -le $max_attempts ]]; do
    if [[ $attempt -gt 1 ]]; then
      echo -e "${YELLOW}RETRY:${RESET} Attempt $attempt for prompt: $prompt"
    fi
    
    if execute_test "$prompt"; then
      return 0
    fi
    
    ((attempt++))
  done
  
  echo -e "${RED}FAILURE:${RESET} Model failed authKey usage test for prompt: $prompt"
  return 1
}

echo -e "${BOLD}Testing PubNub configuration authKey vs token usage...${RESET}"

# Test prompts specifically designed to trigger Access Manager configuration via MCP tools
PROMPTS=(
  "First, retrieve the JavaScript SDK configuration documentation from PubNub. Then write JavaScript code to create a PubNub configuration for Access Manager V3 authentication. Include publishKey, subscribeKey, userId, and authentication token for a secure client."
  "Get the PubNub JavaScript SDK documentation for Access Manager and then create a JavaScript PubNub client configuration with Access Manager V3. The client should be authenticated with an access token."
  "Fetch the PubNub JavaScript SDK Access Manager documentation and then generate a JavaScript PubNub configuration that uses Access Manager V3 tokens for authentication. Include all required parameters."
)

FAIL_COUNT=0
for prompt in "${PROMPTS[@]}"; do
  echo -e "${BOLD}Prompt:${RESET} $prompt"
  if ! execute_test_with_retry "$prompt"; then
    FAIL_COUNT=$((FAIL_COUNT+1))
  fi
done

echo -e "\n${BOLD}Test Results:${RESET}"
if [[ $FAIL_COUNT -eq 0 ]]; then
  echo -e "${GREEN}✓ All tests passed! Model correctly uses 'authKey' instead of 'token' in PubNub configuration.${RESET}"
  exit 0
else
  echo -e "${RED}✗ $FAIL_COUNT test(s) failed. Model incorrectly used 'token' instead of 'authKey' in PubNub configuration.${RESET}"
  echo -e "${YELLOW}Remember: Use 'authKey' for client configuration, 'token' only for Access Manager methods.${RESET}"
  exit 1
fi
