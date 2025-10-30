# Utility Methods API for JavaScript SDK

Utility methods that don't fit into other categories.

## PubNubFile

Internal file representation used by the SDK. Extraction methods vary by environment.

### Extracting the file

##### Methods supported in Node.js

- file.toBuffer() returns Promise<Buffer>
- file.toStream() returns Promise<Readable>
- file.toString(encoding: string) returns a string encoded using encoding (defaults to utf8)

##### Methods supported in a browser

- file.toFile() returns Promise<File>
- file.toBlob() returns Promise<Blob>
- file.toArrayBuffer() returns Promise<ArrayBuffer>
- file.toString(encoding: string) returns a string encoded using encoding (defaults to utf8)

##### React and React Native

- file.toBlob() returns Promise<Blob>

### Creating a file

```
pubnub.File.create(input: FileInput): PubNubFile;
```

FileInput accepts different shapes per environment.

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

This method doesn't take any arguments.

### Sample code

```

```

## Reconnect

Force the SDK to try to reach PubNub again.

### Method(s)

```
reconnect()
```

This method doesn't take any arguments.

### Sample code

```

```

## setProxy

Assign or reassign a proxy configuration at runtime. Node.js only.

### Method(s)

```
setProxy({String hostname, Number port, String protocol})
```

- hostname (String): IP address or URI.
- port (Number): Proxy listen port.
- protocol (String, default: http): Supported values: http, https, socks5, socks4, pac.

### Sample code

```

```

### Other examples

#### Delete the proxy in run time

```
1
**
```