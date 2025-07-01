On this page
# Utility Methods API for Swift Native SDK

The methods on this page are utility methods that don't fit into other categories.

## Encrypt[​](#encrypt)

This function allows to `encrypt` the data.

##### Availability

For more information, refer to [Crypto module configuration](/docs/sdks/swift/api-reference/configuration#cryptomodule).

### Method(s)[​](#methods)

To `encrypt` the data you can use the following method(s) in Swift SDK.

```
`func encrypt(data: Data)  
`
```

*  requiredParameterDescription`data` *Type: DataThe `message` to encrypt.

### Basic Usage[​](#basic-usage)

#### Encrypt part of message[​](#encrypt-part-of-message)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

### Returns[​](#returns)

#### Success[​](#success)

Encrypted `Data` received from the Foundation object.

#### Failure[​](#failure)

An `Error` describing the failure.

## Decrypt[​](#decrypt)

This function allows to `decrypt` the data.

##### Availability

For more information, refer to [Crypto module configuration](/docs/sdks/swift/api-reference/configuration#cryptomodule).

### Method(s)[​](#methods-1)

To `decrypt` the data you can use the following method(s) in Swift SDK.

```
`func decrypt(data: Data) -> ResultData, Error>  
`
```

*  requiredParameterDescription`data` *Type: DataThe `data` to decrypt.

### Basic Usage[​](#basic-usage-1)

#### Decrypt part of message[​](#decrypt-part-of-message)

```
`  
`
```

### Returns[​](#returns-1)

#### Success[​](#success-1)

Initial `Data` which has been encrypted earlier.

#### Failure[​](#failure-1)

An `Error` describing the failure.

## Disconnect[​](#disconnect)

Call the `disconnect` method to stops the subscriptions in progress.

### Methods[​](#methods-2)

To `disconnect` the data you can use the following methods in Swift SDK.

```
`func disconnect( )  
`
```

### Basic Usage[​](#basic-usage-2)

```
`  
`
```

## Reconnect[​](#reconnect)

Call the `reconnect` method to force the SDK to try and reach out PubNub.

### Method(s)[​](#methods-3)

To `reconnect` the data you can use the following method(s) in Swift SDK.

```
`func reconnect(at timetoken: Timetoken? = nil)  
`
```

*  requiredParameterDescriptionat *Type: TimetokenDefault:  
n/aThe timetoken to `reconnect` the subscribe at.

### Basic Usage[​](#basic-usage-3)

```
`  
`
```

## Time[​](#time)

This function will return a 17 digit precision Unix epoch.

##### Algorithm constructing the timetoken

```
`timetoken = (Unix epoch time in seconds) * 1_000_000_000  
`
```

Example of creating a timetoken for a specific time and date:

```
`// 08/19/2013 @ 9:20pm in UTC = 1376961606  
timetoken = 1376961606 * 1_000_000_000  
timetoken = 1376961606000000000  
`
```

### Method(s)[​](#methods-4)

To fetch `Time` you can use the following method(s) in Swift SDK:

```
`func time(  
  custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
  completion: ((ResultTimetoken, Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`custom`Type: `PubNub.RequestConfiguration`Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub Configuration or Network Session.`completion`Type: `((Result<Timetoken, Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result)

##### Success[​](#success-2)

The current `Timetoken`.

##### Failure[​](#failure-2)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage-4)

#### Get PubNub Timetoken[​](#get-pubnub-timetoken)

```
`**`
```
Last updated on Jun 12, 2025**