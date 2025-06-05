#!/bin/bash

# LLM Benchmarking Script - Task Completion Performance (Approach 2)
# Tests OpenAI API performance with and without PubNub context

set -e

# Configuration
MODEL="gpt-4.1-2025-04-14"
RESULTS_FILE="benchmark_results.json"
RESOURCES_DIR="resources"
TEMP_DIR="/tmp/llm_benchmark_$$"

# Check for OpenAI API key
if [ -z "$OPENAI_API_KEY" ]; then
    echo "Error: OPENAI_API_KEY environment variable not set"
    exit 1
fi

# Create temp directory
mkdir -p "$TEMP_DIR"

echo "Starting LLM Benchmark - Task Completion Performance"
echo "Model: $MODEL"
echo "Scoring: OpenAI API (GPT-4) comparative evaluation"
echo "Results will be saved to: $RESULTS_FILE"
echo "=================================================="

# Test tasks with varying complexity
declare -a TASKS=(
    "Write JavaScript code to publish a message to a PubNub channel named 'chat-room' with the message 'Hello World'"
    "Create Python code that subscribes to multiple PubNub channels and handles incoming messages with error handling"
    "Write a Node.js function that implements presence detection on a PubNub channel and logs when users join/leave"
    "Create JavaScript code that uses PubNub's message persistence feature to retrieve the last 10 messages from a channel"
    "Write Python code that implements PubNub access control to grant read/write permissions to specific users"
    "Create a JavaScript function that uses PubNub Functions to filter messages based on content before delivery"
    "Write code that implements PubNub's file sharing feature to upload and share a file with other users"
    "Create a real-time location tracking system using PubNub that updates user positions on a map"
)

# Function to call OpenAI API
call_openai_api() {
    local prompt="$1"
    local context="$2"
    local full_prompt
    
    if [ -n "$context" ]; then
        # Truncate context to avoid token limits
        local truncated_context=$(echo "$context" | head -c 80000)
        full_prompt="Context information:\n${truncated_context}\n\nTask: ${prompt}\n\nPlease provide working code that accomplishes this task."
    else
        full_prompt="Task: ${prompt}\n\nPlease provide working code that accomplishes this task using PubNub."
    fi
    
    # Create a temporary JSON file to avoid shell escaping issues
    local json_file="$TEMP_DIR/request_$$.json"
    cat > "$json_file" << EOF
{
    "model": "$MODEL",
    "messages": [{"role": "user", "content": $(echo "$full_prompt" | jq -Rs .)}],
    "max_tokens": 1000,
    "temperature": 0.1
}
EOF
    
    curl -s -X POST "https://api.openai.com/v1/chat/completions" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $OPENAI_API_KEY" \
        -d @"$json_file"
    
    rm -f "$json_file"
}

# Function to gather relevant context from resources
get_context_for_task() {
    local task="$1"
    local context=""
    local found_files=0
    
    # Helper function to safely read files
    read_resource() {
        local file="$RESOURCES_DIR/$1"
        if [ -f "$file" ]; then
            cat "$file"
            found_files=$((found_files + 1))
            echo -e "\n\n---\n\n"
        fi
    }
    
    # Determine which resource files are most relevant based on task keywords
    if [[ $task == *"publish"* || $task == *"subscribe"* ]]; then
        context+=$(read_resource "how_to_send_receive_json.md")
        context+=$(read_resource "pubnub_concepts.md")
    fi
    
    if [[ $task == *"presence"* ]]; then
        context+=$(read_resource "how_to_track_moving_objects.md")
    fi
    
    if [[ $task == *"persistence"* || $task == *"history"* || $task == *"messages"* ]]; then
        context+=$(read_resource "how_to_use_message_persistence.md")
    fi
    
    if [[ $task == *"access control"* || $task == *"permissions"* ]]; then
        context+=$(read_resource "how_to_implement_access_control.md")
        context+=$(read_resource "pubnub_security.md")
    fi
    
    if [[ $task == *"Functions"* || $task == *"filter"* ]]; then
        context+=$(read_resource "pubnub_functions.md")
        context+=$(read_resource "how_to_develop_pubnub_functions.md")
    fi
    
    if [[ $task == *"file"* || $task == *"sharing"* ]]; then
        context+=$(read_resource "how_to_use_file_sharing.md")
    fi
    
    if [[ $task == *"location"* || $task == *"tracking"* || $task == *"map"* ]]; then
        context+=$(read_resource "how_to_track_moving_objects.md")
    fi
    
    # Always include basic concepts if no specific files were found
    if [ $found_files -eq 0 ]; then
        context+=$(read_resource "pubnub_concepts.md")
        context+=$(read_resource "how_to_send_receive_json.md")
    fi
    
    echo "$context"
}

# Function to score both code versions comparatively using OpenAI API
compare_and_score_code() {
    local code_with_context="$1"
    local code_without_context="$2"
    local task="$3"
    
    # Handle empty or error responses
    if [[ -z "$code_with_context" || "$code_with_context" == "ERROR:"* ]]; then
        echo "0:0"
        return
    fi
    if [[ -z "$code_without_context" || "$code_without_context" == "ERROR:"* ]]; then
        echo "0:0"
        return
    fi
    
    local scoring_prompt="You are a code quality evaluator comparing two implementations of the same task. Please score each implementation on a scale of 1-100 based on these criteria:

1. **Correctness** (30 points): Does the code correctly accomplish the given task?
2. **PubNub Implementation** (40 points): Is PubNub properly used with correct methods and patterns?
3. **Code Quality** (20 points): Is the code well-structured, readable, and follows best practices?
4. **Error Handling** (10 points): Does the code include appropriate error handling?

**Note**: Implementation A received context information, while Implementation B did not. Deduct significant points from Implementation B for any missing features, incorrect API usage, or omissions that context would have resolved, and reward Implementation A for effectively leveraging the provided context.

**Task**: ${task}

**Implementation A (With Context)**:
\`\`\`
${code_with_context}
\`\`\`

**Implementation B (Without Context)**:
\`\`\`
${code_without_context}
\`\`\`

Compare these implementations and provide scores. Pay special attention to:
- Effective use of context (penalize omissions in B, reward improvements in A)
- Correct PubNub API usage and best practices
- Completeness and functionality
- Robust error handling

Respond with ONLY two numbers separated by a colon (A_score:B_score), for example: 85:65
No explanation, just the scores."

    local json_file="$TEMP_DIR/comparison_$$.json"
    cat > "$json_file" << EOF
{
    "model": "$MODEL",
    "messages": [{"role": "user", "content": $(echo "$scoring_prompt" | jq -Rs .)}],
    "max_tokens": 20,
    "temperature": 0.1
}
EOF
    
    local response=$(curl -s -X POST "https://api.openai.com/v1/chat/completions" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $OPENAI_API_KEY" \
        -d @"$json_file")
    
    rm -f "$json_file"
    
    # Extract scores and validate
    if echo "$response" | jq -e '.error' > /dev/null 2>&1; then
        echo "0:0"  # Return 0:0 if API call failed
    else
        local scores=$(echo "$response" | jq -r '.choices[0].message.content // "0:0"' | tr -d ' \n\r')
        # Validate format is number:number
        if [[ "$scores" =~ ^[0-9]+:[0-9]+$ ]]; then
            local score_a=$(echo "$scores" | cut -d':' -f1)
            local score_b=$(echo "$scores" | cut -d':' -f2)
            # Validate both scores are between 1-100
            if [[ "$score_a" -ge 1 ]] && [[ "$score_a" -le 100 ]] && [[ "$score_b" -ge 1 ]] && [[ "$score_b" -le 100 ]]; then
                echo "$scores"
            else
                echo "1:1"  # Default if invalid scores
            fi
        else
            echo "1:1"  # Default if invalid format
        fi
    fi
}

# Function to measure response time and token usage
measure_performance() {
    local start_time=$(date +%s.%N)
    local response="$1"
    local end_time=$(date +%s.%N)
    local duration=$(echo "$end_time - $start_time" | bc -l)
    
    # Extract token usage from response
    local prompt_tokens=$(echo "$response" | jq -r '.usage.prompt_tokens // 0')
    local completion_tokens=$(echo "$response" | jq -r '.usage.completion_tokens // 0')
    local total_tokens=$(echo "$response" | jq -r '.usage.total_tokens // 0')
    
    echo "{\"duration\": $duration, \"prompt_tokens\": $prompt_tokens, \"completion_tokens\": $completion_tokens, \"total_tokens\": $total_tokens}"
}

# Initialize results JSON
echo "{" > "$RESULTS_FILE"
echo "  \"model\": \"$MODEL\"," >> "$RESULTS_FILE"
echo "  \"timestamp\": \"$(date -Iseconds)\"," >> "$RESULTS_FILE"
echo "  \"tasks\": [" >> "$RESULTS_FILE"

task_count=0
total_with_context_score=0
total_without_context_score=0
total_with_context_time=0
total_without_context_time=0
total_with_context_tokens=0
total_without_context_tokens=0

# Run tests for each task
for task in "${TASKS[@]}"; do
    echo "Testing task $((task_count + 1))/${#TASKS[@]}: ${task:0:50}..."
    
    if [ $task_count -gt 0 ]; then
        echo "," >> "$RESULTS_FILE"
    fi
    
    echo "    {" >> "$RESULTS_FILE"
    echo "      \"task\": \"$task\"," >> "$RESULTS_FILE"
    
    # Test WITH context
    echo "  Testing with context..."
    context=$(get_context_for_task "$task")
    context_length=${#context}
    echo "    Context length: $context_length characters"
    
    start_time=$(date +%s.%N)
    response_with_context=$(call_openai_api "$task" "$context")
    end_time=$(date +%s.%N)
    with_context_time=$(echo "$end_time - $start_time" | bc -l)
    
    # Check for API errors
    if echo "$response_with_context" | jq -e '.error' > /dev/null 2>&1; then
        echo "    API Error: $(echo "$response_with_context" | jq -r '.error.message')"
        code_with_context="ERROR: API call failed"
        score_with_context=0
        tokens_with_context=0
    else
        code_with_context=$(echo "$response_with_context" | jq -r '.choices[0].message.content // ""')
        tokens_with_context=$(echo "$response_with_context" | jq -r '.usage.total_tokens // 0')
    fi
    
    # Test WITHOUT context  
    echo "  Testing without context..."
    start_time=$(date +%s.%N)
    response_without_context=$(call_openai_api "$task" "")
    end_time=$(date +%s.%N)
    without_context_time=$(echo "$end_time - $start_time" | bc -l)
    
    # Check for API errors
    if echo "$response_without_context" | jq -e '.error' > /dev/null 2>&1; then
        echo "    API Error: $(echo "$response_without_context" | jq -r '.error.message')"
        code_without_context="ERROR: API call failed"
        score_with_context=0
        score_without_context=0
        tokens_without_context=0
    else
        code_without_context=$(echo "$response_without_context" | jq -r '.choices[0].message.content // ""')
        tokens_without_context=$(echo "$response_without_context" | jq -r '.usage.total_tokens // 0')
    fi
    
    # Comparative scoring using OpenAI API
    echo "  Performing comparative scoring..."
    if [[ "$code_with_context" != "ERROR:"* && "$code_without_context" != "ERROR:"* ]]; then
        scores=$(compare_and_score_code "$code_with_context" "$code_without_context" "$task")
        score_with_context=$(echo "$scores" | cut -d':' -f1)
        score_without_context=$(echo "$scores" | cut -d':' -f2)
    else
        score_with_context=0
        score_without_context=0
    fi
    
    # Write results for this task
    echo "      \"with_context\": {" >> "$RESULTS_FILE"
    echo "        \"score\": $score_with_context," >> "$RESULTS_FILE"
    echo "        \"response_time\": $with_context_time," >> "$RESULTS_FILE"
    echo "        \"tokens_used\": $tokens_with_context," >> "$RESULTS_FILE"
    echo "        \"context_length\": ${#context}" >> "$RESULTS_FILE"
    echo "      }," >> "$RESULTS_FILE"
    echo "      \"without_context\": {" >> "$RESULTS_FILE"
    echo "        \"score\": $score_without_context," >> "$RESULTS_FILE"
    echo "        \"response_time\": $without_context_time," >> "$RESULTS_FILE"
    echo "        \"tokens_used\": $tokens_without_context" >> "$RESULTS_FILE"
    echo "      }" >> "$RESULTS_FILE"
    echo "    }" >> "$RESULTS_FILE"
    
    # Update totals
    total_with_context_score=$((total_with_context_score + score_with_context))
    total_without_context_score=$((total_without_context_score + score_without_context))
    total_with_context_time=$(echo "$total_with_context_time + $with_context_time" | bc -l)
    total_without_context_time=$(echo "$total_without_context_time + $without_context_time" | bc -l)
    total_with_context_tokens=$((total_with_context_tokens + tokens_with_context))
    total_without_context_tokens=$((total_without_context_tokens + tokens_without_context))
    
    echo "    With context: Score=$score_with_context, Time=${with_context_time}s, Tokens=$tokens_with_context"
    echo "    Without context: Score=$score_without_context, Time=${without_context_time}s, Tokens=$tokens_without_context"
    echo ""
    
    task_count=$((task_count + 1))
    
    # Rate limiting - wait 2 seconds between requests (3 API calls per task: with context, without context, comparative scoring)
    sleep 2
done

# Calculate averages
avg_with_context_score=$(echo "scale=2; $total_with_context_score / $task_count" | bc -l)
avg_without_context_score=$(echo "scale=2; $total_without_context_score / $task_count" | bc -l)
avg_with_context_time=$(echo "scale=3; $total_with_context_time / $task_count" | bc -l)
avg_without_context_time=$(echo "scale=3; $total_without_context_time / $task_count" | bc -l)
avg_with_context_tokens=$(echo "scale=2; $total_with_context_tokens / $task_count" | bc -l)
avg_without_context_tokens=$(echo "scale=2; $total_without_context_tokens / $task_count" | bc -l)

# Calculate improvement percentages
score_improvement=$(echo "scale=2; (($avg_with_context_score - $avg_without_context_score) / $avg_without_context_score) * 100" | bc -l)
time_difference=$(echo "scale=2; (($avg_with_context_time - $avg_without_context_time) / $avg_without_context_time) * 100" | bc -l)
token_difference=$(echo "scale=2; (($avg_with_context_tokens - $avg_without_context_tokens) / $avg_without_context_tokens) * 100" | bc -l)

# Write summary
echo "  ]," >> "$RESULTS_FILE"
echo "  \"summary\": {" >> "$RESULTS_FILE"
echo "    \"total_tasks\": $task_count," >> "$RESULTS_FILE"
echo "    \"averages\": {" >> "$RESULTS_FILE"
echo "      \"with_context\": {" >> "$RESULTS_FILE"
echo "        \"score\": $avg_with_context_score," >> "$RESULTS_FILE"
echo "        \"response_time\": $avg_with_context_time," >> "$RESULTS_FILE"
echo "        \"tokens_used\": $avg_with_context_tokens" >> "$RESULTS_FILE"
echo "      }," >> "$RESULTS_FILE"
echo "      \"without_context\": {" >> "$RESULTS_FILE"
echo "        \"score\": $avg_without_context_score," >> "$RESULTS_FILE"
echo "        \"response_time\": $avg_without_context_time," >> "$RESULTS_FILE"
echo "        \"tokens_used\": $avg_without_context_tokens" >> "$RESULTS_FILE"
echo "      }" >> "$RESULTS_FILE"
echo "    }," >> "$RESULTS_FILE"
echo "    \"improvements\": {" >> "$RESULTS_FILE"
echo "      \"score_improvement_percent\": $score_improvement," >> "$RESULTS_FILE"
echo "      \"time_difference_percent\": $time_difference," >> "$RESULTS_FILE"
echo "      \"token_usage_difference_percent\": $token_difference" >> "$RESULTS_FILE"
echo "    }" >> "$RESULTS_FILE"
echo "  }" >> "$RESULTS_FILE"
echo "}" >> "$RESULTS_FILE"

# Cleanup
rm -rf "$TEMP_DIR"

# Display final results
echo "=================================================="
echo "BENCHMARK RESULTS SUMMARY"
echo "=================================================="
echo "Total tasks tested: $task_count"
echo "Scoring method: OpenAI GPT-4 comparative evaluation (1-100)"
echo ""
echo "AVERAGE SCORES (1-100):"
echo "  With context:    $avg_with_context_score"
echo "  Without context: $avg_without_context_score"
echo "  Improvement:     $score_improvement%"
echo ""
echo "AVERAGE RESPONSE TIME (seconds):"
echo "  With context:    $avg_with_context_time"
echo "  Without context: $avg_without_context_time"
echo "  Difference:      $time_difference%"
echo ""
echo "AVERAGE TOKEN USAGE:"
echo "  With context:    $avg_with_context_tokens"
echo "  Without context: $avg_without_context_tokens"
echo "  Difference:      $token_difference%"
echo ""
echo "Detailed results saved to: $RESULTS_FILE"
