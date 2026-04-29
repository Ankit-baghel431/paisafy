# Paisafy – Track, Save, Grow 🚀

## 📌 Project Overview
**Paisafy** is an industry-level Personal Finance Management Web Application designed to help users track income, manage expenses, and receive AI-driven financial advice. This project demonstrates a complete microservices architecture, integrating modern web technologies with AI/ML capabilities.

## 🏗 Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React.js (Vite), Tailwind CSS, Redux Toolkit, React Router, Recharts |
| **Backend** | Spring Boot, Spring Security (JWT), Spring Data MongoDB, JavaMailSender |
| **AI Service** | Python, FastAPI |
| **Database** | MongoDB |
| **DevOps** | Docker, Docker Compose, GitHub Actions |

## 📂 Project Structure
- `backend/` - Spring Boot Application (APIs, Auth, Logic)
- `frontend/` - React Application (UI, Dashboards)
- `ai-service/` - Python Microservice (ML Models, OCR)
- `docs/` - System Documentation & Diagrams

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Java 17+ & Maven
- Node.js 18+
- Python 3.9+

### Running with Docker (Recommended)
```bash
docker-compose up --build
```

### Manual Setup

#### 1. Backend (Spring Boot)
Ensure MongoDB is running locally on port `27017` or update the `application.properties` with your MongoDB URI.
Ensure you have configured your SMTP details for email OTP verification in `application.properties`.
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

#### 2. Frontend (React/Vite)
```bash
cd frontend
npm install
npm run dev
```

#### 3. AI Service (Python)
```bash
cd ai-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## ✨ Core Features
- **Secure Authentication:** JWT-based login, Email OTP Registration, and Forgot Password flow.
- **Transaction Tracking:** Log your income and expenses, complete with custom categories.
- **Budget Management:** Set monthly limits and easily track your spending.
- **Goal Tracking:** Plan and confidently fund your long-term financial goals.
- **AI Advisor:** Get data-driven insights into your financial habits.
