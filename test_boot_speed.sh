#!/bin/bash
export TOOLS='{
    "jsonrpc": "2.0",
    "id":1,
    "method":"tools/list",
    "params":{}
}'
time zsh -c '
    coproc npx -y @pubnub/mcp 2>&1;
    pid=$!;
    print -r -p -- "$TOOLS";
    IFS= read -r -p _;
    kill -KILL $pid
'
