On this page
# File Sharing API for Python SDK

Allows users to upload and share files. You can upload any file of up to 5 MB in size. This feature is commonly used in social apps to share images, or in medical apps to share medical records for patients.

When a file is uploaded on a `channel`, it's stored and managed using a storage service, and associated with your key. Subscribers to that `channel` receive a file event which contains a file `ID`, `filename`, and optional `description`.

##### Request execution and return values

You can decide whether to perform the Python SDK operations synchronously or asynchronously.

`.sync()` returns an `Envelope` object, which has two fields: `Envelope.result`, whose type differs for each API, and `Envelope.status` of type `PnStatus`.

```
`pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .sync()  
`
```

`.pn_async(callback)` returns `None` and passes the values of `Envelope.result` and `Envelope.status` to a callback you must define beforehand.

```
`def my_callback_function(result, status):  
    print(f'TT: {result.timetoken}, status: {status.category.name}')  
  
pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .pn_async(my_callback_function)  
`
```

## Send file[​](#send-file)

Upload the file to a specified channel.

This method covers the entire process of sending a file, including preparation, uploading the file to a cloud storage service, and post-uploading messaging on a channel.

For the last messaging step, `send_file` internally calls the [`publish_file_message`](#publish-file-message) method to publish a message on the channel.

The published message contains metadata about the file, such as the file identifier and name, enabling others on the channel to find out about the file and access it.

### Method(s)[​](#methods)

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

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aChannel for the file.`file_name` *Type: StringDefault:  
n/aName of the file to send.`message`Type: DictionaryDefault:  
n/aMessage which should be sent along with file to specified `channel`.`should_store`Type: BooleanDefault:  
`True`Whether PubNub published `file message` should be stored in `channel` history.`ttl`Type: IntegerDefault:  
n/aHow long message should be stored in channel's storage.`file_object` *Type: bytes or Python file objectDefault:  
n/aInput stream with file content.`meta`Type: DictionaryDefault:  
n/a`Meta` data object which can be used with the filtering ability.`custom_message_type`Type: StringDefault:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

##### Deprecated parameter

The `cipher_key` parameter in this method is deprecated. We recommend that you configure the [crypto module](/docs/sdks/python/api-reference/configuration#crypto_module) on your PubNub instance instead.   
   
 If you pass `cipher_key` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

- Builder Pattern
- Named Arguments

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
show all 39 lines
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
show all 41 lines

### Returns[​](#returns)

The `send_file()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNSendFileResult`](#pnsendfileresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

#### PNSendFileResult[​](#pnsendfileresult)

Property NameTypeDescription`name`StringName of the uploaded file.`file_id`StringID of the uploaded file.`timestamp`StringThe timetoken at which the message was published.

## List channel files[​](#list-channel-files)

Retrieve list of files uploaded to `Channel`.

### Method(s)[​](#methods-1)

```
`pubnub.list_files() \  
    .channel(String)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aChannel to get the list of files.`limit`Type: IntDefault:  
n/aThe number of elements to return.`next`Type: StringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.

### Basic Usage[​](#basic-usage-1)

- Builder Pattern
- Named Arguments

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

### Returns[​](#returns-1)

The `list_files()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNGetFilesResult`](#pngetfilesresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

#### PNGetFilesResult[​](#pngetfilesresult)

Property NameTypeDescription`next`StringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`count`IntNumber of files returned.`data`List`List` of channel files.

`data` contains the following properties:

Property NameTypeDescription`id`Long`Id` of the uploaded file.`name`String`Name` of the upload file.`size`String`Size` of the uploaded file.`created`StringTime of creation.

## Get File Url[​](#get-file-url)

Generate URL which can be used to download file from target `Channel`.

### Method(s)[​](#methods-2)

```
`pubnub.get_file_url() \  
    .channel(String) \  
    .file_id(String) \  
    .file_name(String)  
`
```

*  requiredParameterDescription`channel` *Type: StringName of `channel` to which the file has been uploaded.`file_name` *Type: StringName under which the uploaded file is stored.`file_id` *Type: StringUnique identifier for the file, assigned during upload.

### Basic Usage[​](#basic-usage-2)

- Builder Pattern
- Named Arguments

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

### Returns[​](#returns-2)

The `get_file_url()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNGetFileDownloadURLResult`](#pngetfiledownloadurlresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

#### PNGetFileDownloadURLResult[​](#pngetfiledownloadurlresult)

Property NameTypeDescription`file_url`String`URL` to be used to download the requested file.

## Download file[​](#download-file)

Download file from specified `Channel`.

### Method(s)[​](#methods-3)

```
`pubnub.download_file() \  
    .channel(String) \  
    .file_id(String) \  
    .file_name(String)  
`
```

*  requiredParameterDescription`channel` *Type: StringName of `channel` to which the file has been uploaded.`file_name` *Type: StringName under which the uploaded file is stored.`file_id` *Type: StringUnique identifier for the file, assigned during upload.

##### Deprecated parameter

The `cipher_key` parameter in this method is deprecated. We recommend that you configure the [crypto module](/docs/sdks/python/api-reference/configuration#crypto_module) on your PubNub instance instead.   
   
 If you pass `cipher_key` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Basic Usage[​](#basic-usage-3)

- Builder Pattern
- Named Arguments

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

### Returns[​](#returns-3)

The `download_file()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNDownloadFileResult`](#pndownloadfileresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

#### PNDownloadFileResult[​](#pndownloadfileresult)

Property NameTypeDescription`data`bytesPython bytes object.

## Delete file[​](#delete-file)

Delete file from specified `Channel`.

### Method(s)[​](#methods-4)

```
`pubnub.delete_file() \  
    .channel(String) \  
    .file_id(String) \  
    .file_name(String)  
`
```

*  requiredParameterDescription`channel` *Type: StringThe `channel` from which to delete the file.`file_id` *Type: StringUnique identifier of the file to be deleted.`file_name` *Type: StringName of the file to be deleted.

### Basic Usage[​](#basic-usage-4)

- Builder Pattern
- Named Arguments

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

### Returns[​](#returns-4)

The `download_file()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNDeleteFileResult`](#pndeletefileresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

#### PNDeleteFileResult[​](#pndeletefileresult)

Property NameTypeDescription`status`IntReturns a status code.

## Publish file message[​](#publish-file-message)

Publish the uploaded file message to a specified channel.

This method is called internally by [`send_file`](#send-file) as part of the file-sending process to publish the message with the file (already uploaded in a storage service) on a channel.

This message includes the file's unique identifier and name elements, which are needed to construct download links and inform channel subscribers that the file is available for download.

You can call this method when `send_file` fails and returns the `status.operation === PNPublishFileMessageOperation` error.
In that case, you can use the data from the `status` object to try again and use `publish_file_message` to manually resend a file message to a channel without repeating the upload step.

### Method(s)[​](#methods-5)

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

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aName of `channel` to publish file message.`meta`Type: DictionaryDefault:  
n/aMeta data object which can be used with the filtering ability.`message`Type: DictionaryDefault:  
n/aThe payload.`file_id` *Type: StringDefault:  
n/aUnique identifier of the file.`custom_message_type`Type: StringDefault:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.`file_name` *Type: StringDefault:  
n/aName of the file.`should_store`Type: BooleanDefault:  
`True`Set to `False` to *not* store this message in history. By default, messages are stored according to the retention policy you set on your key.`ttl`Type: IntDefault:  
`0`How long the message should be stored in the channel's history. If not specified, defaults to the key set's retention value.

### Basic Usage[​](#basic-usage-5)

- Builder Pattern
- Named Arguments

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
show all 24 lines
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

### Returns[​](#returns-5)

The `publish_file_message()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNPublishFileMessageResult`](#pnpublishfilemessageresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

#### PNPublishFileMessageResult[​](#pnpublishfilemessageresult)

The `publish_file_message()` operation returns a `PNPublishFileMessageResult` which contains the following property:

Property NameTypeDescription`timestamp`StringThe timetoken at which the message was published.Last updated on **May 8, 2025**