### MCP Server - Improvement Task List

1. Add full PubNub Signal support  
   • Implement publish / subscribe paths for the `signal` operation.  
   • Extend the test harness so it can validate typing-indicator flows that rely on Signals.  
   • Update API documentation and examples to cover Signals.

2. Implement first-class Channel Membership testing utilities  
   • Expose REST / CLI commands to add, remove and query `User–Channel` membership.  
   • Ensure presence logic is optional (membership ≠ presence).  
   • Provide unit-tests that confirm correct membership enforcement.

3. Provide Unread Message Count helper using Chat SDK only  
   • Wrap the `UnreadMessagesService` in a simple MCP endpoint.  
   • Return total, per-channel, and since-timestamp counts.  
   • Include pagination and delta updates over websockets.

4. Correct Chat SDK “typing indicator” reference implementation  
   • Use `ChatSDK.SignalService.sendTypingIndicator()` instead of Core SDK publish.  
   • Ship a ready-to-copy code snippet in docs.  
   • Remove any residual Core SDK usage in that sample.

5. Fix listener channel-ID resolution for Chat events  
   • Ensure `invite`, `message`, `presence` listeners default to the **userId** channel, not a global ID.  
   • Add regression tests for multiple concurrent users.

6. Improve error reporting: “missing parameter: topic”  
   • Identify every code path that can emit this error.  
   • Replace with a descriptive message: “Channel (topic) name required for ‹operation›”.  
   • Link to the correct API doc section in the error payload.

7. Enforce Core-SDK vs Chat-SDK compatibility checks  
   • Detect mixed usage in requests and throw a clear “SDKs are not interchangeable” error.  
   • Provide guidance: message envelope, auth scheme (`token` vs `authKey`), and error patterns.  
   • Auto-tag log entries with `CORE_SDK` or `CHAT_SDK` for easier debugging.

8. Document and validate PubNub Function ↔ Chat SDK incompatibility  
   • State unequivocally that Functions cannot emit Chat-compatible messages.  
   • Add linter rule in MCP to flag attempts to do so.  
   • Provide migration path: call Chat SDK publish endpoint instead.

9. Surface Message.streamUpdates for reaction toggles  
   • Add an example that listens to `Message.streamUpdates` when `toggleReactions()` is used.  
   • Highlight common pitfalls (e.g., missing messageId filter).

10. Add high-level paginator for historical messages  
    • Support “fetch up to N messages” with automatic start/end token management.  
    • Return consistent order (newest → oldest) with partial page handling.  
    • Include sample code for 250-message fetch in docs.

11. Clarify `connect()` / `disconnect()` lifecycle in Chat SDK wrapper  
    • Update quick-start to show the returned `disconnect` function pattern.  
    • Add runtime warning if `disconnect()` is invoked without prior `connect()`.

12. Unify Access Manager (PAM) integration steps  
    • Single doc covering: token retrieval → `PubNub` init → `ChatSDK` init.  
    • Distinguish parameter names (`token` vs `authKey`).  
    • Provide retry / renewal logic examples for serverless deployments.

13. Deliver detailed “Ao” / “Eu” error troubleshooting guide  
    • Map error codes to root causes (permissions, malformed envelopes, SDK mismatch).  
    • Offer step-by-step checks and sample logs.

14. Cross-SDK message format validator  
    • CLI tool that inspects a publish payload and tells if Core or Chat SDK will reject it.  
    • Integrate with CI to prevent malformed messages reaching production.

15. Update all MCP documentation and code samples accordingly  
    • Audit existing pages for Core/Chat confusion, outdated snippets, or missing parameters.  
    • Apply consistent naming, version tags, and links to reference docs.### Task List for Improving the MCP Server (Chat SDK ⇄ Core SDK Separation)

## MCP Server - Improvement Task List

1. Implement `--chat-sdk` CLI Flag  
   • Extend the MCP server’s argument parser to recognise `--chat-sdk`.  
   • When the flag is present, set an internal `mode = CHAT_SDK` enum / constant.  
   • Default behaviour (no flag): `mode = CORE_SDK` (backwards-compatible).

2. Content Filtering Logic  
   • If `mode = CHAT_SDK`, remove or ignore all Core PubNub SDK documentation nodes, navigation links, and code samples from the generated site / JSON output.  
   • If `mode = CORE_SDK`, render the full Core SDK docs as today.  
   • Allow future extension (`mode = BOTH` or `mode = CUSTOM`) by centralising the filter in one module.

3. Chat SDK-only Extras  
   • While in Chat mode, inject the Chat-specific “File Sending via MessageDraft” docs including:  
     – createMessageDraftV2() usage.  
     – Adding `files[]` to the draft.  
     – Draft `.send()` examples.  
   • Remove any mention of the deprecated/irrelevant `channel.sendFile()` API.

4. Dual Build Output Structure  
   • Output directory suggestion:  
     `/build/core-sdk/**` (default)  
     `/build/chat-sdk/**` (when `--chat-sdk`)  
   • Ensure static assets and search indices are namespaced so the two builds can be hosted side-by-side without collisions.

5. Automated Tests  
   • Unit test: command parser recognises `--chat-sdk`.  
   • Integration test: generated navigation tree contains ZERO Core SDK references when Chat mode is active.  
   • Regression test: Core mode build still contains all previous content.

6. Documentation & README Updates  
   • Add a “Modes” section that explains:  
     `mcp build` (Core SDK)  
     `mcp build --chat-sdk` (Chat SDK only)  
   • Provide migration notes for contributors—how to preview each build locally.

7. CI / CD Pipeline Changes  
   • Add two separate build jobs: `build-core-sdk` and `build-chat-sdk`.  
   • Publish artifacts to distinct buckets / paths (e.g., `docs.pubnub.com/core` and `docs.pubnub.com/chat`).  
   • Fail the pipeline if the Chat build leaks any Core SDK pages (string match on known titles).

8. Optional Future Enhancement Placeholder  
   • Consider splitting the repository into two discrete MCP instances (`pubnub-mcp` and `pubnub-chat-mcp`) once the flag stabilises—track under a separate epic.
