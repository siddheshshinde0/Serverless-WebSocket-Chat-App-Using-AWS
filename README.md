# Serverless-WebSocket-Chat-App-Using-AWS

A fully functional **serverless real-time chat application** using WebSocket and AWS services.

---

## 🌐 Project Overview

The **Serverless WebSocket Chat App** enables **real-time two-way communication** between clients using a fully **serverless architecture**. It leverages **AWS API Gateway, Lambda, and DynamoDB** to manage connections and broadcast messages, requiring **no server maintenance** and scaling automatically with usage.

---

## 🏗️ Architecture Diagram

             ┌──────────────────────────┐
             │        Client Side       │
             │   (HTML + JavaScript)    │
             └─────────────┬────────────┘
                           │ WebSocket (wss)
                           ▼
                ┌──────────────────────────┐
                │   API Gateway WebSocket  │
                │   Routes:                │
                │   - $connect             │
                │   - $disconnect          │
                │   - sendMessage          │
                └───────────┬──────────────┘
                            │ Integrations
                            ▼
    ┌───────────────────────────────────────────────────────┐
    │                     AWS Lambda                        │
    │  ┌───────────────┬──────────────┬─────────────────┐   │
    │  │ onConnect     │ onDisconnect │   onMessage      │  │
    │  │ Stores        │ Removes      │ Broadcasts       │  │
    │  │ connectionId  │ connectionId │ messages         │  │
    │  └───────────────┴──────────────┴─────────────────┘   │
    └───────────────┬───────────────────────────────────────┘
                    │ DynamoDB Read/Write
                    ▼
         ┌──────────────────────────────────┐
         │     DynamoDB Table:              │
         │   WebSocketConnections           │
         │   - connectionId (PK)            │
         │ Stores all active WebSocket users│
         └──────────────────────────────────┘

---

## ⚡ Setup Instructions

### Backend Deployment (AWS)

**DynamoDB Table**

* Table Name: `WebSocketConnections`  
* Primary Key: `connectionId` (String)  

**Lambda Functions**

* **onConnect** → Stores connectionId in DynamoDB when a client connects  
* **onDisconnect** → Removes connectionId from DynamoDB when a client disconnects  
* **sendMessage** → Broadcasts messages to all connected clients  
* Runtime: Node.js 18.x, Node.js 22.x, Node.js 24.x (on availability) 
* Attach an **IAM Role** with permissions to access DynamoDB and API Gateway Management API  

**API Gateway WebSocket**

* Create routes: `$connect`, `$disconnect`, `sendMessage`  
* Attach the corresponding Lambda function to each route  

---

### Frontend Setup

* Open `client.html` in your browser  
* Replace `wss://<api-gateway-url>/dev` with your WebSocket URL  

---

### Testing

* Open multiple browser windows  
* Send messages  
* Observe messages broadcast to all connected clients in real-time  

---

## 🧩 How It Works

1. **Client Connection**: Browser connects to WebSocket URL exposed by API Gateway  
2. **$connect Lambda**: Saves the client’s `connectionId` in DynamoDB  
3. **Sending Message**: Client sends a message → triggers `sendMessage` Lambda  
4. **Broadcasting**: Lambda scans DynamoDB → sends message to all active clients using API Gateway Management API  
5. **$disconnect Lambda**: Removes the client’s `connectionId` from DynamoDB  

This ensures a **fully serverless, real-time communication loop**.

---

## 🔑 Key Features

* Real-time two-way communication using **WebSocket API**  
* Fully **serverless architecture** (no EC2, no containers)  
* **Auto-scaling backend** powered by AWS Lambda  
* **Connection tracking** using DynamoDB  
* **Broadcast messaging** to all connected clients  
* Lightweight client UI (**pure HTML + JavaScript**)  
* **Cost-efficient**: pay only for messages + Lambda execution  
* Zero maintenance required  

---

## 🧱 Technologies Used

### AWS Services

* **API Gateway (WebSocket API)** — Manages persistent connections  
* **AWS Lambda** — Handles connect, disconnect, and message events  
* **DynamoDB** — Stores active connection IDs  
* **IAM** — Permissions and execution roles  

### Libraries (AWS SDK v3)

| Library                                   | Purpose                                                                                        |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `@aws-sdk/client-dynamodb`                | Low-level access to DynamoDB for precise operations like `GetItem`, `DeleteItem`               |
| `@aws-sdk/lib-dynamodb`                   | High-level DocumentClient for simplified operations (`Put`, `Scan`, `Delete`)                  |
| `@aws-sdk/client-apigatewaymanagementapi` | Sends messages back to clients using their connection IDs, essential for broadcasting messages |

---

## 🛠️ How to Contribute

* Suggest improvements or report issues via GitHub  
* Fork the repository and submit a pull request  
* ⭐ Star the repository to support development  

---

## 👨‍💻 Author

**Siddhesh Shinde**  
Cloud Computing Enthusiast | AWS Learner  
[GitHub](https://github.com/siddheshshinde0)  
