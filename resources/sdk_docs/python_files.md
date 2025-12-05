# File Sharing API for Python SDK

Upload and share files up to 5 MB. When you upload a file to a channel, PubNub stores it and publishes a file event with file ID, name, and optional description to subscribers.

##### Request execution and return values

Decide between synchronous or asynchronous execution.

`.sync()` returns an `Envelope` with:
- Envelope.result (type differs per API)
- Envelope.status (`PnStatus`)

```
`1pubnub.publish() \  
2    .channel("myChannel") \  
3    .message("Hello from PubNub Python SDK") \  
4    .sync()  
`
```

`.pn_async(callback)` returns `None` and invokes your callback with `(result, status)`.

```
1def my_callback_function(result, status):  
2    print(f'TT: {result.timetoken}, status: {status.category.name}')  
3
  
4pubnub.publish() \  
5    .channel("myChannel") \  
6    .message("Hello from PubNub Python SDK") \  
7    .pn_async(my_callback_function)  
```

## Send file

Upload a file to a channel and publish a file message. Internally calls publish_file_message to announce the file.

### Method(s)

```
`1pubnub.send_file() \  
2    .channel(String) \  
3    .file_name(String) \  
4    .message(Dictionary) \  
5    .should_store(Boolean) \  
6    .ttl(Integer) \  
7    .file_object(Python Object File or bytes) \  
8    .meta(Dictionary) \  
9    .custom_message_type(String)  
`
```

Parameters:
- channel (required, String): Channel for the file.
- file_name (required, String): File name to send.
- message (Dictionary): Message to send with the file.
- should_store (Boolean, default True): Store the file message in history.
- ttl (Integer): How long to store the message in history.
- file_object (required, bytes or Python file object): File content.
- meta (Dictionary): Metadata for message filtering.
- custom_message_type (String): 3–50 char case-sensitive alphanumeric label; dashes/underscores allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.

Deprecated parameter:
- cipher_key: Deprecated. Configure the crypto module on your PubNub instance instead. Passing cipher_key overrides crypto module and uses legacy 128-bit encryption.

### Sample code

- Builder Pattern
- Named Arguments

```
1import os  
2from pubnub.pnconfiguration import PNConfiguration  
3from pubnub.pubnub import PubNub  
4from pubnub.exceptions import PubNubException  
5
  
6
  
7def send_file(pubnub: PubNub, file_path: str, channel: str):  
8    try:  
9        with open(file_path, 'rb') as sample_file:  
10            response = pubnub.send_file() \  
11                .channel(channel) \  
12                .file_name("sample.gif") \  
13                .message({"test_message": "test"}) \  
14                .file_object(sample_file) \  
15                .sync()  
16            print("File sent successfully. File ID:", response.result.file_id)  
17
  
18    except PubNubException as e:  
19        print(f"Error: {e}")  
20    except FileNotFoundError:  
21        print(f"File not found: {file_path}")  
22
  
23
  
24def main():  
25    # Configuration for PubNub instance  
26    pn_config = PNConfiguration()  
27    pn_config.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  
28    pn_config.publish_key = os.getenv('PUBLISH_KEY', 'demo')  
29    pn_config.user_id = os.getenv('USER_ID', 'my_custom_user_id')  
30
  
31    # Initialize PubNub client  
32    pubnub = PubNub(pn_config)  
33
  
34    # Send file  
35    send_file(pubnub, 'path/to/sample.gif', 'my_channel')  
36
  
37
  
38if __name__ == "__main__":  
39    main()  
```

```
1import os  
2from pubnub.pnconfiguration import PNConfiguration  
3from pubnub.pubnub import PubNub  
4from pubnub.exceptions import PubNubException  
5
  
6
  
7def send_file(pubnub: PubNub, file_path: str, channel: str):  
8    try:  
9        with open(file_path, 'rb') as sample_file:  
10            response = pubnub.send_file(  
11                channel=channel,  
12                file_name="sample.gif",  
13                file_object=sample_file,  
14                message="Hey, it's gif not jif",  
15                custom_message_type="file-message"  
16            ).sync()  
17            print("File sent successfully. File ID:", response.result.file_id)  
18
  
19    except PubNubException as e:  
20        print(f"Error: {e}")  
21    except FileNotFoundError:  
22        print(f"File not found: {file_path}")  
23
  
24
  
25def main():  
26    # Configuration for PubNub instance  
27    pn_config = PNConfiguration()  
28    pn_config.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  
29    pn_config.publish_key = os.getenv('PUBLISH_KEY', 'demo')  
30    pn_config.user_id = os.getenv('USER_ID', 'my_custom_user_id')  
31
  
32    # Initialize PubNub client  
33    pubnub = PubNub(pn_config)  
34
  
35    # Send file  
36    send_file(pubnub, 'path/to/sample.gif', 'ch1')  
37
  
38
  
39if __name__ == "__main__":  
40    main()  
41
```

### Returns

Envelope with:
- result: PNSendFileResult
- status: PNStatus

PNSendFileResult:
- name (String): Uploaded file name.
- file_id (String): Uploaded file ID.
- timestamp (String): Publish timetoken.

## List channel files

Retrieve files uploaded to a channel.

### Method(s)

```
`1pubnub.list_files() \  
2    .channel(String)  
`
```

Parameters:
- channel (required, String): Channel to list files from.
- limit (Int): Number of elements.
- next (String): Forward pagination cursor returned by server.

### Sample code

- Builder Pattern
- Named Arguments

```
1
  
```

```
1file_list_response = pubnub.list_files(channel="ch1", limit=10, next="xyz...abc").sync()  
2print(f"Found {len(file_list_response.result.data)} files:")  
3
  
4for file_data in file_list_response.result.data:  
5    print(f"  {file_data['name']} with id: {file_data['id']}")  
```

### Returns

Envelope with:
- result: PNGetFilesResult
- status: PNStatus

PNGetFilesResult:
- next (String): Forward pagination cursor.
- count (Int): Number of files returned.
- data (List): List of files with:
  - id (Long): File ID.
  - name (String): File name.
  - size (String): File size.
  - created (String): Creation time.

## Get file URL

Generate a download URL for a file.

### Method(s)

```
`1pubnub.get_file_url() \  
2    .channel(String) \  
3    .file_id(String) \  
4    .file_name(String)  
`
```

Parameters:
- channel (String): Channel of the file.
- file_name (String): Stored file name.
- file_id (String): File identifier from upload.

### Sample code

- Builder Pattern
- Named Arguments

```
1
  
```

```
1download_url = pubnub.get_file_url(channel="ch1",  
2                                   file_id=file_data['id'],  
3                                   file_data['name']) \  
4    .sync()  
5
  
6print(f'  Download url: {download_url.result.file_url}')  
```

### Returns

Envelope with:
- result: PNGetFileDownloadURLResult
- status: PNStatus

PNGetFileDownloadURLResult:
- file_url (String): URL to download the file.

## Download file

Download a file from a channel.

### Method(s)

```
`1pubnub.download_file() \  
2    .channel(String) \  
3    .file_id(String) \  
4    .file_name(String)  
`
```

Parameters:
- channel (String): Channel of the file.
- file_name (String): Stored file name.
- file_id (String): File identifier from upload.

Deprecated parameter:
- cipher_key: Deprecated. Configure the crypto module. Passing cipher_key overrides crypto module and uses legacy 128-bit encryption.

### Sample code

- Builder Pattern
- Named Arguments

```
1
  
```

```
1download_url = pubnub.download_file(channel="ch1",  
2                                    file_id=file_data['id'],  
3                                    file_data['name']) \  
4    .sync()  
5
  
6fw = open(f"{os.getcwd()}/{file_data['name']}", 'wb')  
7fw.write(download_file.result.data)  
8
  
9print(f"File saved as {os.getcwd()}/{file_data['name']}")  
10
```

### Returns

Envelope with:
- result: PNDownloadFileResult
- status: PNStatus

PNDownloadFileResult:
- data (bytes): File content as Python bytes.

## Delete file

Delete a file from a channel.

### Method(s)

```
`1pubnub.delete_file() \  
2    .channel(String) \  
3    .file_id(String) \  
4    .file_name(String)  
`
```

Parameters:
- channel (String): Channel to delete from.
- file_id (String): File identifier.
- file_name (String): File name.

### Sample code

- Builder Pattern
- Named Arguments

```
1
  
```

```
1pubnub.delete_file(channel="ch1",  
2                   file_id=file_data['id'],  
3                   file_data['name']) \  
4    .sync()  
5
  
6print(f"File deleted")  
7
```

### Returns

Envelope with:
- result: PNDeleteFileResult
- status: PNStatus

PNDeleteFileResult:
- status (Int): Status code.

## Publish file message

Publish the uploaded file message to a channel. Called by send_file. Use directly to resend the file message if send_file fails with status.operation === PNPublishFileMessageOperation.

### Method(s)

```
`1pubnub.publish_file_message() \  
2    .channel(String) \  
3    .meta(Dictionary) \  
4    .message(Dictionary) \  
5    .file_id(String) \  
6    .custom_message_type(String) \  
7    .file_name(String) \  
8    .should_store(Boolean) \  
9    .ttl(Integer)  
`
```

Parameters:
- channel (required, String): Channel to publish to.
- meta (Dictionary): Metadata for filtering.
- message (Dictionary): Payload.
- file_id (required, String): File identifier.
- custom_message_type (String): 3–50 char case-sensitive alphanumeric label; dashes/underscores allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.
- file_name (required, String): File name.
- should_store (Boolean, default True): Store in history; set False to not store.
- ttl (Int, default 0): Message TTL in history; defaults to key-set retention if not specified.

### Sample code

- Builder Pattern
- Named Arguments

```
1# synchronous:  
2envelope = pubnub.publish_file_message() \  
3    .channel("test_channel") \  
4    .meta({"test": "test"}) \  
5    .message({"test_message": "test"}) \  
6    .custom_message_type("file-message") \  
7    .file_id("fileID") \  
8    .file_name("knights_of_ni.jpg") \  
9    .ttl(22) \  
10    .sync()  
11
  
12# multithreaded asynchronous:  
13def callback(response, status):  
14    pass  
15
  
16pubnub.publish_file_message() \  
17    .channel("test_channel") \  
18    .meta({"test": "test"}) \  
19    .message({"test_message": "test"}) \  
20    .custom_message_type("file-message") \  
21    .file_id("fileID") \  
22    .file_name("knights_of_ni.jpg") \  
23    .ttl(22) \  
24    .pn_async(callback)  
```

```
`1envelope = pubnub.publish_file_message(channel="test_channel",  
2                                       message="Bring me a shrubbery",  
3                                       file_id="fileID",  
4                                       file_name="knights_of_ni.jpg",  
5                                       custom_message_type="file-message",  
6                                       meta={"nice": True, "expensive": False},  
7                                       ttl=22) \  
8    .sync()  
`
```

### Returns

Envelope with:
- result: PNPublishFileMessageResult
- status: PNStatus

PNPublishFileMessageResult:
- timestamp (String): Publish timetoken.