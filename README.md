---

# 🗓️ EventBoard – Full-Stack Event Management App

A modern event management platform with authentication, CRUD features, third-party event integration, and webhook support.

## 🌐 Live Demo

👉 [https://event-board-1.onrender.com](https://event-board-1.onrender.com)
**Demo Login:**

* Email: `alice@example.com`
* Password: `password`

## ✨ Key Features

* 🔐 **JWT Authentication** — Protected routes, seed user for testing
* 📝 **Event CRUD** — Create, read, update, delete personal events
* 🌍 **Public Events** — Integrated GitHub & Ticketmaster events
* 🔔 **Webhooks** — External status updates with HMAC verification
* 📱 **Responsive UI** — Built with React + Material-UI

## 🧰 Tech Stack

* **Frontend:** React 18, Material-UI, Axios, React Router
* **Backend:** Node.js, Express.js, Firebase (optional), JWT, Joi, Helmet, CORS

## 🚀 Quick Start (Local)

```bash
# Clone and install
git clone <repo-url>
cd EventBoard

# Backend
cd server && npm install && npm start

# Frontend
cd ../client && npm install && npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 API Overview

| Method | Endpoint                  | Description      |
| ------ | ------------------------- | ---------------- |
| POST   | /auth/login               | Login/Register   |
| GET    | /api/events               | List user events |
| POST   | /api/events               | Create event     |
| PATCH  | /api/events/:id           | Update event     |
| DELETE | /api/events/:id           | Delete event     |
| GET    | /api/events/public-events | Public events    |
| POST   | /webhooks/external-events | Webhook updates  |

## 🧪 Webhook Example

```bash
BODY='{"event_id":"123","new_status":"published","delivery_id":"abc"}'
SIG=$(echo -n $BODY | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" -binary | xxd -p -c 256)

curl -X POST https://event-board-1.onrender.com/webhooks/external-events \
  -H "Content-Type: application/json" \
  -H "X-External-Signature: sha256:$SIG" \
  -d "$BODY"
```


## 📄 License

MIT License

---

**Built with ❤️ using React, Express.js & Material-UI**

---

