# Setting Up Firebase Cloud Functions for ChainRoute AI

## Prerequisites
- Firebase CLI installed (`npm install -g firebase-tools`)
- Logged into Firebase (`firebase login`)
- Access to the `chain-f4e1f` Firebase project

## Steps

### 1. Pull the latest code
Make sure you have the latest code from the repo, including the new files:
- `backend/functions/src/handlers/bank.ts` — Stripe bank/card connection endpoints
- Updated `backend/functions/src/index.ts` — registers the new routes

### 2. Install backend dependencies
```bash
cd backend/functions
npm install
```
This installs all dependencies including the `stripe` package.

### 3. Set the Stripe secret key
From the project root (`macathon/`):
```bash
firebase functions:secrets:set STRIPE_SECRET_KEY
```
When prompted, paste the Stripe test API key (ask the team for it — do not commit it to the repo).

### 4. Set the frontend URL
```bash
firebase functions:secrets:set FRONTEND_URL
```
When prompted, paste the frontend URL. If using Firebase Hosting:
```
https://chain-f4e1f.web.app
```
If running locally:
```
http://localhost:5173
```

### 5. Update the backend code to use the secret
In `backend/functions/src/handlers/bank.ts`, the Stripe key is read from `process.env.STRIPE_SECRET_KEY`. If using Firebase secrets (v2), make sure the function export in `backend/functions/src/index.ts` references the secret. For Firebase Functions v1 with `functions.config()`, you may instead run:
```bash
firebase functions:config:set stripe.secret="PASTE_STRIPE_TEST_KEY_HERE"
firebase functions:config:set frontend.url="https://chain-f4e1f.web.app"
```
Then update `bank.ts` to read from config:
```typescript
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || functions.config().stripe?.secret || '');
const FRONTEND_URL = process.env.FRONTEND_URL || functions.config().frontend?.url || 'http://localhost:5173';
```

### 6. Build the backend
```bash
cd backend/functions
npm run build
```
Verify there are no TypeScript errors.

### 7. Deploy
From the project root:
```bash
firebase deploy --only functions
```

### 8. Verify deployment
After deployment, the API will be live at:
```
https://us-central1-chain-f4e1f.cloudfunctions.net/api
```

Test it by hitting:
```
curl https://us-central1-chain-f4e1f.cloudfunctions.net/api/bank/status
```
You should get a `401 Unauthorized` response (because no auth token was provided), which confirms the endpoint exists.

### 9. Update the frontend
In `frontend/.env`, update the API base URL to point to the deployed function:
```
VITE_API_BASE_URL=https://us-central1-chain-f4e1f.cloudfunctions.net
```

## New API Endpoints Added

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/bank/link` | Creates a Stripe Checkout Session in setup mode. Returns `{ url, sessionId }`. Redirect the user to `url` to enter card details on Stripe. |
| GET | `/api/bank/status` | Checks if user has a connected card. Optional `?session_id=` to verify a just-completed checkout. Returns `{ connected, account? }`. |
| POST | `/api/bank/disconnect` | Detaches all card payment methods and clears Firestore fields. Returns `{ success }`. |

## How It Works
1. User clicks "Connect Card via Stripe" on the frontend
2. Frontend calls `POST /api/bank/link` → gets a Stripe Checkout URL
3. User is redirected to Stripe's hosted page to enter their real card details
4. After completing, Stripe redirects back to `/connect-bank?session_id=cs_xxx`
5. Frontend calls `GET /api/bank/status?session_id=cs_xxx` to verify
6. Backend reads the saved payment method from Stripe, stores card brand + last4 in Firestore
7. Frontend displays the connected card info
