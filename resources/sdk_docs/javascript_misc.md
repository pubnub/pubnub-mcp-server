# Utility Methods API — JavaScript SDK (Misc)

Concise reference of utility calls. All original code blocks and technical details are preserved.

---

## Encrypt
• `cipherKey` is deprecated; prefer configuring a `cryptoModule`. Passing a key here forces legacy 128-bit encryption.

### Method
```
`encrypt(  
    data: string,  
    customCipherKey?: string  
)  
`
```
Parameters  
• `data` (string | bytes, required) – content to encrypt  
• `customCipherKey` (string, optional) – overrides `cryptoModule`, uses legacy 128-bit

Returns: encrypted data (string).

#### Sample
```
`  
`
```
```
`  
`
```

---

## Encrypt file
• `key` is deprecated; use `cryptoModule`.

### Method
```
`pubnub.encryptFile(  
    key: string,  
    file: PubNubFile  
): PromisePubNubFile>;  
`
```
Parameters  
• `key` (string, required) – cipher key  
• `file` (PubNubFile, required) – file to encrypt

Returns: `Promise<PubNubFile>`.

#### Sample
```
`  
`
```

---

## Decrypt
• `cipherKey` deprecated; falls back to `cryptoModule`.

### Method
```
`decrypt(  
    data: string,  
    customCipherKey?: string  
`
```
Parameters  
• `data` (string, required) – data to decrypt  
• `customCipherKey` (string, optional) – overrides `cryptoModule`, legacy 128-bit

Returns: decrypted data (object). Throws verbose error on failure.

#### Sample
```
`  
`
```

---

## Decrypt file
Uses legacy 128-bit encryption.

### Method
```
`pubnub.decryptFile(  
    key: string,  
    file: PubNubFile  
): PromisePubNubFile>;  
`
```
Parameters  
• `key` (string, required) – cipher key  
• `file` (PubNubFile, required) – file to decrypt

Returns: `Promise<PubNubFile>`.

#### Sample
```
`  
`
```

---

## PubNubFile

### Extracting
Node.js  
• `file.toBuffer(): Promise<Buffer>`  
• `file.toStream(): Promise<Readable>`  
• `file.toString(encoding)`

Browser  
• `file.toFile(): Promise<File>`  
• `file.toBlob(): Promise<Blob>`  
• `file.toArrayBuffer(): Promise<ArrayBuffer>`  
• `file.toString(encoding)`

React / React-Native  
• `file.toBlob(): Promise<Blob>`

### Creating
```
`pubnub.File.create(input: FileInput): PubNubFile;  
`
```
Node.js inputs  
```
`{  
    stream: Readable,  
    name: string,  
    mimeType?: string  
}  
`
```
```
`{  
    data: Buffer,  
    name: string,  
    mimeType?: string  
}  
`
```
```
`{  
    data: string,  
    encoding: string,  
    name: string,  
    mimeType?: string  
}  
`
```
Browser inputs  
```
`File  
`
```
```
`{  
    data: string,  
    name: string,  
    mimeType?: string  
}  
`
```
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
Stops all PubNub requests when subscribed.

### Method
```
`disconnect()  
`
```
#### Sample
```
`  
`
```

---

## reconnect
Attempts to re-establish PubNub connectivity.

### Method
```
`reconnect()  
`
```
#### Sample
```
`  
`
```

---

## setProxy (Node.js only)
Assign or change proxy settings at runtime.

### Method
```
`setProxy({String hostname, Number port, String protocol})  
`
```
Parameters  
• `hostname` (string) – proxy IP/URI  
• `port` (number) – proxy port  
• `protocol` (string, default `http`) – `http`, `https`, `socks5`, `socks4`, `pac`

#### Sample
```
`  
`
```

Delete proxy at runtime
```
`**`
```

_Last updated: Jul 15 2025_