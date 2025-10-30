# File Sharing API for Python SDK

Upload and share files up to 5 MB on a channel. Subscribers receive a file event with file ID, name, and optional description.

##### Request execution and return values

Operations can be synchronous or asynchronous.

`.sync()` returns an `Envelope` with:
- result: type differs per API
- status: `PnStatus`

```
`1pubnub.publish() \  
2    .channel("myChannel") \  
3    .message("Hello from PubNub Python SDK") \  
4    .sync()  
`
```

`.pn_async(callback)` returns `None` and calls your callback with `Envelope.result` and `Envelope.status`.

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

Uploads a file to a channel and publishes a file message. Internally calls publish_file_message.

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
- channel (String, required): Channel for the file.
- file_name (String, required): Name of the file to send.
- message (Dictionary): Message to send along with the file.
- should_store (Boolean, default True): Store the file message in channel history.
- ttl (Integer): How long to store the message in history.
- file_object (bytes or Python file object, required): Input stream with file content.
- meta (Dictionary): Metadata for message filtering.
- custom_message_type (String): Case-sensitive, alphanumeric 3–50 chars; dashes and underscores allowed; cannot start with special characters or with pn_ or pn-. Examples: text, action, poll.

Deprecated:
- cipher_key: Use the crypto module instead. If provided, it overrides crypto module config and uses legacy 128-bit encryption.

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

Envelope:
- result: PNSendFileResult
- status: PNStatus

PNSendFileResult:
- name (String): Uploaded file name.
- file_id (String): Uploaded file ID.
- timestamp (String): Message publish timetoken.

## List channel files

Retrieve files uploaded to a channel.

### Method(s)

```
`1pubnub.list_files() \  
2    .channel(String)  
`
```

Parameters:
- channel (String, required): Channel to get files from.
- limit (Int): Number of elements to return.
- next (String): Server-provided cursor for forward pagination.

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

Envelope:
- result: PNGetFilesResult
- status: PNStatus

PNGetFilesResult:
- next (String): Pagination cursor.
- count (Int): Number of files returned.
- data (List): List of files, each with:
  - id (Long): File ID.
  - name (String): File name.
  - size (String): File size.
  - created (String): Creation time.

## Get file URL

Generate a URL to download a file from a channel.

### Method(s)

```
`1pubnub.get_file_url() \  
2    .channel(String) \  
3    .file_id(String) \  
4    .file_name(String)  
`
```

Parameters:
- channel (String, required): Channel name.
- file_name (String, required): Stored file name.
- file_id (String, required): File identifier.

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

Envelope:
- result: PNGetFileDownloadURLResult
- status: PNStatus

PNGetFileDownloadURLResult:
- file_url (String): Download URL.

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
- channel (String, required): Channel name.
- file_name (String, required): Stored file name.
- file_id (String, required): File identifier.

Deprecated:
- cipher_key: Use the crypto module instead. If provided, it overrides crypto module config and uses legacy 128-bit encryption.

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

Envelope:
- result: PNDownloadFileResult
- status: PNStatus

PNDownloadFileResult:
- data (bytes): File bytes.

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
- channel (String, required): Channel to delete from.
- file_id (String, required): File identifier.
- file_name (String, required): File name.

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

Envelope:
- result: PNDeleteFileResult
- status: PNStatus

PNDeleteFileResult:
- status (Int): Status code.

## Publish file message

Publish the uploaded file message to a channel. Called internally by send_file after upload. Use directly if send_file fails after upload (status.operation === PNPublishFileMessageOperation).

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
- channel (String, required): Channel to publish to.
- meta (Dictionary): Metadata for filtering.
- message (Dictionary): Payload.
- file_id (String, required): File identifier.
- custom_message_type (String): Case-sensitive, alphanumeric 3–50 chars; dashes and underscores allowed; cannot start with special characters or with pn_ or pn-. Examples: text, action, poll.
- file_name (String, required): File name.
- should_store (Boolean, default True): Store in history (subject to retention).
- ttl (Int, default 0): History TTL; defaults to keyset retention.

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

Envelope:
- result: PNPublishFileMessageResult
- status: PNStatus

PNPublishFileMessageResult:
- timestamp (String): Message publish timetoken.