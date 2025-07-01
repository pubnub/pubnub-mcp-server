# Utility Methods – PubNub C# SDK (Misc)

Concise reference to helper APIs.  
All code blocks, signatures, and parameters are unchanged; non-essential prose removed.

---

## Request Execution

Use `try / catch`. API/validation errors throw; server or network errors are in `PNStatus`.

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

---

## Destroy

Frees SDK threads for a clean exit.

### Method

```
`destroy()  
`
```

Return: void

### Example

```
`  
`
```

---

## Encrypt (Data)

Deprecated `cipherKey`; prefer `CryptoModule`.

### Method

```
`pubnub.Encrypt(inputString, cipherKey)  
`
```

Parameters  
• `inputString` (String) – data to encrypt  
• `cipherKey` (String, deprecated) – overrides `CryptoModule`

### Example

```
`  
`
```

---

## Encrypt File

Deprecated `cipherKey`; prefer `CryptoModule`.

### Methods

```
`pubnub.EncryptFile(sourceFile, destinationFile)   
pubnub.EncryptFile(sourceFile, destinationFile, cipherKey)  
`
```

Parameters  
• `sourceFile` (String) – file to encrypt  
• `destinationFile` (String) – output path  
• `cipherKey` (String, deprecated)

```
`byte[] outputBytes = pubnub.EncryptFile(sourceBytes) byte[] outputBytes = pubnub.EncryptFile(sourceBytes, cipherKey)  
`
```

### Example

```
`  
`
```

---

## Decrypt (Data)

Deprecated `cipherKey`; prefer `CryptoModule`.

### Method

```
`pubnub.Decrypt(inputString, cipherKey)  
`
```

Parameters  
• `inputString` (String) – data to decrypt  
• `cipherKey` (String, deprecated)

### Example

```
`  
`
```

---

## Decrypt File

### Methods

```
`pubnub.DecryptFile(sourceFile, destinationFile); pubnub.DecryptFile(sourceFile, destinationFile, cipherKey);  
`
```

Parameters  
• `sourceFile` (String) – file to decrypt  
• `destinationFile` (String) – output path  
• `cipherKey` (String, optional / deprecated)

```
`byte[] outputBytes = pubnub.DecryptFile(sourceBytes) byte[] outputBytes = pubnub.DecryptFile(sourceBytes, cipherKey)  
`
```

### Example

```
`  
`
```

---

## Disconnect

Stops all active requests (including subscribe loops).

### Method

```
`DisconnectT>()  
`
```

### Example

```
`  
`
```

---

## Get Subscribed Channel Groups

Returns `List<string>`.

### Method

```
`Liststring> GetSubscribedChannelGroups()  
`
```

### Example

```
`  
`
```

#### Response

```
`["channelGroup1", "channelGroup2"]  
`
```

---

## Get Subscribed Channels

Returns `List<string>`.

### Method

```
`Liststring> GetSubscribedChannels()  
`
```

### Example

```
`  
`
```

#### Response

```
`["channel1", "channel2"]  
`
```

---

## Reconnect

Force reconnection to PubNub.

### Method

```
`ReconnectT>(bool resetSubscribeToken)  
`
```

Parameter  
• `resetSubscribeToken` (bool) – `true` sends 0 timetoken on reconnect.

### Example

```
`**`
```

_Last updated: Jun 30 2025_