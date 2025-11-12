# File Sharing API for Python SDK

Upload and share files up to 5 MB on PubNub. When you upload a file to a channel, PubNub stores it and publishes a file event with the file ID, name, and optional description to subscribers.

##### Request execution and return values

Choose synchronous or asynchronous execution.

`.sync()` returns an `Envelope` with:
- `Envelope.result`: varies by API
- `Envelope.status`: `PnStatus`

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

Uploads a file to a channel, then publishes a file message on the channel. Internally calls [`publish_file_message`](#publish-file-message).

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
- channel (required)  
  Type: String, Default: n/a  
  Channel for the file.
- file_name (required)  
  Type: String, Default: n/a  
  Name of the file to send.
- message  
  Type: Dictionary, Default: n/a  
  Message to send along with the file.
- should_store  
  Type: Boolean, Default: True  
  Store the published file message in channel history.
- ttl  
  Type: Integer, Default: n/a  
  How long the message is stored.
- file_object (required)  
  Type: bytes or Python file object, Default: n/a  
  File content.
- meta  
  Type: Dictionary, Default: n/a  
  Metadata for message filtering.
- custom_message_type  
  Type: String, Default: n/a  
  Case-sensitive, 3–50 alphanumeric chars; dashes and underscores allowed; cannot start with special chars or with pn_ / pn- (examples: text, action, poll).

Deprecated parameter:
- cipher_key (deprecated). Configure the crypto module instead: /docs/sdks/python/api-reference/configuration#crypto_module. If provided, it overrides crypto module config and uses legacy 128-bit encryption.

### Sample code

##### Reference code

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

show all 39 lines
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

Returns an `Envelope`:
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
- channel (required)  
  Type: String, Default: n/a  
  Channel to list files.
- limit  
  Type: Int, Default: n/a  
  Number of elements to return.
- next  
  Type: String, Default: n/a  
  Server-provided pagination token for forward pagination.

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

Returns an `Envelope`:
- result: PNGetFilesResult
- status: PNStatus

PNGetFilesResult:
- next (String): Pagination token.
- count (Int): Number of files returned.
- data (List): List of channel files with:
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
- channel (required)  
  Type: String  
  Channel where the file was uploaded.
- file_name (required)  
  Type: String  
  Stored file name.
- file_id (required)  
  Type: String  
  File’s unique ID.

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

Returns an `Envelope`:
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
- channel (required)  
  Type: String  
  Channel where the file was uploaded.
- file_name (required)  
  Type: String  
  Stored file name.
- file_id (required)  
  Type: String  
  File’s unique ID.

Deprecated parameter:
- cipher_key (deprecated). Configure the crypto module instead: /docs/sdks/python/api-reference/configuration#crypto_module. If provided, it overrides crypto module config and uses legacy 128-bit encryption.

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

Returns an `Envelope`:
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
- channel (required)  
  Type: String  
  Channel to delete from.
- file_id (required)  
  Type: String  
  File ID.
- file_name (required)  
  Type: String  
  File name.

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

Returns an `Envelope`:
- result: PNDeleteFileResult
- status: PNStatus

PNDeleteFileResult:
- status (Int): Status code.

## Publish file message

Publishes a message to a channel about an already-uploaded file (ID and name), enabling discovery and download. Called internally by [`send_file`](#send-file). If `send_file` fails with `status.operation === PNPublishFileMessageOperation`, use this to resend the message without re-uploading.

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
- channel (required)  
  Type: String, Default: n/a  
  Channel to publish to.
- meta  
  Type: Dictionary, Default: n/a  
  Metadata for message filtering.
- message  
  Type: Dictionary, Default: n/a  
  Payload.
- file_id (required)  
  Type: String, Default: n/a  
  File ID.
- custom_message_type  
  Type: String, Default: n/a  
  Case-sensitive, 3–50 alphanumeric chars; dashes/underscores allowed; cannot start with special chars or pn_ / pn- (examples: text, action, poll).
- file_name (required)  
  Type: String, Default: n/a  
  File name.
- should_store  
  Type: Boolean, Default: True  
  Store in history (False to skip).
- ttl  
  Type: Int, Default: 0  
  Duration to store in history; defaults to key set’s retention if not specified.

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

show all 24 lines
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

Returns an `Envelope`:
- result: PNPublishFileMessageResult
- status: PNStatus

PNPublishFileMessageResult:
- timestamp (String): Publish timetoken.

Last updated on Sep 3, 2025