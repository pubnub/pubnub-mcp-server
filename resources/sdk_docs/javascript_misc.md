# Utility Methods API – JavaScript SDK (misc)

> All code blocks from the original document are kept verbatim.  
> Deprecated parameters fall back to legacy 128-bit encryption and override any configured `cryptoModule`.

---

## Encrypt

### Signature
```
`encrypt(  
    data: string,  
    customCipherKey?: string  
)  
`
```

Parameters  
• `data` (string | bytes) – data to encrypt  
• `customCipherKey?` (string) – overrides `cryptoModule`, uses legacy scheme

### Example – encrypt part of message
```
`  
`
```
```
`  
`
```

### Returns  
Encrypted data (`string`)

---

## Encrypt File

### Signature
```
`pubnub.encryptFile(  
    key: string,  
    file: PubNubFile  
): PromisePubNubFile>;  
`
```

Parameters  
• `key` (string) – cipher key  
• `file` (PubNubFile) – file to encrypt

### Example
```
`  
`
```

### Returns  
`Promise<PubNubFile>`

---

## Decrypt

### Signature
```
`decrypt(  
    data: string,  
    customCipherKey?: string  
`
```

Parameters  
• `data` (string) – data to decrypt  
• `customCipherKey?` (string) – overrides `cryptoModule`; otherwise the configured module is used

### Example
```
`  
`
```

### Returns  
Decrypted data (`object`)

### Errors  
`decrypt()` throws a descriptive error on failure.

---

## Decrypt File

### Signature
```
`pubnub.decryptFile(  
    key: string,  
    file: PubNubFile  
): PromisePubNubFile>;  
`
```

Parameters  
• `key` (string) – cipher key  
• `file` (PubNubFile) – file to decrypt

### Example
```
`  
`
```

### Returns  
`Promise<PubNubFile>`

---

## PubNubFile

### Extracting
Node.js  
• `file.toBuffer()` → `Promise<Buffer>`  
• `file.toStream()` → `Promise<Readable>`  
• `file.toString(encoding)` → `string`

Browser  
• `file.toFile()` → `Promise<File>`  
• `file.toBlob()` → `Promise<Blob>`  
• `file.toArrayBuffer()` → `Promise<ArrayBuffer>`  
• `file.toString(encoding)` → `string`

React / React Native  
• `file.toBlob()` → `Promise<Blob>`

### Creating
```
`pubnub.File.create(input: FileInput): PubNubFile;  
`
```

Node.js – streams
```
`{  
    stream: Readable,  
    name: string,  
    mimeType?: string  
}  
`
```

Node.js – buffers
```
`{  
    data: Buffer,  
    name: string,  
    mimeType?: string  
}  
`
```

Node.js – strings
```
`{  
    data: string,  
    encoding: string,  
    name: string,  
    mimeType?: string  
}  
`
```

Browsers – File API
```
`File  
`
```

Browsers – strings
```
`{  
    data: string,  
    name: string,  
    mimeType?: string  
}  
`
```

Browsers – ArrayBuffer
```
`{  
    data: ArrayBuffer,  
    name: string,  
    mimeType?: string  
}  
`
```

---

## disconnect
Stops all requests when subscribed.

### Signature
```
`disconnect()  
`
```

### Example
```
`  
`
```

---

## reconnect
Attempts reconnection.

### Signature
```
`reconnect()  
`
```

### Example
```
`  
`
```

---

## setProxy (Node.js)
Assign or update proxy at runtime.

### Signature
```
`setProxy({String hostname, Number port, String protocol})  
`
```

Parameters  
• `hostname` (String) – IP/URI  
• `port` (Number) – proxy port  
• `protocol` (String, default `http`) – `http`, `https`, `socks5`, `socks4`, `pac`

### Example
```
`  
`
```

#### Delete proxy at runtime
```
`**`
```

---

_Last updated: Jun 30, 2025_