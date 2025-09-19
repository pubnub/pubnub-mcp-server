# Utility Methods API for Java SDK

##### Breaking changes in v9.0.0

PubNub Java SDK version 9.0.0 introduces a new way of instantiating the PubNub client, and changes asynchronous API callbacks and emitted status events. These changes can impact applications built with previous versions (< `9.0.0`) of the Java SDK.

## Create push payload

This method creates the push payload for use in the appropriate endpoint calls.

### Method(s)

```java
PushPayloadHelper helper = new PushPayloadHelper();  
helper.setApnsPayload(PushPayloadHelper.APNSPayload());  
helper.setFcmPayloadV2(PushPayloadHelper.FCMPayloadV2());  
helper.setCommonPayload(HashMap<String, Object>());  
  
Map<String, Object> payload = helper.build();  
```

### Response

The `PushPayloadHelper#build()` operation returns a `Map<String, Object>` which can be passed directly as the `message()` parameter to the `pubnub.publish()` method.

## Destroy

Destroy frees up the threads and allows for clean exit.

### Method(s)

```java
destroy()  
```

### Returns

None

## Encrypt

This function allows to `encrypt` the data.

### Method(s)

```java
pubnub.encrypt(data, customCipherKey)  
```

## Encrypt file input stream

Encrypts input stream with a cipher key.

### Method(s)

```java
pubnub.encryptInputStream(inputStream, cipherKey)  
```

### Returns

InputStream with encrypted data.

## Decrypt

This function allows to `decrypt` the data.

### Method(s)

```java
pubnub.decrypt(data, customCipherKey)  
```

## Decrypt file input stream

Decrypts input stream with a cipher key.

### Method(s)

```java
pubnub.decryptInputStream(inputStream, cipherKey)  
```

### Returns

InputStream with decrypted data.

## Get subscribed channel groups

Returns all the subscribed channel groups in a `List of type String`.

### Method(s)

```java
public final List<String> getSubscribedChannelGroups()  
```

### Response

`List<String>`

## Get subscribed channels

Returns all the subscribed channels in a `List of type String`.

### Method(s)

```java
public final List<String> getSubscribedChannels()  
```

### Response

`List<String>`

## Disconnect

Call the `disconnect` method to force the SDK to stop all requests to PubNub server when there are active subscribe channels.

### Method(s)

```java
disconnect()  
```

## Reconnect

Call the `reconnect` method to force the SDK to try and reach out PubNub.

### Method(s)

```java
reconnect()  
```

## Timetoken to date

The `timetokenToInstant()` method of the `TimetokenUtil` class converts a PubNub timetoken to an `Instant` object representing the corresponding date and time.

### Method signature

```java
Instant TimetokenUtil.timetokenToInstant(long timetoken)  
```

## Date to timetoken

The `instantToTimetoken()` method of the `TimetokenUtil` class converts the `Instant` object representing the corresponding date and time into a PubNub timetoken.

### Method signature

```java
long TimetokenUtil.instantToTimetoken(Instant instant)  
```

## Unix timestamp to timetoken

The `unixToTimetoken()` method of the `TimetokenUtil` class converts a Unix timestamp to a PubNub timetoken.

### Method signature

```java
long TimetokenUtil.unixToTimetoken(long unixTime)  
```

## Timetoken to Unix timestamp

The `timetokenToUnix()` method of the `TimetokenUtil` class converts a PubNub timetoken to a Unix timestamp.

### Method signature

```java
long TimetokenUtil.timetokenToUnix(long timetoken)  
```
