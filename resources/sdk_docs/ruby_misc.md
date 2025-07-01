On this page
# Utility Methods API for Ruby SDK

The methods on this page are utility methods that don't fit into other categories.

## Time[​](#time)

This function will return a 17 digit precision Unix epoch.

##### Algorithm constructing the timetoken

```
`timetoken = (Unix epoch time in seconds) * 10000000  
`
```

Convert back and forth between current time and a timetoken:

```
`now = Time.now  
2012-11-02 14:27:11 -0700  
  
timetoken = now.to_f * 10000000  
13518916319742640  
  
Time.at(timetoken / 10000000)  
2012-11-02 14:27:11 -0700  
`
```

### Method(s)[​](#methods)

To fetch `Time` you can use the following method(s) in Ruby SDK:

```
`time(  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`http_sync`Type: BooleanDefault `false`. Method will be executed `asynchronously` and will return future, to get it's `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`).   
For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameter`Callback` that will be called for each `envelope`.   
For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

### Basic Usage[​](#basic-usage)

#### Get PubNub Timetoken[​](#get-pubnub-timetoken)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`require 'pubnub'  
  
def get_pubnub_timetoken(pubnub)  
  pubnub.time do |envelope|  
    if envelope.status[:error]  
      puts "Error fetching timetoken: #{envelope.status[:error]}"  
    else  
      puts "PubNub Timetoken: #{envelope.result[:data][:timetoken]}"  
    end  
  end  
end  
  
def main  
  # Configuration for PubNub instance  
  pubnub = Pubnub.new(  
`
```
show all 26 lines

### Rest Response from Server[​](#rest-response-from-server)

The `time()` function returns a string timetoken in the following format:

```
`13769501243685161**`
```
Last updated on Mar 31, 2025**