# Description

This is an simlpe realtime messenger with not so simple architecture including message brokers, session storage, distributed task system, ci/cd and so on

# System Architecture

``` mermaid
graph TD
    %% Client Layer
    subgraph "Client Side"
        SPA[React SPA]
    end

    %% API / Business Logic Layer
    subgraph "API Layer"
        API[FastAPI Backend]
    end

    %% Data Stores
    subgraph "User & Chatroom Data Store"
        PG[(PostgreSQL)]
    end

    subgraph "Chat History Store"
        MONGO[(MongoDB)]
    end

    %% Connections from Client to API
    SPA -- "HTTP/WS API Calls" --> API

    %% API interactions with Data Stores
    API -- "CRUD (Users, Chatrooms)" --> PG
    API -- "Store/Retrieve Chat History" --> MONGO

    %% Realtime Communication for Chat Updates
    API -- "HTTP Response/Realtime Chat Updates (WS)" --> SPA
```

# Message flow 

``` mermaid
sequenceDiagram
  participant P1 as Sender
  participant P2 as Recipient
  participant P3 as Backend
  participant P4 as PostgreSQL
  participant P5 as MongoDB
  participant P6 as Message Broker

  %% WebSocket Connection Establishment
  P1 ->>+ P3: Get WS Connection
  P3 -->>- P1: Connection established successfully

  %% Sending the message
  P1 ->> P3: Send message to RECIPIENT_ID
  Note right of P3: Sort sender & recipient IDs<br/>to generate a consistent chatroom ID<br/>(LOWER_ID-HIGHER_ID)

  %% Chatroom lookup/creation in PostgreSQL
  P3 ->> P4: Query chatroom LOWER_ID-HIGHER_ID
  alt Chatroom does not exist
    P4 -->> P3: None
    P3 ->>+ P4: Create chatroom LOWER_ID-HIGHER_ID
    P4 -->>- P3: Chatroom CHATROOM_ID created
    P3 ->>+ P5: Initialize chat history for CHATROOM_ID
    P5 -->>- P3: Chat history initialized
  else Chatroom exists
    P4 -->> P3: Chatroom CHATROOM_ID found
  end

  %% Message Broker flow
  P3 ->> P6: Enqueue message (CHATROOM_ID)
  P6 -->> P3: Message enqueued confirmation
  P6 ->> P2: Deliver message (CHATROOM_ID)
  P2 -->> P6: Acknowledge receipt
  P6 -->> P3: Delivery confirmation

  %% Confirm delivery back to the sender
  P3 ->> P1: Delivery confirmation

```

![image](https://github.com/user-attachments/assets/9e530d27-e18f-4c73-b474-b2d6b0a04158)
![image](https://github.com/user-attachments/assets/55e4bd2f-f6c3-47a4-a3f3-a79a435fe30e)
