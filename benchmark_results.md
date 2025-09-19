# Are Your MCP Servers Performing?

It can be tough to know if your Model Context Protocol (MCP) server is actually helping your AI Agent. Is it helping or hurting? We benchmarked our MCP server to find out how much difference additional contextual information really makes when working with AI Agents for writing code. Below, we’ll walk you through what we tested, how we tested it, and what we learned.

## Quick Overview

We compared LLM performance doing PubNub development tasks with and without specialized context from our MCP server. Here’s what we saw:

- 41% improvement in code quality scores (96.87 vs 68.25 out of 100\)  
- 1032% increase in contextual information used (6,755 vs 596 tokens)  
- Consistent gains across all eight tested tasks

The data confirms the common intuition among developers that adding meaningful context promotes stronger results in AI-assisted coding.

## Methodology: Real-World Testing

### Benchmark Design

We ran a script called `benchmark_mcp.sh` to compare performance on eight PubNub development tasks:

1. **Basic messaging**  
2. **Multi-channel subscriptions**  
3. **Presence detection**  
4. **Message persistence**  
5. **Access control**  
6. **PubNub Functions**  
7. **File sharing**  
8. **Location tracking**

### Context Sources

We used our MCP server’s resource library to supply extra information relevant to each task. The sources included:

- `pubnub_concepts.md` \- Core platform details  
- `how_to_send_receive_json.md` \- Step-by-step guides  
- `pubnub_security.md` \- Security best practices  
- Task-specific guides

### Scoring Methodology

GPT-4.1 was then used to evaluate each implementation based on:

- **Correctness** (30 points)  
- **PubNub Implementation** (40 points)  
- **Code Quality** (20 points)  
- **Error Handling** (10 points)

This approach helped us isolate the effect of context on the overall quality of the code produced.

## Key Findings: The Numbers

### Quality Across All Tasks

All eight tasks showed improvements when context was provided:

| Task | With Context | Without Context | Improvement |
| :---- | :---- | :---- | :---- |
| Write JavaScript code to publish a message to a PubNub channel named 'chat-room' with the message 'Hello World' | 98 | 78 | 26% |
| Create Python code that subscribes to multiple PubNub channels and handles incoming messages with error handling | 97 | 72 | 35% |
| Write a Node.js function that implements presence detection on a PubNub channel and logs when users join/leave | 97 | 68 | 43% |
| Create JavaScript code that uses PubNub's message persistence feature to retrieve the last 10 messages from a channel | 98 | 68 | 44% |
| Write Python code that implements PubNub access control to grant read/write permissions to specific users | 97 | 62 | 56% |
| Create a JavaScript function that uses PubNub Functions to filter messages based on content before delivery | 97 | 62 | 56% |
| Write code that implements PubNub's file sharing feature to upload and share a file with other users | 97 | 68 | 43% |
| Create a real-time location tracking system using PubNub that updates user positions on a map | 94 | 68 | 38% |

### Context Volume and Quality

We found that more complex tasks got selectively larger volumes of context:

- **Functions, Access Control:** 28K \- 47K characters of context  
- **Persistence, Location:** 17K \- 20K characters  
- **Basic Messaging:** Over 30K characters to cover foundations

### Performance vs. Quality

Context did add some overhead:

- **With context:** \~13.18 seconds per response (6,755 tokens)  
- **Without context:** \~11.45 seconds per response (596 tokens)

That’s about a 15% increase in time for a 41% gain in code quality, which seems like a worthwhile trade-off when correctness is a priority.

## Real-World Impact Analysis

### Beyond the Numbers

Though the scores improved, we also noticed these qualitative benefits:

- **Accurate API Usage:** Context-based solutions used proper PubNub patterns.  
- **Security Best Practices:** Context addressed secure token management and permission scoping.  
- **Production Readiness:** Context-fed solutions tended to have better error handling and scalability considerations.

### Developer Productivity

Developers who rely on MCP-enhanced AI can likely expect:

1. Fewer debugging sessions (code is more accurate)  
2. Faster feature development (less guesswork for platform specifics)  
3. Good architecture (prompted by best practices in context)  
4. A smoother learning curve (context educates as you code)

## Technical Deep Dive: Why Context Helps

### Intelligent Context Selection

The script `get_context_for_task()` picks the right documentation for each task:

```shell
# Example: Presence-related tasks automatically include extra tracking guides
if [[ $task == *"presence"* ]]; then
    context+=$(read_resource "how_to_track_moving_objects.md")
fi
```

This ensures that developers (and the AI) only get what’s needed for each scenario.

### MCP Architecture Benefits

Breaking documentation into smaller, relevant files means:

- **Modular Context**: Task-specific details are easy to pick and choose  
- **Better Documentation**: Each resource file covers patterns and best practices clearly  
- **Live Integration**: MCP servers offer both reference materials and operational features

## Future Implications and Recommendations

### For Development Teams

1. Consider integrating an MCP approach when working on complex features.  
2. Build out content for architecture, security, and best practices.  
3. Accept that some extra processing time is likely, but often worth it.  
4. Pay special attention to security and advanced use cases where context seems most helpful.

### For MCP Server Developers

1. Look into context pre-processing and optimization for commonly requested tasks.  
2. Experiment with adaptive context sizes to see what yields the best “quality vs. speed” balance.  
3. Investigate caching strategies to reduce overhead.

### For AI Tool Users

1. Provide enough details about your tasks so the AI can request relevant context.  
2. Refine your context resources to reflect actual coding patterns and challenges.  
3. Decide when faster but less accurate responses are acceptable and when extra context is indispensable.

## Conclusion: Yes\! Context Matters

Our benchmarks show that adding context to AI-assisted development can significantly improve code quality. While it does add some processing time and token usage, the benefits of fewer bugs, better security, and smoother workflows make it an appealing choice for many teams.

## Benchmark Details

If you’d like to dive deeper, check out the `benchmark_mcp.sh` script and `benchmark_results.json` for all the details. Here’s a quick summary of what was involved:

- **Model**: GPT-4.1-2025-04-14  
- **Independent Scoring**: Evaluate correctness, usage quality, code structure, and error handling  
- **Context Source**: Selected from PubNub docs and best practices  
- **Task Diversity**: Covered a wide array of PubNub features

We hope this helps you understand the value of contextual information in AI-assisted development. If you have questions or want to share your own benchmarks, feel free to reach out. Tags like “context-driven AI” or “MCP approach” can help you find similar discussions online.  
