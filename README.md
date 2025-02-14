# Description

This is an simlpe realtime messenger with not so simple architecture including message brokers, session storage, distributed task system, ci/cd and so on

> [!WARNING]
> This is TO-BE and not implemented yet

# System Architecture

```mermaid
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

    subgraph "Session Store"
        REDIS[Redis]
    end

    %% Messaging and Background Tasks
    subgraph "Messaging"
        RABBIT[RabbitMQ]
    end

    subgraph "Background Tasks"
        CELERY[Celery Workers]
    end

    %% OAuth Providers for External Authentication
    subgraph "OAuth Providers"
        GOOGLE[Google OAuth]
        YANDEX[Yandex OAuth]
        GITHUB[GitHub OAuth]
    end

    %% Connections from Client to API
    SPA -- "HTTP/WS API Calls" --> API

    %% API interactions with Data Stores
    API -- "CRUD (Users, Chatrooms)" --> PG
    API -- "Store/Retrieve Chat History" --> MONGO
    API -- "Session Management" --> REDIS

    %% API interactions with Messaging & Tasks
    API -- "Publish/Subscribe (Chat messages)" --> RABBIT
    API -- "Delegate Tasks (emails, notifications)" --> RABBIT
    RABBIT -- "Task Queue Broker" --> CELERY

    %% API interactions with OAuth Providers
    API -- "OAuth2 Authentication" --> GOOGLE
    API -- "OAuth2 Authentication" --> YANDEX
    API -- "OAuth2 Authentication" --> GITHUB

    %% Realtime Communication for Chat Updates
    API -- "Realtime Chat Updates (WS)" --> SPA
```

# Authentication sequence diagram

``` mermaid

sequenceDiagram
    participant SPA as React SPA
    participant API as FastAPI Backend
    participant DB as PostgreSQL
    participant REDIS as Redis
    participant EMAIL as Email Service (Celery)
    participant OAUTH as OAuth Provider

    %% ===============================
    %% Local Registration with Email Verification
    %% ===============================
    note over SPA,API: Local Registration (Unverified)
    SPA->>API: POST /register {email, password}
    API->>API: Validate input & hash password
    API->>DB: Insert new user record (status: unverified)
    DB-->>API: Return user_id & record
    API->>EMAIL: Enqueue email verification (include token/link)
    EMAIL-->>API: Confirmation email queued
    API-->>SPA: Respond: "Registration successful. Please check your email to verify your account."

    %% ===============================
    %% Email Verification Callback
    %% ===============================
    note over SPA,API: User clicks email verification link
    SPA->>API: GET /verify-email?token=XYZ
    API->>DB: Validate token & update user record (status: verified)
    DB-->>API: Confirmation updated
    API->>REDIS: Create session / Store JWT token
    API-->>SPA: Respond: "Email verified" with JWT token

    %% ===============================
    %% Local Login Flow (for verified users)
    %% ===============================
    note over SPA,API: Local Login (Verified)
    SPA->>API: POST /login {email, password}
    API->>DB: Query user record by email
    DB-->>API: Return user record (must be verified)
    API->>API: Verify password hash
    API->>REDIS: Create session / Store JWT token
    API-->>SPA: Respond with JWT token

    %% ===============================
    %% OAuth2 Login Flow
    %% ===============================
    note over SPA,API: OAuth2 Login (Provider verifies email)
    SPA->>API: GET /auth/google
    API-->>SPA: Return redirect URL to Google OAuth
    SPA->>OAUTH: Redirect to Google OAuth login
    OAUTH-->>SPA: Display login page (user logs in)
    OAUTH-->>SPA: Redirect to /auth/google/callback?code=AUTH_CODE
    SPA->>API: GET /auth/google/callback?code=AUTH_CODE
    API->>OAUTH: Exchange auth code for access token
    OAUTH-->>API: Return access token
    API->>OAUTH: Request user profile (email, oauth_id, verified status)
    OAUTH-->>API: Return user profile (email_verified: true)
    API->>DB: Query user record by email / oauth_id
    alt User exists
        DB-->>API: Return existing user record
    else User does not exist
        API->>DB: Insert new user record with OAuth info (status: verified)
        DB-->>API: Return new user record
    end
    API->>REDIS: Create session / Store JWT token
    API-->>SPA: Respond with JWT token


```