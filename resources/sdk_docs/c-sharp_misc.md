On this page
# Utility Methods API for C# SDK

The methods on this page are utility methods that don't fit into other categories.

##### Request execution

We recommend using `try` and `catch` statements when working with the C# SDK.

If there's an issue with the provided API parameter values, like missing a required parameter, the SDK throws an exception. However, if there is a server-side API execution issue or a network problem, the error details are contained within the `status`.

```
`try  
{  
    PNResultPNPublishResult> publishResponse = await pubnub.Publish()  
        .Message("Why do Java developers wear glasses? Because they can't C#.")  
        .Channel("my_channel")  
        .ExecuteAsync();  
  
    PNStatus status = publishResponse.Status;  
  
    Console.WriteLine("Server status code : " + status.StatusCode.ToString());  
}  
catch (Exception ex)  
{  
    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
}  
`
```

## Destroy[​](#destroy)

Destroy frees up the threads and allows for clean exit.

### Method(s)[​](#methods)

```
`destroy()  
`
```

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

### Returns[​](#returns)

None

## Encrypt[​](#encrypt)

This function allows to `encrypt` the data.

##### Deprecated

The `cipherKey` parameter in this method is deprecated. We recommend that you configure a separate instance of the [crypto module](/docs/sdks/c-sharp/api-reference/configuration#cryptomodule) and use it for partial encryption.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Method(s)[​](#methods-1)

To `encrypt` the data you can use the following method(s) in C# SDK.

```
`pubnub.Encrypt(inputString, cipherKey)  
`
```

*  requiredParameterDescription`inputString` *Type: StringThe `data` to `encrypt`.`cipherKey`Type: StringCipher key to use for encryption.

### Basic Usage[​](#basic-usage-1)

#### Encrypt part of message[​](#encrypt-part-of-message)

```
`  
`
```

## Encrypt File[​](#encrypt-file)

This function allow to `encrypt` the file content/data.

##### Deprecated

The `cipherKey` parameter in this method is deprecated. We recommend that you configure a separate instance of the [crypto module](/docs/sdks/c-sharp/api-reference/configuration#cryptomodule) and use it for partial encryption.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Method(s)[​](#methods-2)

To `encrypt` the file you can use the following method(s) in C# SDK.

```
`pubnub.EncryptFile(sourceFile, destinationFile)   
pubnub.EncryptFile(sourceFile, destinationFile, cipherKey)  
`
```

*  requiredParameterDescription`sourceFile` *Type: StringFile to be encrypted.`destinationFile` *Type: StringPath of the encrypted file to be saved.`cipherKey`Type: StringCipher Key to use for encryption. If provided, the legacy encryption with 128-bit cipher key entropy is used. If not provided, the `CryptoModule` from PubNub config will be used.   
   
 For more information, refer to [Crypto module configuration](/docs/sdks/c-sharp/api-reference/configuration#cryptomodule).   
   
 This parameter is deprecated and will be removed in a future version. Please use the `CryptoModule` from PubNub config instead.

```
`byte[] outputBytes = pubnub.EncryptFile(sourceBytes) byte[] outputBytes = pubnub.EncryptFile(sourceBytes, cipherKey)  
`
```

*  requiredParameterDescription`sourceBytes` *Type: byte[]byte array of the file.`cipherKey`Type: StringCipher Key to use for encryption. If provided, the legacy encryption with 128-bit cipher key entropy is used. If not provided, the `CryptoModule` from PubNub config will be used.   
   
 For more information, refer to [Crypto module configuration](/docs/sdks/c-sharp/api-reference/configuration#cryptomodule).

### Basic Usage[​](#basic-usage-2)

```
`  
`
```

## Decrypt[​](#decrypt)

This function allows to `decrypt` the data.

##### Deprecated

The `cipherKey` parameter in this method is deprecated. We recommend that you configure a separate instance of the [crypto module](/docs/sdks/c-sharp/api-reference/configuration#cryptomodule) and use it for partial encryption.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Method(s)[​](#methods-3)

To `decrypt` the data you can use the following method(s) in C# SDK.

```
`pubnub.Decrypt(inputString, cipherKey)  
`
```

*  requiredParameterDescription`inputString` *Type: StringThe `data` to `decrypt`.`cipherKey`Type: StringCipher key to use for encryption.   
   
 This parameter is deprecated and will be removed in a future version. Please use the `CryptoModule` from PubNub config instead.

### Basic Usage[​](#basic-usage-3)

#### Decrypt part of message[​](#decrypt-part-of-message)

```
`  
`
```

## Decrypt File[​](#decrypt-file)

This function allow to `decrypt` the file content/data.

### Method(s)[​](#methods-4)

To `decrypt` the file you can use the following method(s) in C# SDK.

```
`pubnub.DecryptFile(sourceFile, destinationFile); pubnub.DecryptFile(sourceFile, destinationFile, cipherKey);  
`
```

*  requiredParameterDescription`sourceFile` *Type: StringFile to be decrypted.`destinationFile` *Type: StringPath of the decrypted file to be saved.`cipherKey`Type: StringCipher Key to use for decryption. If provided, the legacy encryption with 128-bit cipher key entropy is used. If not provided, the `CryptoModule` from PubNub config will be used.   
   
 For more information, refer to [Crypto module configuration](/docs/sdks/c-sharp/api-reference/configuration#cryptomodule).

```
`byte[] outputBytes = pubnub.DecryptFile(sourceBytes) byte[] outputBytes = pubnub.DecryptFile(sourceBytes, cipherKey)  
`
```

*  requiredParameterDescription`sourceBytes` *Type: byte[]byte array of the file.`cipherKey`Type: StringCipher Key to use for decryption. If provided, the legacy encryption with 128-bit cipher key entropy is used. If not provided, the `CryptoModule` from PubNub config will be used.   
   
 For more information, refer to [Crypto module configuration](/docs/sdks/c-sharp/api-reference/configuration#cryptomodule).

### Basic Usage[​](#basic-usage-4)

```
`  
`
```

## Disconnect[​](#disconnect)

Call the `Disconnect` method to force the SDK to stop all requests to PubNub server when there are active subscribe channels.

### Method(s)[​](#methods-5)

To `disconnect` the data transmission you can use the following method(s) in C# SDK.

```
`DisconnectT>()  
`
```

This method doesn't take any arguments.

### Basic Usage[​](#basic-usage-5)

```
`  
`
```

## Get Subscribed Channel Groups[​](#get-subscribed-channel-groups)

Returns all the subscribed channel groups in a `List of type String`.

### Method(s)[​](#methods-6)

To `Get Subscribe Channel Groups` you can use the following method(s) in the C# SDK:

```
`Liststring> GetSubscribedChannelGroups()  
`
```

### Basic Usage[​](#basic-usage-6)

#### Get Subscribed Channel Groups[​](#get-subscribed-channel-groups-1)

```
`  
`
```

### Response[​](#response)

`List<String>`

```
`["channelGroup1", "channelGroup2"]  
`
```

## Get Subscribed Channels[​](#get-subscribed-channels)

Returns all the subscribed channels in a `List of type String`.

### Method(s)[​](#methods-7)

To `Get Subscribed Channels` you can use the following method(s) in the C# SDK:

```
`Liststring> GetSubscribedChannels()  
`
```

### Basic Usage[​](#basic-usage-7)

#### Get Subscribed Channels[​](#get-subscribed-channels-1)

```
`  
`
```

### Response[​](#response-1)

`List<String>`

```
`["channel1", "channel2"]  
`
```

## Reconnect[​](#reconnect)

Call the `reconnect` method to force the SDK to try and reach out PubNub.

### Method(s)[​](#methods-8)

To `reconnect` the data you can use the following method(s) in C# SDK.

```
`ReconnectT>(bool resetSubscribeToken)  
`
```

*  requiredParameterDescription`resetSubscribeToken`Type: boolPassing `true` will send zero timetoken upon reconnect.

### Basic Usage[​](#basic-usage-8)

```
`**`
```
Last updated on Jun 30, 2025**