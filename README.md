# EventBoard

This is a full-stack event management application built with Express.js, PostgreSQL, and plain JavaScript/HTML/CSS.

## Project Structure

```
/EventBoard
├── client/                     # Frontend: HTML/CSS/JS
│   ├── index.html              # My Events View
│   ├── discover.html           # Public Events View
│   ├── login.html              # Login Page
│   ├── assets/
│   │   ├── css/style.css
│   │   └── js/
│   │       ├── config.js
│   │       └── main.js
├── server/                     # Backend: Node.js/Express/PostgreSQL
│   ├── config/                 # Environment setup, DB connection (e.g., db.js)
│   │   └── db.js
│   ├── db/                     # Database schemas/migrations (SQL scripts)
│   │   └── create_tables.sql
│   ├── controllers/            # Business logic (Event, Auth, Webhook)
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── publicEventAdapter.js
│   │   └── webhookController.js
│   ├── middleware/             # Express middleware (Auth, Validation, Rate Limiting)
│   │   ├── authMiddleware.js
│   │   └── validationMiddleware.js
│   ├── routes/                 # API routes definition
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   └── webhookRoutes.js
│   ├── utils/                  # Helper functions (e.g., webhookSignature.js)
│   │   └── webhookSignature.js
│   ├── tests/                  # API tests (using Jest/Supertest)
│   │   └── event.test.js
│   ├── .env                    # Environment variables
│   ├── package.json
│   └── index.js                # Main server entry point
├── .gitignore
├── README.md
└── package.json
```

## Getting Started

### Prerequisites

*   Node.js
*   PostgreSQL

### Installation

1.  Clone the repository.
2.  Install root dependencies: `npm install`
3.  Install server dependencies: `cd server && npm install`
4.  Set up your PostgreSQL database and update the `PG_URI` in `server/.env`.
5.  Start the server: `node server/index.js`
6.  Open `client/index.html` in your browser.

## Webhook Demo

To simulate an external event update via webhook, you can use the following `curl` command. Make sure to replace the placeholder values.

```bash
# Set variables in your Linux shell before generating the signature
WEBHOOK_SECRET="SECRET_FOR_SIGNATURE_VERIFICATION"
API_BASE="YOUR_LIVE_BACKEND_URL"

# 1. Define the payload (use an event ID you create in the demo!)
BODY='{"event_id": 42, "new_status": "published", "delivery_id": "abc-123-$(uuidgen)"}'

# 2. Calculate the signature
SIG=$(echo -n $BODY | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" -binary | xxd -p -c 256)

# 3. Full curl command
echo "curl -X POST ${API_BASE}/webhooks/external-events \
-H \"Content-Type: application/json\" \
-H \"X-External-Signature: sha256:${SIG}\" \
-d \"${BODY}\""
```
