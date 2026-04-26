# System Architecture

## Overview
Paisafy uses a microservices-inspired layered architecture. The frontend communicates with the backend via REST APIs. The AI Service is a separate microservice handling ML tasks.

## High-Level Architecture Diagram

```mermaid
graph TD
    User((User))
    
    subgraph Client
        Web["Web App (React + Redux)"]
    end
    
    subgraph API_Gateway_Layer
        Nginx["API Gateway / Nginx (Optional)"]
    end
    
    subgraph Backend_Services
        Auth["Auth Service (Spring Boot)"]
        Core["Core Banking Service (Spring Boot)"]
        Budget["Budget Service (Spring Boot)"]
    end
    
    subgraph AI_Layer
        AISVC["AI Service (FastAPI)"]
        OCR["OCR Engine (Tesseract)"]
        ML["ML Model (Scikit-learn)"]
    end
    
    subgraph Data_Layer
        DB[(PostgreSQL)]
        Cache[(Redis)]
    end

    User --> Web
    Web --> Nginx
    Nginx --> Auth
    Nginx --> Core
    
    Auth --> DB
    Core --> DB
    Core --> Cache
    
    Core -- REST/GRPC --> AISVC
    AISVC --> OCR
    AISVC --> ML
```

## Component Details
1. **Frontend**: React Single Page Application (SPA).
2. **Backend**: monolithic Spring Boot application modularized internally (or microservices if scaled).
3. **AI Service**: Python FastAPI for specialized ML tasks.
4. **Database**: PostgreSQL for transactional data.
5. **Cache**: Redis for session storage and frequent data caching.
