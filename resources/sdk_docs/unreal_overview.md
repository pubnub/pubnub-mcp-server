On this page
# Unreal API & SDK Docs v0.3.3

In this guide, we'll create a simple "Hello, World" application that demonstrates the core concepts of PubNub in Unreal Engine:

- Setting up a connection to PubNub

- Sending a "Hello, World" message

- Receiving messages in real-time

## Overview[​](#overview)

This guide will help you get up and running with PubNub in your Unreal Engine application using C++ programming. You'll learn how to initialize the SDK, set up event listeners, and send/receive a simple "Hello, World" message - all with minimal code.

## Prerequisites[​](#prerequisites)

Before we dive in, make sure you have:

- A basic understanding of Unreal Engine and C++

- Unreal Engine installed (version 5.2 or higher recommended)

- A PubNub account (we'll help you set this up!)

### Installation on Unreal Engine <5.2.0

## Setup[​](#setup)

### Get your PubNub keys[​](#get-your-pubnub-keys)

First things first – you'll need your PubNub keys to get started. Here's how to get them:

- [Sign in](https://admin.pubnub.com/#/login) or [create an account](https://admin.pubnub.com/#/signup) on the Admin Portal and create an app.

- When you create a new app, the first set of keys is generated automatically.

- Find your publish and subscribe keys in the app's dashboard.

We recommend that you create separate keysets for [production and test environments](/docs/general/setup/account-setup#environment-aligned-keys).

### Install the SDK[​](#install-the-sdk)

##### SDK version

Always use the latest SDK version to have access to the newest features and avoid security vulnerabilities, bugs, and performance issues.

PubNub Unreal Engine SDK is available on [FAB](https://www.fab.com/listings/9501a8d6-f9e6-4cf8-8b56-d173bdb71fc4) as a free downloadable plugin that you can add to your project.

Install the **PubNub SDK** [plugin](https://www.fab.com/listings/9501a8d6-f9e6-4cf8-8b56-d173bdb71fc4) from FAB. For information on installing plugins, refer to the [Unreal Engine documentation](https://dev.epicgames.com/documentation/en-us/unreal-engine/working-with-plugins-in-unreal-engine).

Enable the **PubNubSDK** in your project. For information on enabling plugins, refer to the [Unreal Engine documentation](https://dev.epicgames.com/documentation/en-us/unreal-engine/working-with-plugins-in-unreal-engine).

In your project's Build.cs file, add the dependency (this is required only for using PubNub SDK with C++):

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

In files that you want to use PubNub SDK functionality include the necessary header:

```
`#include "PubnubSubsystem.h"  
`
```

### Configure PubNub in Unreal Editor[​](#configure-pubnub-in-unreal-editor)

After installing the PubNub SDK plugin, you should configure it in the Unreal Editor's Project Settings:

In the Unreal Editor window, click the **Settings** dropdown and select **Project Settings**.

In the **Project Settings** window, scroll down to the **Plugins** section and click **Pubnub SDK**.

In the **Plugins - Pubnub SDK** view, provide the following configuration options:

OptionValueNotes**Publish Key**`demo`Replace with your key from the Admin Portal for production**Subscribe Key**`demo`Replace with your key from the Admin Portal for production**Secret Key***(leave empty)*Only required for access control operations**Initialize Automatically***(checked)*Recommended for easier setup**Set Secret Key Automatically***(unchecked)*Only check if using access control

After configuring these settings, the PubNub SDK will be ready to use in your project.

##### SDK initialization

If you choose not to enable **Initialize Automatically**, you'll need to manually initialize the PubNub SDK in your code before using any PubNub functionality.

##### Required User ID

Always set the User ID to uniquely identify the user or device that connects to PubNub. This User ID should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the User ID, you won't be able to connect to PubNub.

### Configure the Unreal Engine project[​](#configure-the-unreal-engine-project)

For our simple "Hello, World" example, we'll focus on creating just two essential classes:

1. $1

2. $1

#### Create a new project[​](#create-a-new-project)

Launch the Unreal Editor and create a new C++ project (or open your existing project).

#### Create essential C++ classes[​](#create-essential-c-classes)

Create the following C++ classes through the editor:

1. $1

2. $1

- `PubNubGameInstance` - Inherit from UGameInstance

- `PubNubPlayerController` - Inherit from APlayerController

#### Configure project settings[​](#configure-project-settings)

Configure the project settings:

1. $1

2. $1

- Set Default GameInstance to your PubNubGameInstance class.

- Set Default Player Controller to your PubNubPlayerController class.

## Steps[​](#steps)

### Initialize PubNub[​](#initialize-pubnub)

- Blueprint
- C++

First, we'll set up the PubNub GameInstance class to initialize the PubNub SDK and handle messages.

Make sure to replace the demo keys with your app's publish and subscribe keys from the Admin Portal.

In your header file (PubNubGameInstance.h):

```
`// PubNubGameInstance.h  
#pragma once  
  
#include "CoreMinimal.h"  
#include "Engine/GameInstance.h"  
#include "PubnubSubsystem.h"  
#include "PubNubGameInstance.generated.h"  
  
UCLASS()  
//Replace YOUR_PROJECT_API with [Project_Name]_API  
class YOUR_PROJECT_API UPubNubGameInstance : public UGameInstance  
{  
	GENERATED_BODY()  
      
public:  
`
```

show all 32 linesIn your implementation file (PubNubGameInstance.cpp):

```
`// PubNubGameInstance.cpp  
#include "PubNubGameInstance.h"  
  
void UPubNubGameInstance::Init()  
{  
	Super::Init();  
      
	// Set the channel we'll use for our Hello World example  
	ChannelName = "hello_world_channel";  
      
	// Get the PubNub subsystem  
	PubnubSubsystem = GetSubsystemUPubnubSubsystem>();  
      
	// Set User ID - required for connection  
	PubnubSubsystem->SetUserID("unreal_user_123");  
`
```
show all 51 lines

For more information, refer to the [Configuration](/docs/sdks/unreal/api-reference/configuration) section of the SDK documentation.

### Set up event listeners[​](#set-up-event-listeners)

Listeners help your app react to events and messages. You can implement custom app logic to respond to each type of message or event.

We've already set up our message and error listeners in the GameInstance's Init method. The listeners will:

- Log any received messages to the Output Log.

- Log any errors that occur.

For more information, refer to the [Event Listeners](/docs/sdks/unreal/api-reference/configuration#event-listeners) section of the SDK documentation.

### Create a subscription[​](#create-a-subscription)

To receive messages sent to a particular channel, you need to subscribe to it.

We've already subscribed to the "hello_world_channel" in our GameInstance's Init method.

For more information, refer to the [Subscribe](/docs/sdks/unreal/api-reference/publish-and-subscribe#subscribe) section of the SDK documentation.

### Publish messages[​](#publish-messages)

When you publish a message to a channel, PubNub delivers that message to everyone who is subscribed to that channel.

A message can be any type of JSON-serializable data (such as objects, arrays, integers, strings) that is smaller than 32 KiB.

- Blueprint
- C++

Let's create a PlayerController that will publish a "Hello, World!" message when the P key is pressed.

In your header file (PubNubPlayerController.h):

```
`// PubNubPlayerController.h  
#pragma once  
  
#include "CoreMinimal.h"  
#include "GameFramework/PlayerController.h"  
#include "PubNubGameInstance.h"  
#include "PubNubPlayerController.generated.h"  
  
UCLASS()  
//Replace YOUR_PROJECT_API with [Project_Name]_API  
class YOUR_PROJECT_API APubNubPlayerController : public APlayerController  
{  
	GENERATED_BODY()  
      
protected:  
`
```

show all 23 linesIn your implementation file (PubNubPlayerController.cpp):

```
`// PubNubPlayerController.cpp  
#include "PubNubPlayerController.h"  
#include "Kismet/GameplayStatics.h"  
  
void APubNubPlayerController::SetupInputComponent()  
{  
	Super::SetupInputComponent();  
      
	// Bind the P key to publish a Hello World message  
	InputComponent->BindKey(EKeys::P, IE_Pressed, this, &APubNubPlayerController::HandleKeyP);  
      
	// Get our game instance  
	PubNubInstance = CastUPubNubGameInstance>(UGameplayStatics::GetGameInstance(GetWorld()));  
}  
  
`
```
show all 22 lines

For more information, refer to the [Publish](/docs/sdks/unreal/api-reference/publish-and-subscribe#publish) section of the SDK documentation.

### Run the app[​](#run-the-app)

To test your Hello World PubNub integration:

1. $1

2. $1

3. $1

4. $1

5. $1

#### Cross-platform testing[​](#cross-platform-testing)

To verify that your PubNub implementation works across platforms:

1. $1

2. $1

3. $1

4. $1

5. $1

6. $1

## Complete example[​](#complete-example)

Here's the complete implementation for our Hello World example:

- PubNubGameInstance.h

```
`// PubNubGameInstance.h  
#pragma once  
  
#include "CoreMinimal.h"  
#include "Engine/GameInstance.h"  
#include "PubnubSubsystem.h"  
#include "PubNubGameInstance.generated.h"  
  
UCLASS()  
//Replace YOUR_PROJECT_API with [Project_Name]_API  
class YOUR_PROJECT_API UPubNubGameInstance : public UGameInstance  
{  
	GENERATED_BODY()  
      
public:  
`
```
show all 32 lines

- PubNubGameInstance.cpp

```
`// PubNubGameInstance.cpp  
#include "PubNubGameInstance.h"  
  
void UPubNubGameInstance::Init()  
{  
	Super::Init();  
      
	// Set the channel we'll use for our Hello World example  
	ChannelName = "hello_world_channel";  
      
	// Get the PubNub subsystem  
	PubnubSubsystem = GetSubsystemUPubnubSubsystem>();  
      
	// Set User ID - required for connection  
	PubnubSubsystem->SetUserID("unreal_user_123");  
`
```
show all 51 lines

- PubNubPlayerController.h

```
`// PubNubPlayerController.h  
#pragma once  
  
#include "CoreMinimal.h"  
#include "GameFramework/PlayerController.h"  
#include "PubNubGameInstance.h"  
#include "PubNubPlayerController.generated.h"  
  
UCLASS()  
//Replace YOUR_PROJECT_API with [Project_Name]_API  
class YOUR_PROJECT_API APubNubPlayerController : public APlayerController  
{  
	GENERATED_BODY()  
      
protected:  
`
```
show all 23 lines

- PubNubPlayerController.cpp

```
`// PubNubPlayerController.cpp  
#include "PubNubPlayerController.h"  
#include "Kismet/GameplayStatics.h"  
  
void APubNubPlayerController::SetupInputComponent()  
{  
	Super::SetupInputComponent();  
      
	// Bind the P key to publish a Hello World message  
	InputComponent->BindKey(EKeys::P, IE_Pressed, this, &APubNubPlayerController::HandleKeyP);  
      
	// Get our game instance  
	PubNubInstance = CastUPubNubGameInstance>(UGameplayStatics::GetGameInstance(GetWorld()));  
}  
  
`
```
show all 22 lines

## Next steps[​](#next-steps)

Great job! 🎉 You've successfully created your first PubNub application in Unreal Engine. Here are some exciting things you can explore next:

- Build chat
- Advanced features
- Real examples
- More help

- Learn about the [Unreal Chat SDK](/docs/chat/unreal-chat-sdk) for ready-to-use chat features.

- Implement user [Presence](/docs/sdks/unreal/api-reference/presence) to show who's online.

- Try out [Presence](/docs/sdks/unreal/api-reference/presence) to track online/offline status.

- Implement [Message Persistence](/docs/sdks/unreal/api-reference/storage-and-playback) to store and retrieve messages.

- Use [Access Manager](/docs/sdks/unreal/api-reference/access-manager) to secure your channels.

- Implement [Objects](/docs/sdks/unreal/api-reference/objects) to manage users and channels metadata.

- Look at the [Announcing PubNub's UE and Gaming Chat SDKs](https://www.pubnub.com/blog/announcing-pubnubs-unreal-engine-and-gaming-chat-sdks/) blog.

- Explore our [GitHub repository](https://github.com/pubnub/kotlin/) for more code samples.

- Check out our [SDK reference documentation](/docs/sdks/unreal/api-reference/configuration) for detailed API information.

- Join our [Discord community](https://discord.gg/pubnub) to connect with other developers.

- Visit our [support portal](https://support.pubnub.com/) for additional resources.

- Ask our AI assistant (the looking glass icon at the top of the page) for help.

Last updated on **Apr 24, 2025**