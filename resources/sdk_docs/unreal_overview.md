# Unreal API & SDK Docs 1.2.0

This guide shows how to:
- Set up a connection to PubNub
- Send a "Hello, World" message
- Receive messages in real-time

## Overview

Initialize the SDK, set up event listeners, and send/receive a "Hello, World" message in Unreal Engine (C++).

## Prerequisites

- Unreal Engine 5.2+ (or manual plugin install for 5.0.X–5.1.X)
- C++ knowledge
- PubNub account and keyset

For Unreal Engine versions 5.0.X–5.1.X:
- Install Unreal Engine 5.0.X or 5.1.X
- Create a new blank project
- Create a Plugins folder in your project
- Clone https://github.com/pubnub/unreal-engine into Plugins and rename the folder to Pubnub
- Generate IDE project files (Mac: Services -> Generate Xcode project; Windows: Generate Visual Studio project files)
- Add dependency in Build.cs, then compile and run

#### Download the SDK

Clone https://github.com/pubnub/unreal-engine into your project’s Plugins folder and rename to Pubnub.

#### Configure the workspace

Generate IDE project files (Xcode/Visual Studio), open the workspace, and add the PubNub dependency in Build.cs:

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Compile and run.

### Installation on Unreal Engine <5.2.0

Follow the manual steps above for 5.0.X–5.1.X (clone plugin into Plugins, add Build.cs dependency, generate project files, compile).

## Setup

### Get your PubNub keys

- Create/sign in to your PubNub account and create an app
- Use the generated publish and subscribe keys
- Use separate keysets for production and test

### Install the SDK

- Use the plugin from FAB or GitHub
- Enable PubNubSDK in your project
- Add C++ dependency:

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

- Include the header in files that use PubNub:

```
`#include "PubnubSubsystem.h"  
`
```

### Configure PubNub in Unreal Editor

Project Settings -> Plugins -> Pubnub SDK:
- Publish Key: demo (replace for production)
- Subscribe Key: demo (replace for production)
- Secret Key: leave empty unless using access control
- Initialize Automatically: checked (recommended)
- Set Secret Key Automatically: unchecked (unless using access control)

SDK initialization: If not initializing automatically, initialize in code before use.

Required User ID: Always set and persist a unique User ID; without it, connection fails.

### Configure the Unreal Engine project

Create two classes:
- PubNubGameInstance (UGameInstance)
- PubNubPlayerController (APlayerController)

Set project defaults:
- Default GameInstance -> PubNubGameInstance
- Default Player Controller -> PubNubPlayerController

## Steps

### Initialize PubNub

Use a GameInstance to initialize PubNub, set a User ID, subscribe, and handle events.

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

### Set up event listeners

Bind OnMessageReceived and OnPubnubError to handle messages and errors (see Init above).

### Create a subscription

Subscribe to a channel to receive messages (see SubscribeToChannel in Init above).

### Publish messages

Messages must be JSON-serializable and < 32 KiB. Use a PlayerController to publish on key press.

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

### Run the app

- Launch the project
- Press P to publish “Hello, World!” and observe logs on both publisher/subscriber instances

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
- Objects
- GitHub repository
- SDK reference documentation
- Support portal

Last updated on Sep 11, 2025