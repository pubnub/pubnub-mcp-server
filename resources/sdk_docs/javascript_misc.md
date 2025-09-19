# Utility Methods API for JavaScript SDK

Utility methods that don't fit other categories.

## PubNubFile

Internal representation of a file. Methods vary by environment.

### Extracting the file

##### Methods supported in Node.js

- file.toBuffer() returns Promise<Buffer>
- file.toStream() returns Promise<Readable>
- file.toString(encoding: string) returns a string encoded using encoding (defaults to utf8 if not available)

##### Methods supported in a browser

- file.toFile() returns Promise<File>
- file.toBlob() returns Promise<Blob>
- file.toArrayBuffer() returns Promise<ArrayBuffer>
- file.toString(encoding: string) returns a string encoded using encoding (defaults to utf8 if not available)

##### React and React Native

- file.toBlob() returns Promise<Blob>

### Creating a file

```
pubnub.File.create(input: FileInput): PubNubFile;
```

FileInput supports multiple environments:

#### Node.js

Using streams:
```
{
  stream: Readable,
  name: string,
  mimeType?: string
}
```

Using buffers:
```
{
  data: Buffer,
  name: string,
  mimeType?: string
}
```

Using strings:
```
{
  data: string,
  encoding: string,
  name: string,
  mimeType?: string
}
```

#### Browsers

Using File API:
```
File
```

Using strings:
```
{
  data: string,
  name: string,
  mimeType?: string
}
```

Using ArrayBuffer:
```
{
  data: ArrayBuffer,
  name: string,
  mimeType?: string
}
```

## Disconnect

Stop all requests to PubNub when there are active subscribe channels.

### Method(s)

```
disconnect()
```

No arguments.

### Sample code

```

```

## Reconnect

Force the SDK to try to reach PubNub again.

### Method(s)

```
reconnect()
```

No arguments.

### Sample code

```

```

## setProxy

Assign or reassign a proxy configuration at runtime. Node.js only.

### Method(s)

```
setProxy({ String hostname, Number port, String protocol })
```

- hostname: String. IP address or URI to use.
- port: Number. Proxy port.
- protocol: String. Default: http. Supported: http, https, socks5, socks4, pac.

### Sample code

```

```

### Other examples

#### Delete the proxy in run time

```
**
```