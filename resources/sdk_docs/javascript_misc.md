# Utility Methods API for JavaScript SDK

Utility methods that don't fit other categories.

## PubNubFile

Internal file representation used by the SDK. Extraction methods vary by environment.

### Extracting the file

##### Methods supported in Node.js

- `file.toBuffer()` returns `Promise<Buffer>`
- `file.toStream()` returns `Promise<Readable>`
- `file.toString(encoding: string)` returns a string encoded using `encoding` (defaults to `utf8`)

##### Methods supported in a browser

- `file.toFile()` returns `Promise<File>`
- `file.toBlob()` returns `Promise<Blob>`
- `file.toArrayBuffer()` returns `Promise<ArrayBuffer>`
- `file.toString(encoding: string)` returns a string encoded using `encoding` (defaults to `utf8`)

##### React and React Native

- `file.toBlob()` returns `Promise<Blob>`

### Creating a file

```
`1pubnub.File.create(input: FileInput): PubNubFile;  
`
```

`FileInput` supports multiple input types by environment.

#### Node.js

**Using streams:**
```
`1{  
2    stream: Readable,  
3    name: string,  
4    mimeType?: string  
5}  
`
```

**Using buffers:**
```
`1{  
2    data: Buffer,  
3    name: string,  
4    mimeType?: string  
5}  
`
```

**Using strings:**
```
`1{  
2    data: string,  
3    encoding: string,  
4    name: string,  
5    mimeType?: string  
6}  
`
```

#### Browsers

**Using File API:**
```
`1File  
`
```

**Using strings:**
```
`1{  
2    data: string,  
3    name: string,  
4    mimeType?: string  
5}  
`
```

**Using ArrayBuffer:**
```
`1{  
2    data: ArrayBuffer,  
3    name: string,  
4    mimeType?: string  
5}  
`
```

## Disconnect

Stop all requests to PubNub servers when there are active subscribe channels.

### Method(s)

```
`1disconnect()  
`
```

No arguments.

### Sample code

```
1
  

```

## Reconnect

Force the SDK to attempt reconnection to PubNub.

### Method(s)

```
`1reconnect()  
`
```

No arguments.

### Sample code

```
1
  

```

## setProxy

Assign or reassign a proxy configuration at runtime. Node.js only.

### Method(s)

```
`1setProxy({String hostname, Number port, String protocol})  
`
```

Parameters:
- hostname (String): IP address or URI to use.
- port (Number): Proxy listening port.
- protocol (String, default: http): Supported values: `http`, `https`, `socks5`, `socks4`, `pac`.

### Sample code

```
1
  

```

### Other examples

#### Delete the proxy in run time

```
1
**
```

Last updated on Sep 3, 2025