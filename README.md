<h1 align="center"> Relay — A Real-Time Full-Stack Messaging Platform</h1>

<p align="center">
  <a href="#-project-description">Description</a> • 
  <a href="#-key-features">Features</a> • 
  <a href="#-tech-stack">Tech Stack</a> • 
  <a href="#-getting-started">Getting Started</a>
</p>

---

## 🚀 Project Description

**Relay** is a modern, real-time messaging web application that mimics the feel of today’s top messaging platforms. With secure authentication, dynamic **Socket.IO-based** communication, and a polished responsive UI, it delivers a seamless chat experience. Whether you’re sending text, photos, or videos, everything happens in real-time — no refresh required.

The project demonstrates full-stack proficiency with features like JWT-based authentication, password hashing via `bcryptjs`, file uploads to **Cloudinary**, and live updates via **Socket.IO** — all built around a **clean modular architecture** in both frontend and backend.

---

## ✨ Key Features

**User Authentication:**

*   Secure sign up and login using **bcryptjs** for password hashing.
*   **JWT-based** token system stored in HTTP-only cookies for session protection.
*   Option to persist sessions or expire on browser close.

**Real-Time Messaging:**

*   Instant delivery of messages using **Socket.IO**.
*   Automatic message updates between users without needing refresh.

**Media Sharing:**

*   Supports sending images and videos in chat.
*   Media files are uploaded to **Cloudinary** and rendered with inline previews.

**User Presence:**

*   Dynamically displays which users are currently online.
*   User list updates in real time based on socket connection state.

**Polished UI/UX:**

*   Built with **TailwindCSS**, **Radix UI**, and **ShadCN** components.
*   Fully responsive UI designed from scratch with a sleek modern look.
*   Custom scrollbars, rounded message bubbles, and subtle hover effects.
*   Profile dropdown with logout and user info options.

**Clean Code Architecture:**

*   Backend uses **Express.js** (ESM) with clear separation of routes, controllers, models, and middlewares.
*   Frontend uses **Next.js App Router**, with context for global user state and Socket.IO-based real-time communication.
*   All API communication handled cleanly with Axios.

---

## 🛠 Tech Stack

| Layer        | Technology                                  |
| ------------ | ------------------------------------------- |
| Frontend     | Next.js 14, TailwindCSS, ShadCN, Radix UI   |
| Backend      | Express.js, **bcryptjs** for password hashing, JWT, Cookie Parser |
| Database     | MongoDB with Mongoose ODM                   |
| Realtime     | **Socket.IO**                               |
| Media Upload | Cloudinary                                  |
| Auth         | JWT + HTTP-only Cookies                     |

---

## 🧑‍💻 Getting Started

To get this project up and running locally, follow the steps below.

**1.Clone the repository**
```
git clone https://github.com/ManchalaSashank/Relay.git
cd relay
```

**2.Install Dependencies(Backend)**
```
cd server
npm install
```
Now create .env file inside your /server folder with the following content
```
PORT=4000  
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:3000

# Cloudinary (for media uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
To get your Cloudinary credentials, go to https://cloudinary.com/ and register your account.
Then under the API keys section, find the necessary credentials and use them.

Now start the server
```
node index.js
```

**3.Install Dependencies(Frontend)**
```
cd ../client
npm install
```
Now start the Frontend
```
npm run dev
```
Open http://localhost:3000 with your browser to see the result.


