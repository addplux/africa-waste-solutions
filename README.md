# Africa Waste Solutions

A modern waste management and tracking platform built with a hybrid **Go** (Backend) + **Python** (AI/Data) + **React** (Frontend) stack.

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS (Green/Purple Theme), React Router, Formik.
- **Backend**: Go (Golang) - *Pending Initialization*.
- **AI/Data Service**: Python (Flask, ReportLab) - For Generating PDF Reports and Analytics.

## Project Structure
- `/frontend`: React SPA (Single Page Application).
- `/backend`: Go API Server (To be initialized).
- `/ai-service`: Python Flask Microservice.

## Getting Started

### Prerequisites
- Node.js & npm (Verified v20+)
- Python 3.10+
- Go 1.21+ (Please install if missing)

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Access the UI at `http://localhost:5173`.

### 2. AI Service Setup
```bash
cd ai-service
python -m venv venv
# Windows:
.\venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
Service runs at `http://localhost:5000`.

### 3. Backend Setup
*Creating the backend requires Go to be installed.*
```bash
cd backend
go mod tidy
go run main.go
```

## Features
- **Dashboard**: Overview of waste monitoring objectives.
- **KYC Verification**: Identity verification with document upload and selfie capture.
- **Data Entry**: Dynamic forms for tracking Package Supply vs Waste Returns.
- **Reports**: Generate and export PDF summaries of waste impact.
