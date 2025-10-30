# Unreal API & SDK Docs v1.0.0

Build a minimal "Hello, World" app demonstrating PubNub in Unreal Engine:
- Connect to PubNub
- Publish a "Hello, World" message
- Receive messages in real time

## Overview

Initialize the SDK, configure keys, set up listeners, and send/receive a "Hello, World" message in C++ with minimal code.

## Prerequisites

- Unreal Engine 5.2+ recommended (5.0.X–5.1.X requires manual plugin install)
- Basic Unreal Engine and C++ knowledge
- PubNub account and keyset

For Unreal Engine versions lower than 5.2.0 (5.0.X - 5.1.X), you must install the plugin manually:
- Download and install Unreal Engine 5.0.X or 5.1.X.
- Create a new blank Unreal project.
- Create a Plugins folder in your project.
- Clone https://github.com/pubnub/unreal-engine into Plugins and rename the folder to Pubnub.
- Generate IDE project files (macOS: Services -> Generate xCode project; Windows: Generate Visual Studio project files), then open the workspace.
- In Source/YourProject/YourProject.Build.cs add:
```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```
- Compile and run.

### Installation on Unreal Engine <5.2.0

Use the manual plugin installation steps above.

## Setup

### Get your PubNub keys

- Sign in or create an account at the Admin Portal, create an app.
- Use the auto-generated publish and subscribe keys from the app’s keyset.
- Create separate keysets for production and test environments.

### Install the SDK

Always use the latest SDK version.

- Install the PubNub SDK plugin from FAB: https://www.fab.com/listings/9501a8d6-f9e6-4cf8-8b56-d173bdb71fc4 or from GitHub: https://github.com/pubnub/unreal-engine
- Enable the PubNubSDK plugin in your project.
- In Build.cs (for C++ usage), add:
```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```
- Include the SDK header in files where you use it:
```
`#include "PubnubSubsystem.h"  
`
```

### Configure PubNub in Unreal Editor

Project Settings -> Plugins -> Pubnub SDK:
- Publish Key: demo (replace with production key)
- Subscribe Key: demo (replace with production key)
- Secret Key: leave empty (only for Access Manager operations)
- Initialize Automatically: checked (recommended)
- Set Secret Key Automatically: unchecked (only if using access control)

SDK initialization: If Initialize Automatically is disabled, initialize the SDK in code before use.

Required User ID: Always set a persistent User ID; connection fails without it.

### Configure the Unreal Engine project

Create and set:
- C++ classes:
  - PubNubGameInstance: UGameInstance
  - PubNubPlayerController: APlayerController
- Project Settings:
  - Default GameInstance: PubNubGameInstance
  - Default Player Controller: PubNubPlayerController

## Steps

### Initialize PubNub

Set up PubNub in your GameInstance: configure User ID, bind listeners, subscribe, and log status.

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

For more information, see Configuration docs.

### Set up event listeners

Bind message and error handlers (shown above in Init) to log received messages and errors. See Event Listeners docs.

### Create a subscription

Subscribe to the target channel (shown above in Init). See Subscribe docs.

### Publish messages

Publish a JSON-serializable payload (<32 KiB). Press P to publish in the example PlayerController.

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

See Publish docs.

### Run the app

Build and run your project, then use the bound input to publish and observe messages in the log.

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
- GitHub repository
- SDK reference documentation
- Support portal
- Ask the AI assistant

Last updated on Sep 11, 2025