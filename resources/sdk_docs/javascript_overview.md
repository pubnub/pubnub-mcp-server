# JavaScript API & SDK Docs 10.2.0

##### Chat SDK
If you want to create a chat app, use the Chat SDK, which relies on the JavaScript SDK, is written in TypeScript, and offers chat-specific methods to manage users, channels, messages, typing indicators, quotes, mentions, threads, and more.

This guide demonstrates core PubNub concepts:
- Setting up a connection
- Sending messages
- Receiving messages in real time

## Overview
The JavaScript SDK provides a simple interface for real-time messaging across:
- Web (browser)
- Node.js (server-side)
- React Native (mobile)

Use JavaScript or TypeScript. Import differences:
- JavaScript (.js): `const PubNub = require('pubnub');`
- TypeScript (.ts): `import PubNub from 'pubnub';`

Supports browsers, Node.js, React Native, and frameworks such as React, Angular, and Vue.

## Prerequisites
- JavaScript basics
- Web: modern browser
- Node.js: Node 10+
- React Native: RN dev environment
- PubNub account and keys
- Optional TypeScript 4.0+

## Setup

### Get your PubNub keys
- Sign in or create an account in the Admin Portal
- Create an app and keyset
- Use separate keysets for dev/prod

### Install the SDK

##### SDK version
Use the latest SDK version.

- Web
To integrate PubNub into your web project, add the JavaScript SDK to your HTML page using the CDN:
```
`1script src="https://cdn.pubnub.com/sdk/javascript/pubnub.10.2.0.js">script>  
`
```
You can also use the minified version for production:
```
`1script src="https://cdn.pubnub.com/sdk/javascript/pubnub.10.2.0.min.js">script>  
`
```

- Node.js
Install the SDK using npm:
```
`1npm install pubnub  
`
```
Then import it:
```
`1const PubNub = require('pubnub');  
`
```

- React Native
Install the SDK:
```
`1npm install pubnub  
`
```
Then import it:
```
`1import PubNub from 'pubnub';  
`
```

- Source code
Clone the GitHub repository:
```
`1git clone https://github.com/pubnub/javascript  
`
```

## Steps

### Initialize PubNub

- Web
Create an instance of PubNub with your keys and a unique userId:
```
`1const pubnub = new PubNub({  
2    publishKey: "demo",  
3    subscribeKey: "demo",  
4    userId: "web-user-" + Math.floor(Math.random() * 1000)  
5});  
`
```

- Node.js
Create an instance of PubNub with your keys and a unique userId:
```
1
  

```

- React Native
Create an instance of PubNub with your keys and a unique userId:
```
`1const pubnub = new PubNub({  
2    publishKey: "demo",  
3    subscribeKey: "demo",  
4    userId: "rn-user-" + Math.floor(Math.random() * 1000)  
5});  
`
```
Initialize in a component and clean up on unmount:
```
`1// Example of initialization in a React component (optional)  
2useEffect(() => {  
3    // Clean up on component unmount  
4    return () => {  
5        if (pubnub) {  
6            pubnub.removeAllListeners();  
7            pubnub.destroy();  
8        }  
9    };  
10}, [pubnub]);  
`
```
See Configuration for more options.

### Set up event listeners
Add listeners for messages, presence events, and connection status.

- Web
```
1// Add listener to handle messages, presence events, and connection status  
2pubnub.addListener({  
3    message: function(event) {  
4        // Handle message event  
5        console.log("New message:", event.message);  
6        // Display message in the UI  
7        displayMessage(event.message);  
8    },  
9    presence: function(event) {  
10        // Handle presence event  
11        console.log("Presence event:", event);  
12        console.log("Action:", event.action); // join, leave, timeout  
13        console.log("Channel:", event.channel);  
14        console.log("Occupancy:", event.occupancy);  
15    },  
16    status: function(event) {  
17        // Handle status event  
18        console.log("Status event:", event);  
19        if (event.category === "PNConnectedCategory") {  
20            console.log("Connected to PubNub channels!");  
21        } else if (event.category === "PNNetworkIssuesCategory") {  
22            console.log("Connection lost. Attempting to reconnect...");  
23        }  
24    }  
25});  
26
  
27// Function to display messages in the UI  
28function displayMessage(message) {  
29    const messagesDiv = document.getElementById('messages');  
30    const messageElement = document.createElement('div');  
31    messageElement.className = 'message';  
32      
33    // Format message based on content  
34    let content = '';  
35    if (typeof message === 'object' && message.text) {  
36        content = `${message.sender || 'User'}: ${message.text}`;  
37    } else {  
38        content = JSON.stringify(message);  
39    }  
40      
41    messageElement.textContent = content;  
42    messagesDiv.appendChild(messageElement);  
43    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to bottom  
44}  
```

- Node.js
```
1
  

```

- React Native
```
1// App.js or App.tsx for TypeScript projects  
2
  
3// Imports  
4import React, { useState, useEffect, useRef } from 'react';  
5import {  
6  SafeAreaView,  
7  StyleSheet,  
8  View,  
9  Text,  
10  TextInput,  
11  TouchableOpacity,  
12  FlatList,  
13  KeyboardAvoidingView,  
14  Platform,  
15  StatusBar,  
16  ActivityIndicator,  
17  Alert  
18} from 'react-native';  
19import PubNub from 'pubnub';  
20
  
21// TypeScript interfaces (for TypeScript projects)  
22// For JavaScript, you can remove this section  
23interface ChatMessage {  
24  text: string;  
25  sender?: string;  
26  time?: string;  
27}  
28
  
29interface MessageItem {  
30  id: string;  
31  message: ChatMessage;  
32}  
33
  
34// Main App Component  
35export default function App() {  
36  // State variables  
37  const [pubnub, setPubnub] = useState(null);  
38  const [messages, setMessages] = useState([]);  
39  const [inputText, setInputText] = useState('');  
40  const [isConnected, setIsConnected] = useState(false);  
41  const [isLoading, setIsLoading] = useState(true);  
42    
43  // Reference to the FlatList for auto-scrolling  
44  const flatListRef = useRef(null);  
45
  
46  // Initialize PubNub on component mount  
47  useEffect(() => {  
48    // Create a new PubNub instance  
49    const pubnubInstance = new PubNub({  
50      publishKey: "demo",  
51      subscribeKey: "demo",  
52      userId: "rn-user-" + Math.floor(Math.random() * 1000)  
53    });  
54      
55    // Add listener to handle events  
56    pubnubInstance.addListener({  
57      // Message handler - called when a message is received  
58      message: function(event) {  
59        setMessages(messages => [  
60          ...messages,   
61          {   
62            id: event.timetoken || Date.now().toString(),  
63            message: event.message  
64          }  
65        ]);  
66          
67        // Auto-scroll to bottom when new messages arrive  
68        setTimeout(() => {  
69          if (flatListRef.current && messages.length > 0) {  
70            flatListRef.current.scrollToEnd({ animated: true });  
71          }  
72        }, 100);  
73      },  
74        
75      // Presence handler - called for join/leave events  
76      presence: function(event) {  
77        console.log("Presence event:", event);  
78        if (event.action === 'join') {  
79          // Someone joined the channel  
80          Alert.alert("User Joined", `${event.uuid} joined the chat`);  
81        } else if (event.action === 'leave' || event.action === 'timeout') {  
82          // Someone left the channel  
83          Alert.alert("User Left", `${event.uuid} left the chat`);  
84        }  
85      },  
86        
87      // Status handler - called for connection status changes  
88      status: function(event) {  
89        console.log("Status event:", event);  
90        if (event.category === "PNConnectedCategory") {  
91          setIsConnected(true);  
92          setIsLoading(false);  
93          console.log("Connected to PubNub!");  
94        } else if (event.category === "PNNetworkIssuesCategory") {  
95          setIsConnected(false);  
96          console.log("Connection lost. Attempting to reconnect...");  
97        } else if (event.category === "PNReconnectedCategory") {  
98          setIsConnected(true);  
99          console.log("Reconnected to PubNub!");  
100        }  
101      }  
102    });  
103      
104    // Create a channel entity and subscription  
105    const channel = pubnubInstance.channel('hello_world');  
106    const subscription = channel.subscription({  
107      receivePresenceEvents: true  
108    });  
109      
110    // Subscribe to the channel  
111    subscription.subscribe();  
112      
113    // Update state with PubNub instance  
114    setPubnub(pubnubInstance);  
115      
116    // Clean up on component unmount  
117    return () => {  
118      pubnubInstance.removeAllListeners();  
119      pubnubInstance.destroy();  
120      console.log("Cleaned up PubNub connection");  
121    };  
122  }, []); // Empty dependency array ensures this runs only once on mount  
123
  
124  // Function to publish a message  
125  const publishMessage = async () => {  
126    // Don't send empty messages or if not connected  
127    if (!inputText.trim() || !pubnub || !isConnected) return;  
128      
129    try {  
130      // Create message object  
131      const messageObject: ChatMessage = {  
132        text: inputText,  
133        sender: pubnub.getUUID(),  
134        time: new Date().toISOString()  
135      };  
136        
137      // Publish to PubNub  
138      const result = await pubnub.publish({  
139        message: messageObject,  
140        channel: 'hello_world'  
141      });  
142        
143      console.log("Message published with timetoken:", result.timetoken);  
144        
145      // Clear input after successful send  
146      setInputText('');  
147    } catch (error) {  
148      console.error("Publish failed:", error);  
149      Alert.alert(  
150        "Message Failed",   
151        "Could not send your message. Please try again."  
152      );  
153    }  
154  };  
155
  
156  // Render a message item for the FlatList  
157  const renderMessageItem = ({ item }) => {  
158    const isCurrentUser = item.message.sender === pubnub?.getUUID();  
159    const messageTime = item.message.time   
160      ? new Date(item.message.time).toLocaleTimeString([], {   
161          hour: '2-digit',   
162          minute: '2-digit'   
163        })   
164      : '';  
165        
166    return (  
167      View style={[  
168        styles.messageContainer,  
169        isCurrentUser ? styles.sentMessage : styles.receivedMessage  
170      ]}>  
171        Text style={styles.senderText}>  
172          {isCurrentUser ? 'You' : (item.message.sender || 'User')}  
173        Text>  
174        Text style={styles.messageText}>{item.message.text}Text>  
175        Text style={styles.timeText}>{messageTime}Text>  
176      View>  
177    );  
178  };  
179  
180  // Main component render  
181  return (  
182    SafeAreaView style={styles.safeArea}>  
183      StatusBar barStyle="dark-content" />  
184        
185      {isLoading ? (  
186        // Loading screen  
187        View style={styles.loadingContainer}>  
188          ActivityIndicator size="large" color="#4b0082" />  
189          Text style={styles.loadingText}>Connecting to PubNub...Text>  
190        View>  
191      ) : (  
192        // Chat UI  
193        KeyboardAvoidingView  
194          behavior={Platform.OS === "ios" ? "padding" : "height"}  
195          style={styles.container}  
196          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}  
197        >  
198          {/* Header */}  
199          View style={styles.header}>  
200            Text style={styles.headerText}>PubNub ChatText>  
201            View style={[  
202              styles.connectionIndicator,  
203              isConnected ? styles.connected : styles.disconnected  
204            ]} />  
205          View>  
206            
207          {/* Messages List */}  
208          FlatList  
209            ref={flatListRef}  
210            data={messages}  
211            renderItem={renderMessageItem}  
212            keyExtractor={(item) => item.id}  
213            style={styles.messagesList}  
214            contentContainerStyle={styles.messagesContent}  
215            onContentSizeChange={() =>   
216              flatListRef.current?.scrollToEnd({ animated: false })  
217            }  
218          />  
219            
220          {/* Input Area */}  
221          View style={styles.inputContainer}>  
222            TextInput  
223              style={styles.input}  
224              value={inputText}  
225              onChangeText={setInputText}  
226              placeholder="Type a message..."  
227              placeholderTextColor="#aaa"  
228              returnKeyType="send"  
229              onSubmitEditing={publishMessage}  
230            />  
231            TouchableOpacity  
232              style={[  
233                styles.sendButton,  
234                (!inputText.trim() || !isConnected) && styles.sendButtonDisabled  
235              ]}  
236              onPress={publishMessage}  
237              disabled={!inputText.trim() || !isConnected}  
238            >  
239              Text style={styles.sendButtonText}>SendText>  
240            TouchableOpacity>  
241          View>  
242        KeyboardAvoidingView>  
243      )}  
244    SafeAreaView>  
245  );  
246}  
247
  
248// Component styles  
249const styles = StyleSheet.create({  
250  safeArea: {  
251    flex: 1,  
252    backgroundColor: '#f5f5f5',  
253  },  
254  container: {  
255    flex: 1,  
256  },  
257  loadingContainer: {  
258    flex: 1,  
259    justifyContent: 'center',  
260    alignItems: 'center',  
261  },  
262  loadingText: {  
263    marginTop: 10,  
264    fontSize: 16,  
265    color: '#555',  
266  },  
267  header: {  
268    flexDirection: 'row',  
269    alignItems: 'center',  
270    justifyContent: 'space-between',  
271    padding: 16,  
272    borderBottomWidth: 1,  
273    borderBottomColor: '#e0e0e0',  
274    backgroundColor: '#fff',  
275  },  
276  headerText: {  
277    fontSize: 18,  
278    fontWeight: 'bold',  
279    color: '#333',  
280  },  
281  connectionIndicator: {  
282    width: 12,  
283    height: 12,  
284    borderRadius: 6,  
285  },  
286  connected: {  
287    backgroundColor: '#4CAF50',  
288  },  
289  disconnected: {  
290    backgroundColor: '#F44336',  
291  },  
292  messagesList: {  
293    flex: 1,  
294    padding: 8,  
295  },  
296  messagesContent: {  
297    paddingBottom: 8,  
298  },  
299  messageContainer: {  
300    padding: 12,  
301    borderRadius: 16,  
302    marginVertical: 4,  
303    maxWidth: '80%',  
304    shadowColor: '#000',  
305    shadowOffset: { width: 0, height: 1 },  
306    shadowOpacity: 0.1,  
307    shadowRadius: 1,  
308    elevation: 1,  
309  },  
310  sentMessage: {  
311    alignSelf: 'flex-end',  
312    backgroundColor: '#DCF8C6',  
313    borderBottomRightRadius: 4,  
314  },  
315  receivedMessage: {  
316    alignSelf: 'flex-start',  
317    backgroundColor: '#fff',  
318    borderBottomLeftRadius: 4,  
319  },  
320  senderText: {  
321    fontWeight: 'bold',  
322    fontSize: 13,  
323    marginBottom: 4,  
324    color: '#333',  
325  },  
326  messageText: {  
327    fontSize: 15,  
328    color: '#333',  
329  },  
330  timeText: {  
331    fontSize: 11,  
332    color: '#999',  
333    alignSelf: 'flex-end',  
334    marginTop: 4,  
335  },  
336  inputContainer: {  
337    flexDirection: 'row',  
338    padding: 12,  
339    borderTopWidth: 1,  
340    borderTopColor: '#e0e0e0',  
341    backgroundColor: '#fff',  
342  },  
343  input: {  
344    flex: 1,  
345    height: 40,  
346    borderWidth: 1,  
347    borderColor: '#ddd',  
348    borderRadius: 20,  
349    paddingHorizontal: 16,  
350    marginRight: 8,  
351    backgroundColor: '#fff',  
352    color: '#333',  
353  },  
354  sendButton: {  
355    height: 40,  
356    paddingHorizontal: 16,  
357    borderRadius: 20,  
358    backgroundColor: '#4b0082',  
359    justifyContent: 'center',  
360    alignItems: 'center',  
361  },  
362  sendButtonDisabled: {  
363    backgroundColor: '#B39DDB',  
364  },  
365  sendButtonText: {  
366    color: '#fff',  
367    fontWeight: 'bold',  
368  },  
369});  
```
For RN quick start:
- Create project:
```
# Using Expo (easiest for beginners)  
npx create-expo-app PubNubChatApp  
cd PubNubChatApp  

  
# Or using React Native CLI  
npx react-native init PubNubChatApp  
cd PubNubChatApp  
```
- Install SDK:
```
`npm install pubnub  
`
```
- Replace App.js/tsx with the code above.
- Run:
```
# For Expo  
npx expo start  

  
# For React Native CLI  
npx react-native run-ios  
# or  
npx react-native run-android  
```

### Create a subscription
Subscribe to receive messages.

- Web
```
1// Create a channel entity  
2const channel = pubnub.channel('hello_world');  
3
  
4// Create a subscription for this channel  
5const subscription = channel.subscription();  
6
  
7// Subscribe  
8subscription.subscribe();  
```

- Node.js
```
1
  

```

- React Native
```
`1useEffect(() => {  
2    if (!pubnub) return;  
3      
4    // Create a channel entity  
5    const channel = pubnub.channel('hello_world');  
6      
7    // Create a subscription  
8    const subscription = channel.subscription({  
9        receivePresenceEvents: true  
10    });  
11      
12    // Subscribe  
13    subscription.subscribe();  
14      
15    // Clean up on unmount  
16    return () => {  
17        // First remove listeners to prevent callbacks during cleanup  
18        pubnub.removeAllListeners();  
19          
20        // Then unsubscribe if needed  
21        if (subscription) {  
22            subscription.unsubscribe();  
23        }  
24          
25        // Note: Only call destroy() if this component owns the pubnub instance  
26        // If the pubnub instance is shared, consider only removing listeners  
27    };  
28}, [pubnub]);  
`
```

### Publish messages
Publish JSON-serializable messages (< 32 KiB) to a channel.

- Web
```
1// Function to publish a message  
2async function publishMessage(text) {  
3    if (!text.trim()) return;  
4      
5    try {  
6        const result = await pubnub.publish({  
7            message: {  
8                text: text,  
9                sender: pubnub.getUUID(),  
10                time: new Date().toISOString()  
11            },  
12            channel: 'hello_world'  
13        });  
14        console.log("Message published with timetoken:", result.timetoken);  
15    } catch (error) {  
16        console.error("Publish failed:", error);  
17    }  
18}  
19
  
20// Example: Call this function when a button is clicked  
21document.getElementById('send-button').addEventListener('click', function() {  
22    const input = document.getElementById('message-input');  
23    publishMessage(input.value);  
24    input.value = '';  
25});  
```

- Node.js
```
1
  

```

- React Native
```
1// State for the input text  
2const [inputText, setInputText] = useState('');  
3
  
4// Function to publish a message  
5const publishMessage = async () => {  
6    if (!inputText.trim() || !pubnub) return;  
7      
8    try {  
9        const result = await pubnub.publish({  
10            message: {  
11                text: inputText,  
12                sender: pubnub.getUUID(),  
13                time: new Date().toISOString()  
14            },  
15            channel: 'hello_world'  
16        });  
17        console.log("Message published with timetoken:", result.timetoken);  
18        setInputText(''); // Clear input after sending  
19    } catch (error) {  
20        console.error("Publish failed:", error);  
21        Alert.alert("Error", "Failed to send message");  
22    }  
23};  
24
  
25// In your render function  
26return (  
27    View style={styles.container}>  
28        TextInput  
29            value={inputText}  
30            onChangeText={setInputText}  
31            placeholder="Type a message..."  
32            style={styles.input}  
33        />  
34        Button title="Send" onPress={publishMessage} />  
35    /View>  
36);  
```

### Run the app

- Node.js
Save your JavaScript file (e.g., index.js). Run:
```
`node index.js  
`
```
Open another terminal and run another instance to test real-time messaging.

- React Native
Start your app:
```
`npm run android  
# or  
npm run ios  
# or  
npm run web  
`
```

## Complete example

- Web
```
1DOCTYPE html>  
2html>  
3head>  
4    meta charset="utf-8" />  
5    title>PubNub Chat Exampletitle>  
6    script src="https://cdn.pubnub.com/sdk/javascript/pubnub.10.2.0.js">script>  
7    style>  
8        #chat-container {  
9            max-width: 600px;  
10            margin: 0 auto;  
11            padding: 20px;  
12            font-family: Arial, sans-serif;  
13        }  
14        #messages {  
15            height: 300px;  
16            overflow-y: auto;  
17            border: 1px solid #ccc;  
18            padding: 10px;  
19            margin-bottom: 10px;  
20            background-color: #f9f9f9;  
21        }  
22        .message {  
23            margin-bottom: 8px;  
24            padding: 8px;  
25            border-radius: 4px;  
26            background-color: #e9e9e9;  
27        }  
28        .input-container {  
29            display: flex;  
30        }  
31        #message-input {  
32            flex-grow: 1;  
33            padding: 8px;  
34            margin-right: 10px;  
35        }  
36    style>  
37head>  
38body>  
39    div id="chat-container">  
40        h1>PubNub Chath1>  
41        div id="messages">div>  
42        div class="input-container">  
43            input type="text" id="message-input" placeholder="Type a message..." />  
44            button id="send-button">Sendbutton>  
45        div>  
46    div>  
47
  
48    script>  
49        // Initialize PubNub  
50        const pubnub = new PubNub({  
51            publishKey: "demo",  
52            subscribeKey: "demo",  
53            userId: "web-user-" + Math.floor(Math.random() * 1000)  
54        });  
55
  
56        // Display messages in the UI  
57        function displayMessage(message) {  
58            const messagesDiv = document.getElementById('messages');  
59            const messageElement = document.createElement('div');  
60            messageElement.className = 'message';  
61              
62            // Format message based on content  
63            let content = '';  
64            if (typeof message === 'object' && message.text) {  
65                content = `${message.sender || 'User'}: ${message.text}`;  
66            } else {  
67                content = JSON.stringify(message);  
68            }  
69              
70            messageElement.textContent = content;  
71            messagesDiv.appendChild(messageElement);  
72            messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to bottom  
73        }  
74
  
75        // Add listener to handle messages  
76        pubnub.addListener({  
77            message: function(event) {  
78                displayMessage(event.message);  
79            },  
80            status: function(event) {  
81                if (event.category === "PNConnectedCategory") {  
82                    console.log("Connected to PubNub!");  
83                    // Display a connection message  
84                    const messagesDiv = document.getElementById('messages');  
85                    const statusElement = document.createElement('div');  
86                    statusElement.textContent = "Connected to chat!";  
87                    statusElement.style.textAlign = "center";  
88                    statusElement.style.color = "green";  
89                    messagesDiv.appendChild(statusElement);  
90                }  
91            }  
92        });  
93
  
94        // Subscribe to a channel  
95        const channel = pubnub.channel('hello_world');  
96        const subscription = channel.subscription();  
97        subscription.subscribe();  
98
  
99        // Publish message function  
100        async function publishMessage(text) {  
101            if (!text.trim()) return;  
102              
103            try {  
104                const result = await pubnub.publish({  
105                    message: {  
106                        text: text,  
107                        sender: pubnub.getUUID(),  
108                        time: new Date().toISOString()  
109                    },  
110                    channel: 'hello_world'  
111                });  
112                console.log("Message published with timetoken:", result.timetoken);  
113            } catch (error) {  
114                console.error("Publish failed:", error);  
115            }  
116        }  
117
  
118        // Add event listeners for the UI  
119        document.getElementById('send-button').addEventListener('click', function() {  
120            const input = document.getElementById('message-input');  
121            publishMessage(input.value);  
122            input.value = '';  
123        });  
124
  
125        document.getElementById('message-input').addEventListener('keypress', function(e) {  
126            if (e.key === 'Enter') {  
127                const input = document.getElementById('message-input');  
128                publishMessage(input.value);  
129                input.value = '';  
130            }  
131        });  
132    script>  
133body>  
134html>  
```

- Node.js
```
1
  

```

- React Native
```
1// App.js or App.tsx for TypeScript projects  
2
  
3// Imports  
4import React, { useState, useEffect, useRef } from 'react';  
5import {  
6  SafeAreaView,  
7  StyleSheet,  
8  View,  
9  Text,  
10  TextInput,  
11  TouchableOpacity,  
12  FlatList,  
13  KeyboardAvoidingView,  
14  Platform,  
15  StatusBar,  
16  ActivityIndicator,  
17  Alert  
18} from 'react-native';  
19import PubNub from 'pubnub';  
20
  
21// TypeScript interfaces (for TypeScript projects)  
22// For JavaScript, you can remove this section  
23interface ChatMessage {  
24  text: string;  
25  sender?: string;  
26  time?: string;  
27}  
28
  
29interface MessageItem {  
30  id: string;  
31  message: ChatMessage;  
32}  
33
  
34// Main App Component  
35export default function App() {  
36  // State variables  
37  const [pubnub, setPubnub] = useState(null);  
38  const [messages, setMessages] = useState([]);  
39  const [inputText, setInputText] = useState('');  
40  const [isConnected, setIsConnected] = useState(false);  
41  const [isLoading, setIsLoading] = useState(true);  
42    
43  // Reference to the FlatList for auto-scrolling  
44  const flatListRef = useRef(null);  
45
  
46  // Initialize PubNub on component mount  
47  useEffect(() => {  
48    // Create a new PubNub instance  
49    const pubnubInstance = new PubNub({  
50      publishKey: "demo",  
51      subscribeKey: "demo",  
52      userId: "rn-user-" + Math.floor(Math.random() * 1000)  
53    });  
54      
55    // Add listener to handle events  
56    pubnubInstance.addListener({  
57      // Message handler - called when a message is received  
58      message: function(event) {  
59        setMessages(messages => [  
60          ...messages,   
61          {   
62            id: event.timetoken || Date.now().toString(),  
63            message: event.message  
64          }  
65        ]);  
66          
67        // Auto-scroll to bottom when new messages arrive  
68        setTimeout(() => {  
69          if (flatListRef.current && messages.length > 0) {  
70            flatListRef.current.scrollToEnd({ animated: true });  
71          }  
72        }, 100);  
73      },  
74        
75      // Presence handler - called for join/leave events  
76      presence: function(event) {  
77        console.log("Presence event:", event);  
78        if (event.action === 'join') {  
79          // Someone joined the channel  
80          Alert.alert("User Joined", `${event.uuid} joined the chat`);  
81        } else if (event.action === 'leave' || event.action === 'timeout') {  
82          // Someone left the channel  
83          Alert.alert("User Left", `${event.uuid} left the chat`);  
84        }  
85      },  
86        
87      // Status handler - called for connection status changes  
88      status: function(event) {  
89        console.log("Status event:", event);  
90        if (event.category === "PNConnectedCategory") {  
91          setIsConnected(true);  
92          setIsLoading(false);  
93          console.log("Connected to PubNub!");  
94        } else if (event.category === "PNNetworkIssuesCategory") {  
95          setIsConnected(false);  
96          console.log("Connection lost. Attempting to reconnect...");  
97        } else if (event.category === "PNReconnectedCategory") {  
98          setIsConnected(true);  
99          console.log("Reconnected to PubNub!");  
100        }  
101      }  
102    });  
103      
104    // Create a channel entity and subscription  
105    const channel = pubnubInstance.channel('hello_world');  
106    const subscription = channel.subscription({  
107      receivePresenceEvents: true  
108    });  
109      
110    // Subscribe to the channel  
111    subscription.subscribe();  
112      
113    // Update state with PubNub instance  
114    setPubnub(pubnubInstance);  
115      
116    // Clean up on component unmount  
117    return () => {  
118      pubnubInstance.removeAllListeners();  
119      pubnubInstance.destroy();  
120      console.log("Cleaned up PubNub connection");  
121    };  
122  }, []); // Empty dependency array ensures this runs only once on mount  
123
  
124  // Function to publish a message  
125  const publishMessage = async () => {  
126    // Don't send empty messages or if not connected  
127    if (!inputText.trim() || !pubnub || !isConnected) return;  
128      
129    try {  
130      // Create message object  
131      const messageObject: ChatMessage = {  
132        text: inputText,  
133        sender: pubnub.getUUID(),  
134        time: new Date().toISOString()  
135      };  
136        
137      // Publish to PubNub  
138      const result = await pubnub.publish({  
139        message: messageObject,  
140        channel: 'hello_world'  
141      });  
142        
143      console.log("Message published with timetoken:", result.timetoken);  
144        
145      // Clear input after successful send  
146      setInputText('');  
147    } catch (error) {  
148      console.error("Publish failed:", error);  
149      Alert.alert(  
150        "Message Failed",   
151        "Could not send your message. Please try again."  
152      );  
153    }  
154  };  
155
  
156  // Render a message item for the FlatList  
157  const renderMessageItem = ({ item }) => {  
158    const isCurrentUser = item.message.sender === pubnub?.getUUID();  
159    const messageTime = item.message.time   
160      ? new Date(item.message.time).toLocaleTimeString([], {   
161          hour: '2-digit',   
162          minute: '2-digit'   
163        })   
164      : '';  
165        
166    return (  
167      View style={[  
168        styles.messageContainer,  
169        isCurrentUser ? styles.sentMessage : styles.receivedMessage  
170      ]}>  
171        Text style={styles.senderText}>  
172          {isCurrentUser ? 'You' : (item.message.sender || 'User')}  
173        Text>  
174        Text style={styles.messageText}>{item.message.text}Text>  
175        Text style={styles.timeText}>{messageTime}Text>  
176      View>  
177    );  
178  };  
179  
180  // Main component render  
181  return (  
182    SafeAreaView style={styles.safeArea}>  
183      StatusBar barStyle="dark-content" />  
184        
185      {isLoading ? (  
186        // Loading screen  
187        View style={styles.loadingContainer}>  
188          ActivityIndicator size="large" color="#4b0082" />  
189          Text style={styles.loadingText}>Connecting to PubNub...Text>  
190        View>  
191      ) : (  
192        // Chat UI  
193        KeyboardAvoidingView  
194          behavior={Platform.OS === "ios" ? "padding" : "height"}  
195          style={styles.container}  
196          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}  
197        >  
198          {/* Header */}  
199          View style={styles.header}>  
200            Text style={styles.headerText}>PubNub ChatText>  
201            View style={[  
202              styles.connectionIndicator,  
203              isConnected ? styles.connected : styles.disconnected  
204            ]} />  
205          View>  
206            
207          {/* Messages List */}  
208          FlatList  
209            ref={flatListRef}  
210            data={messages}  
211            renderItem={renderMessageItem}  
212            keyExtractor={(item) => item.id}  
213            style={styles.messagesList}  
214            contentContainerStyle={styles.messagesContent}  
215            onContentSizeChange={() =>   
216              flatListRef.current?.scrollToEnd({ animated: false })  
217            }  
218          />  
219            
220          {/* Input Area */}  
221          View style={styles.inputContainer}>  
222            TextInput  
223              style={styles.input}  
224              value={inputText}  
225              onChangeText={setInputText}  
226              placeholder="Type a message..."  
227              placeholderTextColor="#aaa"  
228              returnKeyType="send"  
229              onSubmitEditing={publishMessage}  
230            />  
231            TouchableOpacity  
232              style={[  
233                styles.sendButton,  
234                (!inputText.trim() || !isConnected) && styles.sendButtonDisabled  
235              ]}  
236              onPress={publishMessage}  
237              disabled={!inputText.trim() || !isConnected}  
238            >  
239              Text style={styles.sendButtonText}>SendText>  
240            TouchableOpacity>  
241          View>  
242        KeyboardAvoidingView>  
243      )}  
244    SafeAreaView>  
245  );  
246}  
247
  
248// Component styles  
249const styles = StyleSheet.create({  
250  safeArea: {  
251    flex: 1,  
252    backgroundColor: '#f5f5f5',  
253  },  
254  container: {  
255    flex: 1,  
256  },  
257  loadingContainer: {  
258    flex: 1,  
259    justifyContent: 'center',  
260    alignItems: 'center',  
261  },  
262  loadingText: {  
263    marginTop: 10,  
264    fontSize: 16,  
265    color: '#555',  
266  },  
267  header: {  
268    flexDirection: 'row',  
269    alignItems: 'center',  
270    justifyContent: 'space-between',  
271    padding: 16,  
272    borderBottomWidth: 1,  
273    borderBottomColor: '#e0e0e0',  
274    backgroundColor: '#fff',  
275  },  
276  headerText: {  
277    fontSize: 18,  
278    fontWeight: 'bold',  
279    color: '#333',  
280  },  
281  connectionIndicator: {  
282    width: 12,  
283    height: 12,  
284    borderRadius: 6,  
285  },  
286  connected: {  
287    backgroundColor: '#4CAF50',  
288  },  
289  disconnected: {  
290    backgroundColor: '#F44336',  
291  },  
292  messagesList: {  
293    flex: 1,  
294    padding: 8,  
295  },  
296  messagesContent: {  
297    paddingBottom: 8,  
298  },  
299  messageContainer: {  
300    padding: 12,  
301    borderRadius: 16,  
302    marginVertical: 4,  
303    maxWidth: '80%',  
304    shadowColor: '#000',  
305    shadowOffset: { width: 0, height: 1 },  
306    shadowOpacity: 0.1,  
307    shadowRadius: 1,  
308    elevation: 1,  
309  },  
310  sentMessage: {  
311    alignSelf: 'flex-end',  
312    backgroundColor: '#DCF8C6',  
313    borderBottomRightRadius: 4,  
314  },  
315  receivedMessage: {  
316    alignSelf: 'flex-start',  
317    backgroundColor: '#fff',  
318    borderBottomLeftRadius: 4,  
319  },  
320  senderText: {  
321    fontWeight: 'bold',  
322    fontSize: 13,  
323    marginBottom: 4,  
324    color: '#333',  
325  },  
326  messageText: {  
327    fontSize: 15,  
328    color: '#333',  
329  },  
330  timeText: {  
331    fontSize: 11,  
332    color: '#999',  
333    alignSelf: 'flex-end',  
334    marginTop: 4,  
335  },  
336  inputContainer: {  
337    flexDirection: 'row',  
338    padding: 12,  
339    borderTopWidth: 1,  
340    borderTopColor: '#e0e0e0',  
341    backgroundColor: '#fff',  
342  },  
343  input: {  
344    flex: 1,  
345    height: 40,  
346    borderWidth: 1,  
347    borderColor: '#ddd',  
348    borderRadius: 20,  
349    paddingHorizontal: 16,  
350    marginRight: 8,  
351    backgroundColor: '#fff',  
352    color: '#333',  
353  },  
354  sendButton: {  
355    height: 40,  
356    paddingHorizontal: 16,  
357    borderRadius: 20,  
358    backgroundColor: '#4b0082',  
359    justifyContent: 'center',  
360    alignItems: 'center',  
361  },  
362  sendButtonDisabled: {  
363    backgroundColor: '#B39DDB',  
364  },  
365  sendButtonText: {  
366    color: '#fff',  
367    fontWeight: 'bold',  
368  },  
369});  
```

## Next steps
- JavaScript Chat SDK for ready-to-use chat features
- Presence for online/offline status
- Message Persistence to store/retrieve messages
- Access Manager to secure channels
- Channel Groups to organize channels
- Explore GitHub repository for more samples
- Tutorials: IoT dashboard, Geolocation app, Delivery app
- See SDK reference documentation and support portal for detailed API info and help