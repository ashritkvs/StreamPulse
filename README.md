# 🎥 StreamPulse: Real-Time Video Chat with AI Object Detection

StreamPulse is a full-stack WebRTC-based peer-to-peer video chat app enhanced with real-time AI-powered object detection overlays using TensorFlow.js. It enables 1-on-1 encrypted video calls with live object tracking on the video feed — all directly in the browser.

---

## 🧠 Real-World Use Cases

StreamPulse demonstrates how **AI-powered video communication** can impact real-world applications:

### 🔍 Smart Surveillance
Detect and label people or objects live on camera for security, retail, or public safety.

### 🧑‍🏫 Remote Education
Helps instructors auto-label equipment or tools in science/engineering labs during video calls.

### 🧏‍♀️ AI-Assisted Accessibility
Supports hearing-impaired users with real-time object labeling during video chats.

### 💬 Developer Prototype
Acts as a reference project to build AI overlays for telehealth, coaching, or live streaming apps.

---

## 🚀 Features

- 📹 Peer-to-peer encrypted video chat via WebRTC
- 🧠 Live object detection using TensorFlow.js COCO-SSD
- ⚡ Real-time video stream overlay with bounding boxes
- 🔁 Socket.IO signaling server for offer/answer/ICE
- 🔌 STUN server integration for public connectivity
- 🧠 Detection only runs on caller's end to save resources

---

## 🛠️ Tech Stack

| Category        | Tools |
|-----------------|-------|
| Frontend        | React, WebRTC, TensorFlow.js |
| Backend         | Node.js, Express, Socket.IO |
| AI Model        | TensorFlow.js COCO-SSD |
| Signaling       | Socket.IO |
| Deployment (opt)| Vercel (frontend), Render/Glitch (backend) |

---


---

## 📦 Local Development

### 1. Clone the repo
```bash
git clone https://github.com/ashritkvs/StreamPulse.git
cd StreamPulse

1)
Start the backend
cd server
npm install
node index.js

2)Start the frontend

cd ../client
npm install
npm start

3)Open two tabs at:

http://localhost:3000

Tab 1: Click OK → Caller

Tab 2: Click Cancel → Receiver



