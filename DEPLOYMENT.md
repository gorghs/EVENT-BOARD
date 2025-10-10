# Deployment Guide

## Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Development Mode (set to false for production)
ALLOW_DEV_LOGIN=false

# CORS Configuration (set to your frontend domain)
CLIENT_ORIGIN=https://your-frontend-domain.com

# Firebase Configuration (for production)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com

# Third-Party API Keys (Optional)
TICKETMASTER_API_KEY=your-ticketmaster-api-key
GITHUB_API_BASE=https://api.github.com/repos/expressjs/express/issues?per_page=10

# Webhook Configuration
WEBHOOK_SECRET=your-webhook-secret-key
```

## Frontend Deployment (Netlify/Vercel)

1. **Build the frontend**:
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Netlify**:
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Add environment variable: `REACT_APP_API_URL=https://your-backend-domain.com`

3. **Deploy to Vercel**:
   ```bash
   cd client
   npx vercel --prod
   ```

## Backend Deployment (Railway/Render/Fly)

### Railway
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Render
1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

### Fly.io
```bash
cd server
fly launch
fly deploy
```

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Set `ALLOW_DEV_LOGIN=false`
- [ ] Configure proper `CLIENT_ORIGIN`
- [ ] Set strong `JWT_SECRET`
- [ ] Configure Firebase credentials
- [ ] Set `WEBHOOK_SECRET`
- [ ] Enable HTTPS
- [ ] Set up monitoring/logging
- [ ] Configure domain names
- [ ] Test all endpoints
- [ ] Run tests in production environment

## Health Check

Your deployed backend should respond to:
```
GET https://your-backend-domain.com/healthz
```

Expected response: `OK`
