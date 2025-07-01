# File Sharing API – PubNub C# SDK (Condensed)

Upload, list, download, delete, and publish file messages (≤ 5 MB) on a channel. Subscribers receive a file event containing the file ID and name.

## Error Handling

Use `try / catch`; SDK throws on invalid parameters. Server/network issues are in `status`.

```csharp
try {
    PNResult<PNPublishResult> publishResponse = await pubnub.Publish()
        .Message("Why do Java developers wear glasses? Because they can't C#.")
        .Channel("my_channel")
        .ExecuteAsync();

    Console.WriteLine("Server status code : " + publishResponse.Status.StatusCode);
} catch (Exception ex) {
    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");
}
```

---

## Send file <a name="send-file"></a>

Uploads a file and automatically publishes a file message.

```csharp
pubnub.SendFile()
      .Channel(string)
      .File(string | byte[])
      .FileName(string)
      .Message(string)
      .ShouldStore(bool)
      .Meta(Dictionary<string, object>)
      .Ttl(int)
      .CustomMessageType(string)
```

Parameters  
• Channel (string, required) – Target channel.  
• File (string path | byte[], required) – Local file path or byte array. If byte[], set `FileName`.  
• FileName (string) – Overrides default file name.  
• Message (string) – Message sent with the file.  
• ShouldStore (bool) – Store message in history.  
• Meta (Dictionary<string, object>) – Filtering metadata.  
• Ttl (int) – Message TTL.  
• CustomMessageType (string) – 3-50 chars label (no leading `pn_` / `pn-`).  

Deprecated: `CipherKey` (use crypto module).

Response example
```json
{
  "Timetoken": 15957709330808500,
  "FileId": "d9515cb7-48a7-41a4-9284-f4bf331bc770",
  "FileName": "cat_picture.jpg"
}
```

Returns `PNResult<PNFileUploadResult>`  
• Result: Timetoken (long), FileId (string), FileName (string)  
• Status: PNStatus

---

## List channel files <a name="list-channel-files"></a>

```csharp
pubnub.ListFiles()
      .Channel(string)
      .Limit(int)
      .Next(string)
```

Parameters  
• Channel (string, required) – Channel to query.  
• Limit (int, default 100) – Max items.  
• Next (string) – Pagination cursor.

Response example
```json
{
  "FilesList": [{
      "Name": "cat_picture.jpg",
      "Id":   "d9515cb7-48a7-41a4-9284-f4bf331bc770",
      "Size": 25778,
      "Created": "2020-07-26T13:42:06Z"
  }],
  "Count": 1,
  "Next": null
}
```

Returns `PNResult<PNListFilesResult>`  
• FilesList (List<PNFileResult>) – Name, Id, Size, Created  
• Count (int)  
• Next (string)

---

## Get file URL <a name="get-file-url"></a>

```csharp
pubnub.GetFileUrl()
      .Channel(string)
      .FileId(string)
      .FileName(string)
```

Parameters  
• Channel, FileId, FileName – all required.

Response example
```json
{
  "Url": "http://ps.pndsn.com/v1/files/…/cat_picture.jpg?…"
}
```

Returns `PNResult<PNFileUrlResult>` – Url (string)

---

## Download file <a name="download-file"></a>

```csharp
pubnub.DownloadFile()
      .Channel(string)
      .FileId(string)
      .FileName(string)
```

Parameters: Channel, FileId, FileName (all required).  
Deprecated: `CipherKey`.

Response example
```json
{
  "FileBytes": "/9j/4AAQSkZJRgABAQEA…",
  "FileName": "cat_picture.jpg"
}
```

Returns `PNResult<PNDownloadFileResult>`  
• FileBytes (byte[]) – Use `SaveFileToLocal(string)` to persist.  
• FileName (string)

---

## Delete file <a name="delete-file"></a>

```csharp
pubnub.DeleteFile()
      .Channel(string)
      .FileId(string)
      .FileName(string)
```

Parameters: Channel, FileId, FileName (all required).

Response example
```json
{}
```

Returns `PNResult<PNDeleteFileResult>` (empty `Result`).

---

## Publish file message <a name="publish-file-message"></a>

Use when upload succeeded but message publish failed.

```csharp
pubnub.PublishFileMessage()
      .Channel(string)
      .FileId(string)
      .FileName(string)
      .Message(object)
      .Meta(Dictionary<string, object>)
      .ShouldStore(bool)
      .CustomMessageType(string)
```

Parameters  
• Channel, FileId, FileName (required)  
• Message (object) – Payload.  
• Meta (Dictionary<string, object>) – Filtering metadata.  
• ShouldStore (bool, default true)  
• CustomMessageType (string)

Response example
```json
{
  "Timetoken": 15957738720237858
}
```

Returns `PNResult<PNPublishFileMessageResult>` – Timetoken (long)

---

Last updated Jun 30 2025