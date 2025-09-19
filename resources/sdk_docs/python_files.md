# File Sharing API – PubNub Python SDK

Upload, list, download, delete, and publish messages about files (≤ 5 MB) on a channel.  
Operations can be executed either synchronously (`.sync()`) or asynchronously (`.pn_async(callback)`).

## Request execution

```
`pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .sync()  
`
```

```
`def my_callback_function(result, status):  
    print(f'TT: {result.timetoken}, status: {status.category.name}')  
  
pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .pn_async(my_callback_function)  
`
```

`Envelope.result` varies per API; `Envelope.status` is always `PNStatus`.

---

## Send file

Uploads a file and automatically publishes a file message to the channel.

### Method

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

Parameters  
* channel (String, required) – Target channel.  
* file_name (String, required) – File name.  
* file_object (bytes | file, required) – File content.  
* message (Dict) – Payload published with the file.  
* should_store (Bool, default `True`) – Store message in history.  
* ttl (Int) – Message storage time.  
* meta (Dict) – Filtering metadata.  
* custom_message_type (String) – 3-50 chars, alnum/`-`/`_`.  
* Deprecated: `cipher_key`.

### Samples

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

### Returns

`Envelope.result` → `PNSendFileResult`  
* name – File name.  
* file_id – File ID.  
* timestamp – Publish timetoken.

---

## List channel files

### Method

```
`pubnub.list_files() \  
    .channel(String)  
`
```

Parameters  
* channel (String, required) – Channel.  
* limit (Int) – Max items.  
* next (String) – Pagination cursor.

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

Returns → `PNGetFilesResult`  
* next – Pagination cursor.  
* count – Returned items.  
* data – List of `{id, name, size, created}`.

---

## Get file URL

### Method

```
`pubnub.get_file_url() \  
    .channel(String) \  
    .file_id(String) \  
    .file_name(String)  
`
```

Parameters: channel, file_id, file_name (all required).

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

Returns → `PNGetFileDownloadURLResult.file_url`.

---

## Download file

### Method

```
`pubnub.download_file() \  
    .channel(String) \  
    .file_id(String) \  
    .file_name(String)  
`
```

Parameters: channel, file_id, file_name.  
Deprecated: `cipher_key`.

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

Returns → `PNDownloadFileResult.data` (bytes).

---

## Delete file

### Method

```
`pubnub.delete_file() \  
    .channel(String) \  
    .file_id(String) \  
    .file_name(String)  
`
```

Parameters: channel, file_id, file_name.

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

Returns → `PNDeleteFileResult.status` (Int).

---

## Publish file message

Publish a message about an already-uploaded file (used internally by `send_file`, or manually if needed).

### Method

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

Parameters  
* channel (String, required) – Target channel.  
* message (Dict) – Payload.  
* file_id (String, required) – File ID.  
* file_name (String, required) – File name.  
* meta (Dict) – Filtering metadata.  
* should_store (Bool, default `True`).  
* ttl (Int, default `0`).  
* custom_message_type (String).  

### Samples

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

Returns → `PNPublishFileMessageResult.timestamp`.

---

_Last updated: Jul 15 2025_