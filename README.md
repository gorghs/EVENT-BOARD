# EventBoard - Full-Stack CRUD Event Management App

A modern event management application built with React frontend and Express.js backend, featuring third-party API integration and webhook support.

## 🚀 Live Demo

- **Frontend**: [http://localhost:3000](http://localhost:3000) (when running locally)
- **Backend API**: [http://localhost:5000](http://localhost:5000) (when running locally)

### Demo Credentials
- **Email**: `alice@example.com`
- **Password**: `password`

## ✨ Features

### Authentication
- JWT-based authentication
- Protected routes with middleware
- Seed user for testing (`alice@example.com` / `password`)

### Event Management (CRUD)
- **Create**: Add new events with title, date, location, description, and status
- **Read**: View personal events with filtering and pagination
- **Update**: Edit existing events (owner-only)
- **Delete**: Remove events (owner-only)
- **Status**: Draft/Published workflow

### Third-Party Integration
- **Discover Tab**: Browse public events from:
  - GitHub Issues (Express.js repository)
  - Ticketmaster Events
- **Rate Limit Handling**: Graceful error handling for API limits
- **Data Normalization**: Consistent event format across sources

### Webhook Support
- **Endpoint**: `POST /webhooks/external-events`
- **Signature Verification**: HMAC-SHA256 validation
- **Idempotency**: Duplicate delivery prevention
- **Event Status Updates**: External status changes

## 🛠️ Tech Stack

### Frontend
- **React 18** with functional components and hooks
- **Material-UI (MUI)** for modern, responsive design
- **React Router** for navigation
- **Axios** for API communication
- **Date-fns** for date formatting

### Backend
- **Node.js** with Express.js
- **Firebase Firestore** for data persistence
- **JWT** for authentication
- **Joi** for request validation
- **Helmet** for security headers
- **CORS** for cross-origin requests
- **Rate Limiting** for API protection

## 📋 API Endpoints

### Authentication
```
POST /auth/login
POST /auth/register
```

### Events (Protected)
```
GET    /api/events              # List user's events
POST   /api/events              # Create new event
GET    /api/events/:id          # Get specific event
PATCH  /api/events/:id          # Update event
DELETE /api/events/:id          # Delete event
```

### Public Events
```
GET /api/events/public-events   # Third-party events
```

### Webhooks
```
POST /webhooks/external-events  # External event updates
```

### Health Check
```
GET /healthz                    # Server health
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Firebase project (optional - dev mode works without)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EventBoard
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd server
   npm install
   
   # Frontend
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   Create `server/.env`:
   ```env
   PORT=5000
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=24h
   ALLOW_DEV_LOGIN=true
   NODE_ENV=development
   
   # Optional: Firebase (for production)
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email
   
   # Optional: Third-party APIs
   TICKETMASTER_API_KEY=your-ticketmaster-key
   GITHUB_API_BASE=https://api.github.com/repos/expressjs/express/issues?per_page=10
   
   # Webhook
   WEBHOOK_SECRET=your-webhook-secret
   ```

4. **Start the application**
   ```bash
   # Terminal 1: Backend
   cd server
   npm start
   
   # Terminal 2: Frontend
   cd client
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🧪 Testing

### Run Tests
```bash
cd server
npm test
```

### Test Coverage
- ✅ Create and fetch events
- ✅ List user events
- ✅ Delete events
- ✅ Fetch public events
- ✅ Authorization (403 for non-owners)
- ✅ Webhook signature validation (401 for invalid)

## 🔗 Webhook Integration

### Webhook Secret
```
WEBHOOK_SECRET=your-secret-key
```

### Example Webhook Call
```bash
# Generate signature
BODY='{"event_id":"123","new_status":"published","delivery_id":"abc-123"}'
SIG=$(echo -n $BODY | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" -binary | xxd -p -c 256)

# Send webhook
curl -X POST http://localhost:5000/webhooks/external-events \
  -H "Content-Type: application/json" \
  -H "X-External-Signature: sha256:$SIG" \
  -d "$BODY"
```

### Webhook Payload Format
```json
{
  "event_id": "string",
  "new_status": "draft|published",
  "delivery_id": "uuid"
}
```

## 🎯 Demo Flow

1. **Login** with `alice@example.com` / `password`
2. **Create Event** - Add a new event in draft status
3. **View Events** - See your events in "My Events"
4. **Discover** - Browse public events from GitHub/Ticketmaster
5. **Webhook Test** - Use the curl command above to update event status
6. **Authorization Test** - Try editing someone else's event (403 error)

## 🔒 Security Features

- **JWT Authentication** with configurable expiration
- **Input Validation** using Joi schemas
- **Rate Limiting** (100 requests per 15 minutes)
- **CORS Protection** with configurable origins
- **Security Headers** via Helmet
- **Webhook Signature Verification** (HMAC-SHA256)
- **Owner-only Operations** with middleware protection

## 📱 Responsive Design

- **Mobile-first** approach
- **Material-UI** responsive components
- **Touch-friendly** interface
- **Progressive Web App** ready

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
cd client
npm run build
# Deploy the build folder
```

### Backend (Railway/Render/Fly)
```bash
cd server
# Set environment variables
# Deploy with your preferred platform
```

### Environment Variables for Production
```env
NODE_ENV=production
ALLOW_DEV_LOGIN=false
CLIENT_ORIGIN=https://your-frontend-domain.com
# ... other production variables
```

## 📊 Project Structure

```
EventBoard/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── api/           # API configuration
│   │   └── theme/         # Material-UI theme
│   └── package.json
├── server/                # Express backend
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Custom middleware
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── tests/            # Test files
│   └── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the existing issues
2. Create a new issue with detailed description
3. Include error logs and steps to reproduce

---

**Built with ❤️ using React, Express.js, and Material-UI**