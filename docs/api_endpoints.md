# API Endpoints (Draft)

## Authentication (`/api/auth`)
- `POST /register`: Create new user.
- `POST /login`: Authenticate and get JWT.
- `POST /refresh`: Refresh access token.

## Transactions (`/api/transactions`)
- `GET /`: Get all transactions (with pagination & filters).
- `POST /`: Add new transaction.
- `GET /{id}`: Get details.
- `PUT /{id}`: Update transaction.
- `DELETE /{id}`: Delete transaction.
- `POST /upload`: Upload bill image for scanning.

## Budgets (`/api/budgets`)
- `GET /`: Get current month budgets.
- `POST /`: Set budget for category.

## Goals (`/api/goals`)
- `GET /`: List all goals.
- `POST /`: Create new goal.
- `PUT /{id}/add-funds`: Add money to goal.

## Analytics (`/api/analytics`)
- `GET /summary`: Monthly summary (Income vs Expense).
- `GET /category-split`: Category-wise expense distribution.

## AI Service (`/api/ai` - Proxy to Python Service)
- `POST /predict-category`: specific endpoint to guess category from text.
- `POST /consult-advisor`: Chatbot interface.
