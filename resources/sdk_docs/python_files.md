# PubNub Python SDK – File APIs (condensed)

Supports files ≤ 5 MB.  
File uploads are stored for your key; all channel subscribers receive a file event (ID, filename, optional description).

---

## Synchronous vs. Asynchronous execution

`.sync()` → `Envelope` with  
• `Envelope.result` (API-specific)  
• `Envelope.status` (`PNStatus`)

```
`pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .sync()  
`
```

`.pn_async(cb)` → `None`, results delivered to callback.

```
`def my_callback_function(result, status):  
    print(f'TT: {result.timetoken}, status: {status.category.name}')  
  
pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .pn_async(my_callback_function)  
`
```

---

## send_file

Uploads the file and automatically publishes the file message.

```
`pubnub.send_file() \  
    .channel(String) \  
    .file_name(String) \  
    .message(Dictionary) \  
    .should_store(Boolean) \  
    .ttl(Integer) \  
    .file_object(Python Object File or bytes) \  
    .meta(Dictionary) \  
    .custom_message_type(String)  
`
```

Parameters (required ★):

• ★ `channel` String – target channel  
• ★ `file_name` String – stored name  
• ★ `file_object` bytes | file object – content  
• `message` Dict – payload sent with file  
• `should_store` Bool (default True) – store message in history  
• `ttl` Int – message TTL  
• `meta` Dict – filterable metadata  
• `custom_message_type` String – 3-50 chars, a–z, 0–9, `_` or `-`  

Deprecated: `cipher_key` (use Crypto Module).

### Usage

Builder style

```
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
from pubnub.exceptions import PubNubException  
  
def send_file(pubnub: PubNub, file_path: str, channel: str):  
    try:  
        with open(file_path, 'rb') as sample_file:  
            response = pubnub.send_file() \  
                .channel(channel) \  
                .file_name("sample.gif") \  
                .message({"test_message": "test"}) \  
                .file_object(sample_file) \  
                .sync()  
`
```

Named-argument style

```
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
from pubnub.exceptions import PubNubException  
  
def send_file(pubnub: PubNub, file_path: str, channel: str):  
    try:  
        with open(file_path, 'rb') as sample_file:  
            response = pubnub.send_file(  
                channel=channel,  
                file_name="sample.gif",  
                file_object=sample_file,  
                message="Hey, it's gif not jif",  
                custom_message_type="file-message"  
`
```

Return `Envelope.result` → `PNSendFileResult`

| Property | Type   | Description                          |
|----------|--------|--------------------------------------|
| `name`   | String | Uploaded file name                   |
| `file_id`| String | Uploaded file ID                     |
| `timestamp` | String | Publish timetoken                 |

---

## list_files

```
`pubnub.list_files() \  
    .channel(String)  
`
```

Parameters:  
• ★ `channel` String  
• `limit` Int – items per page  
• `next` String – forward-pagination cursor

```
`  
`
```

```
`file_list_response = pubnub.list_files(channel="ch1", limit=10, next="xyz...abc").sync()  
print(f"Found {len(file_list_response.result.data)} files:")  
  
for file_data in file_list_response.result.data:  
    print(f"  {file_data['name']} with id: {file_data['id']}")  
`
```

`Envelope.result` → `PNGetFilesResult`

| Property | Type | Description |
|----------|------|-------------|
| `next`   | String | Cursor for next page |
| `count`  | Int    | Number of files returned |
| `data`   | List   | List of files: each has `id`, `name`, `size`, `created` |

---

## get_file_url

```
`pubnub.get_file_url() \  
    .channel(String) \  
    .file_id(String) \  
    .file_name(String)  
`
```

Parameters: ★ `channel`, ★ `file_id`, ★ `file_name`

```
`  
`
```

```
`download_url = pubnub.get_file_url(channel="ch1",  
                                   file_id=file_data['id'],  
                                   file_data['name']) \  
    .sync()  
  
print(f'  Download url: {download_url.result.file_url}')  
`
```

`Envelope.result` → `PNGetFileDownloadURLResult` (`file_url` String)

---

## download_file

```
`pubnub.download_file() \  
    .channel(String) \  
    .file_id(String) \  
    .file_name(String)  
`
```

Parameters: ★ `channel`, ★ `file_id`, ★ `file_name`  
Deprecated: `cipher_key`

```
`  
`
```

```
`download_url = pubnub.download_file(channel="ch1",  
                                    file_id=file_data['id'],  
                                    file_data['name']) \  
    .sync()  
  
fw = open(f"{os.getcwd()}/{file_data['name']}", 'wb')  
fw.write(download_file.result.data)  
  
print(f"File saved as {os.getcwd()}/{file_data['name']}")  
  
`
```

`Envelope.result` → `PNDownloadFileResult` (`data` bytes)

---

## delete_file

```
`pubnub.delete_file() \  
    .channel(String) \  
    .file_id(String) \  
    .file_name(String)  
`
```

Parameters: ★ `channel`, ★ `file_id`, ★ `file_name`

```
`  
`
```

```
`pubnub.delete_file(channel="ch1",  
                   file_id=file_data['id'],  
                   file_data['name']) \  
    .sync()  
  
print(f"File deleted")  
  
`
```

`Envelope.result` → `PNDeleteFileResult` (`status` Int)

---

## publish_file_message

Publishes a message about an already-uploaded file (automatically called by `send_file`).

```
`pubnub.publish_file_message() \  
    .channel(String) \  
    .meta(Dictionary) \  
    .message(Dictionary) \  
    .file_id(String) \  
    .custom_message_type(String) \  
    .file_name(String) \  
    .should_store(Boolean) \  
    .ttl(Integer)  
`
```

Key parameters:  
• ★ `channel`, ★ `file_id`, ★ `file_name`  
• `message` Dict (payload)  
• `meta` Dict (filtering)  
• `custom_message_type` String  
• `should_store` Bool (default True)  
• `ttl` Int (0 = key’s retention)

### Usage

```
`# synchronous:  
envelope = pubnub.publish_file_message() \  
    .channel("test_channel") \  
    .meta({"test": "test"}) \  
    .message({"test_message": "test"}) \  
    .custom_message_type("file-message") \  
    .file_id("fileID") \  
    .file_name("knights_of_ni.jpg") \  
    .ttl(22) \  
    .sync()  
  
# multithreaded asynchronous:  
def callback(response, status):  
    pass  
  
`
```

```
`envelope = pubnub.publish_file_message(channel="test_channel",  
                                       message="Bring me a shrubbery",  
                                       file_id="fileID",  
                                       file_name="knights_of_ni.jpg",  
                                       custom_message_type="file-message",  
                                       meta={"nice": True, "expensive": False},  
                                       ttl=22) \  
    .sync()  
`
```

`Envelope.result` → `PNPublishFileMessageResult` (`timestamp` String)

---

Last updated May 8 2025