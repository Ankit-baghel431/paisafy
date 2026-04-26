# Database Schema Design (PostgreSQL)

## ER Diagram

```mermaid
erDiagram
    USERS ||--o{ TRANSACTIONS : has
    USERS ||--o{ BUDGETS : sets
    USERS ||--o{ GOALS : creates
    
    USERS {
        bigint id PK
        string username
        string email
        string password_hash
        string role
        timestamp created_at
    }

    TRANSACTIONS {
        bigint id PK
        bigint user_id FK
        decimal amount
        enum type "CREDIT, DEBIT"
        string category
        string description
        date transaction_date
        string receipt_url
    }

    BUDGETS {
        bigint id PK
        bigint user_id FK
        string category
        decimal limit_amount
        int month
        int year
    }

    GOALS {
        bigint id PK
        bigint user_id FK
        string name
        decimal target_amount
        decimal current_amount
        date deadline
        boolean is_completed
    }
```

## Tables Description
- **users**: Stores user credentials and profile info.
- **transactions**: core table for all income and expenses.
- **budgets**: Monthly spending limits per category.
- **goals**: Savings targets for specific items (e.g., "Buy Laptop").
