# Unreal API & SDK Docs 1.2.0

This guide shows how to:
- Set up a connection to PubNub
- Send a "Hello, World" message
- Receive messages in real time

## Overview

Initialize the SDK, set up event listeners, and send/receive a simple "Hello, World" message in Unreal Engine using C++.

## Prerequisites

- Basic Unreal Engine and C++ knowledge
- Unreal Engine 5.2+ recommended
- PubNub account and keyset

For Unreal Engine versions 5.0.X–5.1.X, install the plugin manually.

Download and install Unreal Engine 5.0.X or 5.1.X. Create a new blank project and an empty Plugins folder in the project root.

#### Download the SDK

In the Plugins folder:
- Clone https://github.com/pubnub/unreal-engine
- Rename the cloned folder to Pubnub

#### Configure the workspace

Generate your IDE project files, then add the PubNub dependency to your Build.cs:

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Compile and run your project.

### Installation on Unreal Engine <5.2.0

## Setup

### Get your PubNub keys

- Sign in or create an account in the Admin Portal and create an app.
- Use the generated publish and subscribe keys from the app dashboard.
- Create separate keysets for production and test environments.

### Install the SDK

Always use the latest SDK version.

Get the PubNub Unreal Engine SDK from:
- FAB plugin: https://www.fab.com/listings/9501a8d6-f9e6-4cf8-8b56-d173bdb71fc4
- GitHub: https://github.com/pubnub/unreal-engine

Enable the PubNubSDK plugin in your project.

Add the C++ dependency in your Build.cs:

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Include the header where you use the SDK:

```
`#include "PubnubSubsystem.h"  
`
```

### Configure PubNub in Unreal Editor

Project Settings > Plugins > Pubnub SDK:
- Publish Key: demo (replace with your key for production)
- Subscribe Key: demo (replace with your key for production)
- Secret Key: leave empty unless using Access Manager
- Initialize Automatically: checked (recommended)
- Set Secret Key Automatically: unchecked (enable only if using access control)

SDK initialization
- If Initialize Automatically is disabled, initialize the PubNub SDK in code before use.

Required User ID
- Always set a stable User ID for each user/device before connecting.

### Configure the Unreal Engine project

Create two classes:
- PubNubGameInstance — inherits from UGameInstance
- PubNubPlayerController — inherits from APlayerController

Project settings:
- Set Default GameInstance to PubNubGameInstance
- Set Default Player Controller to PubNubPlayerController

## Steps

### Initialize PubNub

First, define the GameInstance to initialize PubNub, set a User ID, subscribe to a channel, and handle messages/errors.

Replace demo keys with your own in Project Settings or initialization.

In your header file (PubNubGameInstance.h):

```
// PubNubGameInstance.h  
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
	virtual void Init() override;  
      
	// Message listener  
	UFUNCTION()  
	void OnMessageReceived(FPubnubMessageData MessageData);  
      
	// Error handler  
	UFUNCTION()  
	void OnErrorReceived(FString ErrorMessage, EPubnubErrorType ErrorType);  
      
	// Function to publish our Hello World message  
	void PublishHelloWorld();  
      
private:  
	UPubnubSubsystem* PubnubSubsystem = nullptr;  
	FString ChannelName;  
};  

```

In your implementation file (PubNubGameInstance.cpp):

```
// PubNubGameInstance.cpp  
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
      
	// Bind message and error handlers  
	PubnubSubsystem->OnMessageReceived.AddDynamic(this, &UPubNubGameInstance::OnMessageReceived);  
	PubnubSubsystem->OnPubnubError.AddDynamic(this, &UPubNubGameInstance::OnErrorReceived);  
      
	// Subscribe to our channel  
	PubnubSubsystem->SubscribeToChannel(ChannelName);  
      
	UE_LOG(LogTemp, Log, TEXT("PubNub initialized and subscribed to channel: %s"), *ChannelName);  
	UE_LOG(LogTemp, Log, TEXT("Press P key to publish a Hello World message"));  
	  
}  

  
void UPubNubGameInstance::OnMessageReceived(FPubnubMessageData MessageData)  
{  
	// When a message is received, log it to the console  
	UE_LOG(LogTemp, Log, TEXT("Message received on channel: %s"), *MessageData.Channel);  
	UE_LOG(LogTemp, Log, TEXT("Message content: %s"), *MessageData.Message);  
}  

  
void UPubNubGameInstance::OnErrorReceived(FString ErrorMessage, EPubnubErrorType ErrorType)  
{  
	// Log any errors  
	UE_LOG(LogTemp, Error, TEXT("PubNub error: %s"), *ErrorMessage);  
}  

  
void UPubNubGameInstance::PublishHelloWorld()  
{  
	// Our simple Hello World message (with quotes as it has to be a valid Json)  
	FString Message = "\"Hello, World!\"";  
      
	UE_LOG(LogTemp, Log, TEXT("Publishing message: %s"), *Message);  
      
	// Publish to our channel  
	PubnubSubsystem->PublishMessage(ChannelName, Message);  
}  

```

For more information, see Configuration.

### Set up event listeners

Listeners let your app react to events/messages. The code above binds:
- OnMessageReceived to log received messages
- OnErrorReceived to log SDK errors

See Event Listeners for details.

### Create a subscription

Subscribe to channels to receive messages. The example subscribes to "hello_world_channel" in Init(). See Subscribe.

### Publish messages

Messages must be JSON-serializable and <32 KiB.

Create a PlayerController that publishes "Hello, World!" on P key press.

In your header file (PubNubPlayerController.h):

```
// PubNubPlayerController.h  
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
	virtual void SetupInputComponent() override;  
      
	// Handler for the P key press  
	void HandleKeyP();  
      
	// Reference to our game instance  
	UPubNubGameInstance* PubNubInstance = nullptr;  
};  

```

In your implementation file (PubNubPlayerController.cpp):

```
// PubNubPlayerController.cpp  
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

  
void APubNubPlayerController::HandleKeyP()  
{  
	if (PubNubInstance)  
	{  
		PubNubInstance->PublishHelloWorld();  
	}  
}  

```

See Publish for details.

### Run the app

- Play the project.
- Press P to publish "Hello, World!".
- Observe logs for message and errors.
- Test across platforms to validate behavior.

## Complete example

- PubNubGameInstance.h

```
// PubNubGameInstance.h  
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
	virtual void Init() override;  
      
	// Message listener  
	UFUNCTION()  
	void OnMessageReceived(FPubnubMessageData MessageData);  
      
	// Error handler  
	UFUNCTION()  
	void OnErrorReceived(FString ErrorMessage, EPubnubErrorType ErrorType);  
      
	// Function to publish our Hello World message  
	void PublishHelloWorld();  
      
private:  
	UPubnubSubsystem* PubnubSubsystem = nullptr;  
	FString ChannelName;  
};  

```

- PubNubGameInstance.cpp

```
// PubNubGameInstance.cpp  
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
      
	// Bind message and error handlers  
	PubnubSubsystem->OnMessageReceived.AddDynamic(this, &UPubNubGameInstance::OnMessageReceived);  
	PubnubSubsystem->OnPubnubError.AddDynamic(this, &UPubNubGameInstance::OnErrorReceived);  
      
	// Subscribe to our channel  
	PubnubSubsystem->SubscribeToChannel(ChannelName);  
      
	UE_LOG(LogTemp, Log, TEXT("PubNub initialized and subscribed to channel: %s"), *ChannelName);  
	UE_LOG(LogTemp, Log, TEXT("Press P key to publish a Hello World message"));  
	  
}  

  
void UPubNubGameInstance::OnMessageReceived(FPubnubMessageData MessageData)  
{  
	// When a message is received, log it to the console  
	UE_LOG(LogTemp, Log, TEXT("Message received on channel: %s"), *MessageData.Channel);  
	UE_LOG(LogTemp, Log, TEXT("Message content: %s"), *MessageData.Message);  
}  

  
void UPubNubGameInstance::OnErrorReceived(FString ErrorMessage, EPubnubErrorType ErrorType)  
{  
	// Log any errors  
	UE_LOG(LogTemp, Error, TEXT("PubNub error: %s"), *ErrorMessage);  
}  

  
void UPubNubGameInstance::PublishHelloWorld()  
{  
	// Our simple Hello World message (with quotes as it has to be a valid Json)  
	FString Message = "\"Hello, World!\"";  
      
	UE_LOG(LogTemp, Log, TEXT("Publishing message: %s"), *Message);  
      
	// Publish to our channel  
	PubnubSubsystem->PublishMessage(ChannelName, Message);  
}  

```

- PubNubPlayerController.h

```
// PubNubPlayerController.h  
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
	virtual void SetupInputComponent() override;  
      
	// Handler for the P key press  
	void HandleKeyP();  
      
	// Reference to our game instance  
	UPubNubGameInstance* PubNubInstance = nullptr;  
};  

```

- PubNubPlayerController.cpp

```
// PubNubPlayerController.cpp  
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

  
void APubNubPlayerController::HandleKeyP()  
{  
	if (PubNubInstance)  
	{  
		PubNubInstance->PublishHelloWorld();  
	}  
}  

```

## Next steps

- Unreal Chat SDK
- Presence
- Message Persistence
- Access Manager
- Objects (Users/Channels metadata)
- Blog: Announcing PubNub’s UE and Gaming Chat SDKs
- GitHub repository (samples)
- SDK reference documentation
- Support portal
- Ask the AI assistant

Last updated on Sep 11, 2025