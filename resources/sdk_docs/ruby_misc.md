# Utility Methods API – Ruby SDK (Misc)

## Time

Returns a 17-digit timetoken (Unix epoch [s] × 10 000 000).

##### Algorithm constructing the timetoken
```
`timetoken = (Unix epoch time in seconds) * 10000000  
`
```

##### Convert between `Time` and timetoken
```
`now = Time.now  
2012-11-02 14:27:11 -0700  
  
timetoken = now.to_f * 10000000  
13518916319742640  
  
Time.at(timetoken / 10000000)  
2012-11-02 14:27:11 -0700  
`
```

### Method
```
`time(  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

Parameter details  
• `http_sync` (Boolean, default `false`) – `true` ➜ synchronous, returns an `Envelope` (or an array of them); `false` ➜ asynchronous, returns a future (`value` blocks until available).  
• `callback` (Proc/Lambda) – executed once per `Envelope`.

### Sample code
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

### REST response example
```
`13769501243685161**`
```

_Last updated: Jul 15 2025_