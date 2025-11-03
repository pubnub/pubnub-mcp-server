# Utility Methods API for JavaScript SDK

Utility methods that don't fit into other categories.

## PubNubFile[​](#pubnubfile)

Internal file representation. Available extraction methods depend on environment.

### Extracting the file[​](#extracting-the-file)

##### Methods supported in Node.js[​](#methods-supported-in-nodejs)

- `file.toBuffer()` returns `Promise<Buffer>`
- `file.toStream()` returns `Promise<Readable>`
- `file.toString(encoding: string)` returns a string encoded using `encoding` (if not available, defaults to `utf8`)

##### Methods supported in a browser[​](#methods-supported-in-a-browser)

- `file.toFile()` returns `Promise<File>`
- `file.toBlob()` returns `Promise<Blob>`
- `file.toArrayBuffer()` returns `Promise<ArrayBuffer>`
- `file.toString(encoding: string)` returns a string encoded using `encoding` (if not available, defaults to `utf8`)

##### React and React Native[​](#react-and-react-native)

- `file.toBlob()` returns `Promise<Blob>`

### Creating a file[​](#creating-a-file)

```
`1pubnub.File.create(input: FileInput): PubNubFile;  
`
```

`FileInput` varies by environment.

#### Node.js[​](#nodejs)

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

#### Browsers[​](#browsers)

**Using [File API](https://developer.mozilla.org/en-US/docs/Web/API/File):**
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

## Disconnect[​](#disconnect)

Stop all requests to PubNub servers when there are active subscribe channels.

### Method(s)[​](#methods)

```
`1disconnect()  
`
```

This method doesn't take any arguments.

### Sample code[​](#sample-code)

```
1
  

```

## Reconnect[​](#reconnect)

Force the SDK to try to reach PubNub again.

### Method(s)[​](#methods-1)

```
`1reconnect()  
`
```

This method doesn't take any arguments.

### Sample code[​](#sample-code-1)

```
1
  

```

## setProxy[​](#setproxy)

Assign or reassign a proxy configuration at runtime. Node.js only.

### Method(s)[​](#methods-2)

```
`1setProxy({String hostname, Number port, String protocol})  
`
```

- hostname: String, required. IP address or URI.
- port: Number, required. Proxy listening port.
- protocol: String, default: http. Supported: http, https, socks5, socks4, pac.

### Sample code[​](#sample-code-2)

```
1
  

```

### Other examples[​](#other-examples)

#### Delete the proxy in run time[​](#delete-the-proxy-in-run-time)

```
1
**
```

Last updated on Sep 3, 2025**