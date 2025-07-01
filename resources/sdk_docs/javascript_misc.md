On this page
# Utility Methods API for JavaScript SDK

The methods on this page are utility methods that don't fit into other categories.

## Encrypt[​](#encrypt)

This function allows to `encrypt` the data.

##### Deprecated parameter

The `cipherKey` parameter in this method is deprecated. We recommend that you configure a separate instance of the [crypto module](/docs/sdks/javascript/api-reference/configuration#cryptomodule) and use it for partial encryption.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Method(s)[​](#methods)

To `encrypt` the data, you can use the following method(s) in JavaScript SDK.

```
`encrypt(  
    data: string,  
    customCipherKey?: string  
)  
`
```

*  requiredParameterDescription`data` *Type: string or bytesThe `data` to `encrypt`.`customCipherKey`Type: stringIf provided, the legacy encryption with 128-bit cipher key entropy is used.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Encrypt part of message[​](#encrypt-part-of-message)

```
`  
`
```

```
`  
`
```

### Returns[​](#returns)

It returns the encrypted `data` as string.

## Encrypt File[​](#encrypt-file)

This function allow to `encrypt` the file content/data.

##### Deprecated

The `key` parameter in this method is deprecated. We recommend that you configure a separate instance of the [crypto module](/docs/sdks/javascript/api-reference/configuration#cryptomodule) and use it for partial encryption.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Method(s)[​](#methods-1)

To `encrypt` the file, you can use the following method(s) in JavaScript SDK.

```
`pubnub.encryptFile(  
    key: string,  
    file: PubNubFile  
): PromisePubNubFile>;  
`
```

*  requiredParameterDescription`key`Type: stringCipher key used for encryption.`file` *Type: PubNubFileFile to encrypt.

### Basic Usage[​](#basic-usage-1)

```
`  
`
```

### Returns[​](#returns-1)

Returns a promise of [PubNubFile](#pubnubfile)

## Decrypt[​](#decrypt)

This function allows to `decrypt` the data.

##### Deprecated parameter

The `cipherKey` parameter in this method is deprecated. We recommend that you configure the [crypto module](/docs/sdks/javascript/api-reference/configuration#cryptomodule) on your PubNub instance instead.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Method(s)[​](#methods-2)

To `decrypt` the data, you can use the following method(s) in JavaScript SDK.

```
`decrypt(  
    data: string,  
    customCipherKey?: string  
`
```

*  requiredParameterDescription`data` *Type: stringThe `data` to `decrypt`.`customCipherKey`Type: stringIf provided, the legacy encryption with 128-bit cipher key entropy is used. If not provided, the `cryptoModule` from PubNub config will be used.   
   
 For more information, refer to [Crypto module configuration](/docs/sdks/javascript/api-reference/configuration#cryptomodule).

### Basic Usage[​](#basic-usage-2)

```
`  
`
```

### Returns[​](#returns-2)

It returns the decrypted `data` as an object.

### Error Responses[​](#error-responses)

If the `decrypt()` method fails, a verbose error with a reason for failure is thrown.

## Decrypt File[​](#decrypt-file)

This function allow to `decrypt` the file content/data.

##### Deprecated

This method uses the legacy encryption with 128-bit cipher key entropy. For more information, refer to [Crypto module configuration](/docs/sdks/javascript/api-reference/configuration#cryptomodule).

### Method(s)[​](#methods-3)

To `decrypt` the file, you can use the following method(s) in JavaScript SDK.

```
`pubnub.decryptFile(  
    key: string,  
    file: PubNubFile  
): PromisePubNubFile>;  
`
```

*  requiredParameterDescription`key` *Type: StringCipher key used for decryption.`file` *Type: PubNubFileFile to decrypt.

### Basic Usage[​](#basic-usage-3)

```
`  
`
```

### Returns[​](#returns-3)

Returns a promise of [PubNubFile](#pubnubfile).

## PubNubFile[​](#pubnubfile)

Internal representation of the file used by the SDK. Depending on the environment, different methods can be used to extract the file.

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
`pubnub.File.create(input: FileInput): PubNubFile;  
`
```

`FileInput` represents a variety of possible inputs that represent a file in different environments.

#### Node.js[​](#nodejs)

**Using streams:**

```
`{  
    stream: Readable,  
    name: string,  
    mimeType?: string  
}  
`
```

**Using buffers:**

```
`{  
    data: Buffer,  
    name: string,  
    mimeType?: string  
}  
`
```

**Using strings:**

```
`{  
    data: string,  
    encoding: string,  
    name: string,  
    mimeType?: string  
}  
`
```

#### Browsers[​](#browsers)

**Using [File API](https://developer.mozilla.org/en-US/docs/Web/API/File):**

```
`File  
`
```

**Using strings:**

```
`{  
    data: string,  
    name: string,  
    mimeType?: string  
}  
`
```

**Using ArrayBuffer:**

```
`{  
    data: ArrayBuffer,  
    name: string,  
    mimeType?: string  
}  
`
```

## Disconnect[​](#disconnect)

Call the `disconnect` method to force the SDK to stop all requests to PubNub server when there are active subscribe channels.

### Method(s)[​](#methods-4)

To `disconnect` the data transmission you can use the following method(s) in JavaScript SDK.

```
`disconnect()  
`
```

This method doesn't take any arguments.

### Basic Usage[​](#basic-usage-4)

```
`  
`
```

## Reconnect[​](#reconnect)

Call the `reconnect` method to force the SDK to try and reach out PubNub.

### Method(s)[​](#methods-5)

To `reconnect` the data, you can use the following method(s) in JavaScript SDK.

```
`reconnect()  
`
```

This method doesn't take any arguments.

### Basic Usage[​](#basic-usage-5)

```
`  
`
```

## setProxy[​](#setproxy)

Call `setProxy()` to instruct the SDK to assign or reassign a proxy configuration in run time. This method is only available for NodeJS.

### Method(s)[​](#methods-6)

To `setProxy` the data you can use the following method(s) in Node.js SDK.

```
`setProxy({String hostname, Number port, String protocol})  
`
```

*  requiredParameterDescription`hostname` *Type: StringDefault:  
n/aSpecifies the `IP address` the or URI to use.`port` *Type: NumberDefault:  
n/aSpecifies the `port` which the proxy will be listened.`protocol`Type: StringDefault:  
httpSupported Protocols are `http`, `https`, `socks5`, `socks4` and `pac`.

### Basic Usage[​](#basic-usage-6)

```
`  
`
```

### Other Examples[​](#other-examples)

#### Delete the proxy in run time[​](#delete-the-proxy-in-run-time)

```
`**`
```
Last updated on Jun 30, 2025**