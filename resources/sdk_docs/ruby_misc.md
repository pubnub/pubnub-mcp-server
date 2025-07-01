# Utility Methods – Ruby SDK (Misc)

## Time

Returns a 17-digit Unix epoch (“timetoken”).

##### Algorithm

```
`timetoken = (Unix epoch time in seconds) * 10000000  
`
```

##### Convert between Time and timetoken

```
`now = Time.now  
2012-11-02 14:27:11 -0700  
  
timetoken = now.to_f * 10000000  
13518916319742640  
  
Time.at(timetoken / 10000000)  
2012-11-02 14:27:11 -0700  
`
```

### Ruby API

```
`time(  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

Parameters  
• **http_sync** (Boolean, default `false`)  
  – `false`: asynchronous, returns a future; call `.value` to obtain the `Envelope`.  
  – `true` : synchronous, returns an `Envelope` (inside an array if multiple results).  

• **callback** (Lambda)  
  – Executed for each `Envelope` in async mode. Not used when `http_sync: true`.

### Example

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
(show all 26 lines)

### Server Response

```
`13769501243685161**`
```

_Last updated: Mar 31 2025_