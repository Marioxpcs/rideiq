\# 🚗 RideIQ

\*\*RideIQ\*\* is a mobile application that compares ride-hailing
services in real time and detects pricing trends to help users avoid
surge pricing and reduce wait times.

Built as a full-stack project with a Node.js backend and React Native
(Expo) mobile client.

\-\--

\## ✨ Features

\- 📊 Real-time ride comparison across providers (simulated for
development) - 📈 Price trend detection (rising / falling / stable) - ⏱
Pickup time estimation - 🔄 Live updates via repeated requests - 📱
Mobile interface built with React Native + Expo Router - 🌐 Backend API
with Express - 🧠 Foundation for surge prediction using contextual
signals

\-\--

\## 🏗 Architecture

📱 Mobile App (React Native) ↓ HTTP 🌐 Backend API (Express) ↓ Logic 📊
Trend Engine (in-memory history) ↓ Response 📱 UI updates in real time

\-\--

\## 🧪 Example Output

Uber --- \$18 --- Pickup 4 min --- 📈 Rising Lyft --- \$16 --- Pickup 6
min --- 🟢 Stable

\-\--

\## 🛠 Tech Stack

\### Frontend (Mobile)

\- React Native - Expo Router - TypeScript - Axios - Safe Area Context

\### Backend

\- Node.js - Express - TypeScript - In-memory data store (V1) - REST API

\-\--

\## 🚀 Getting Started

\### 1️⃣ Clone the repo

\`\`\`bash git clone https://github.com/YOUR_USERNAME/rideiq.git cd
rideiq 2️⃣ Run Backend cd rideiq-api npm install npx ts-node-esm
src/server.ts

Server runs on:

http://localhost:3001 3️⃣ Run Mobile App cd ../rideiq-mobile npm install
npx expo start

Open with Expo Go on your device.

📌 Project Status

✅ V1 Foundation Complete 🔄 Real API integration planned 🧠 AI
prediction engine planned 🗺 Map integration planned

💡 Motivation

Ride-hailing prices fluctuate unpredictably due to demand, traffic, and
driver availability.

RideIQ aims to provide transparency and decision support so users can
choose the cheapest or fastest option before booking.

🔮 Future Improvements

Real Uber/Lyft API integration

Event-based surge forecasting

Weather-aware predictions

Multi-modal transport comparison

Push notifications for price drops

Machine learning models for forecasting

👨‍💻 Author

Mario Ezeh Computer Science Student / Aspiring Software Engineer / Entrepreneur 
