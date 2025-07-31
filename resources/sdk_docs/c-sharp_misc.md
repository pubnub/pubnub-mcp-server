# Utility Methods – PubNub C# SDK (Misc)

The following summarizes the miscellaneous utility APIs. All code blocks, method signatures, parameters, and critical notes are preserved.

---

## Request execution

Use `try / catch`. SDK throws exceptions for invalid input; network/server errors are returned in `status`.

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

## destroy()

Free resources and exit cleanly.

```
`destroy()  
`
```

Returns: none.

```
`  
`
```

---

## Encrypt (string)

Encrypt a string.

```
`pubnub.Encrypt(inputString, cipherKey)  
`
```

Parameters  
• `inputString` (string) – data to encrypt.  
• `cipherKey` (string, deprecated) – overrides `CryptoModule`; uses legacy 128-bit encryption.

```
`  
`
```

---

## Encrypt file

Encrypt file contents.

```
`pubnub.EncryptFile(sourceFile, destinationFile)   
pubnub.EncryptFile(sourceFile, destinationFile, cipherKey)  
`
```

```
`byte[] outputBytes = pubnub.EncryptFile(sourceBytes) byte[] outputBytes = pubnub.EncryptFile(sourceBytes, cipherKey)  
`
```

Parameters  
• `sourceFile` (string) – file to encrypt.  
• `destinationFile` (string) – output path.  
• `sourceBytes` (byte[]) – file bytes.  
• `cipherKey` (string, deprecated) – custom key; triggers legacy 128-bit encryption.

```
`  
`
```

---

## Decrypt (string)

Decrypt a string.

```
`pubnub.Decrypt(inputString, cipherKey)  
`
```

Parameters mirror `Encrypt`.

```
`  
`
```

---

## Decrypt file

```
`pubnub.DecryptFile(sourceFile, destinationFile); pubnub.DecryptFile(sourceFile, destinationFile, cipherKey);  
`
```

```
`byte[] outputBytes = pubnub.DecryptFile(sourceBytes) byte[] outputBytes = pubnub.DecryptFile(sourceBytes, cipherKey)  
`
```

Parameters mirror `Encrypt file`.

```
`  
`
```

---

## Disconnect

Force-stop all requests when subscribed channels are active.

```
`DisconnectT>()  
`
```

```
`  
`
```

---

## Get subscribed channel groups

```
`Liststring> GetSubscribedChannelGroups()  
`
```

```
`["channelGroup1", "channelGroup2"]  
`
```

---

## Get subscribed channels

```
`Liststring> GetSubscribedChannels()  
`
```

```
`["channel1", "channel2"]  
`
```

---

## Reconnect

```
`ReconnectT>(bool resetSubscribeToken)  
`
```

• `resetSubscribeToken` (bool) – `true` sends zero timetoken.

```
`**`
```

_Last updated: Jul 15 2025_