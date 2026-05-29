# Ledger Backend API

A secure and scalable **ledger-based wallet backend system** built using **Node.js**, **Express.js**, **MongoDB**, and **Mongoose Transactions**.

This project demonstrates how modern fintech systems process money transfers using:

* Double-entry bookkeeping
* Ledger-based balance calculation
* MongoDB ACID transactions
* Idempotent transaction handling
* Transaction states (`PENDING`, `COMPLETED`, `FAILED`, `REVERSED`)
* Email notifications
* Account management APIs

---

# Features

## Account Management

* Create user accounts
* Fetch all user accounts
* Get real-time account balance

## Transaction System

* Secure fund transfers
* Initial funding transactions
* Atomic MongoDB transactions
* Double-entry ledger accounting
* Idempotency key support
* Transaction status tracking

## Ledger Architecture

Balances are never stored directly.

Instead, balances are derived from ledger entries:

* `CREDIT` → adds funds
* `DEBIT` → subtracts funds

This ensures:

* Auditability
* Financial consistency
* Easy reconciliation
* Immutable transaction history

---

# Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* Nodemailer
* JWT Authentication

---

# Project Structure

```bash
src/
│
├── controllers/
│   ├── account.controller.js
│   └── transaction.controller.js
│
├── models/
│   ├── account.model.js
│   ├── ledger.model.js
│   └── transaction.model.js
│
├── services/
│   └── email.service.js
│
├── routes/
│
├── middlewares/
│
└── app.js
```

---

# Transaction Flow

The transfer system follows a robust 10-step transaction lifecycle.

## Transfer Lifecycle

1. Validate request
2. Validate idempotency key
3. Check account status
4. Derive sender balance from ledger
5. Create transaction (`PENDING`)
6. Create `DEBIT` ledger entry
7. Create `CREDIT` ledger entry
8. Mark transaction `COMPLETED`
9. Commit MongoDB session
10. Send email notification

---

# API Endpoints

# Accounts

## Create Account

```http
POST /accounts
```

### Response

```json
{
  "account": {
    "_id": "6651f2...",
    "user": "6649aa..."
  }
}
```

---

## Get User Accounts

```http
GET /accounts
```

---

## Get Account Balance

```http
GET /accounts/:accountId/balance
```

### Response

```json
{
  "accountId": "6651f2...",
  "balance": 5000
}
```

---

# Transactions

## Create Transaction

```http
POST /transactions
```

### Request Body

```json
{
  "fromAccount": "6651...",
  "toAccount": "6652...",
  "amount": 1000,
  "idempotencyKey": "txn-12345"
}
```

### Response

```json
{
  "message": "Transaction completed successfully",
  "transaction": {
    "_id": "txn123",
    "status": "COMPLETED"
  }
}
```

---

## Create Initial Funds Transaction

```http
POST /transactions/initial-funds
```

Used for:

* Testing
* Wallet seeding
* Admin funding

---

# Idempotency

To prevent duplicate transfers, every transaction requires a unique:

```json
"idempotencyKey"
```

If the same request is retried:

* Completed transactions return existing results
* Pending transactions return processing status
* Failed/reversed transactions request retry

---

# MongoDB Transactions

This project uses MongoDB sessions to guarantee atomicity.

```js
const session = await mongoose.startSession();
session.startTransaction();
```

If any operation fails:

* All ledger writes rollback
* Transaction state remains consistent

---

# Ledger Example

Suppose User A sends ₹1000 to User B.

## Ledger Entries

| Account | Type   | Amount |
| ------- | ------ | ------ |
| User A  | DEBIT  | 1000   |
| User B  | CREDIT | 1000   |

Balances are calculated dynamically from these entries.

---

# Installation

## Clone Repository

```bash
git clone https://github.com/TanviLokhande06/Backend-Ledger.git
```

## Install Dependencies

```bash
npm install
```

## Configure Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

## Start Development Server

```bash
npm run dev
```

---

# Security Considerations

* Idempotent transaction processing
* ACID-compliant database transactions
* Ownership validation
* Account status verification
* Balance verification before debit
* Immutable ledger history

---

# Future Improvements

* Redis distributed locking
* Transaction queues
* Retry workers
* Rate limiting
* Webhooks
* Multi-currency support
* Fraud detection
* Admin dashboard
* Kafka event streaming
* Real-time notifications

---

# Learning Goals

This project is ideal for learning:

* Fintech backend architecture
* Double-entry accounting systems
* MongoDB transactions
* Distributed systems basics
* Idempotent APIs
* Financial consistency patterns

---

# License

MIT License

---

# Author

Built with ❤️ using Node.js and MongoDB.
