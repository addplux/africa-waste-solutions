# Africa Waste Solutions

A modern waste management and tracking platform built with **Go** (Backend) + **Python** (Flask Frontend & AI Service).

## Tech Stack
- **Frontend**: Python Flask with Jinja2 templates, Tailwind CSS (Navy Blue Theme), Chart.js
- **Backend**: Go (Golang) REST API
- **AI/Data Service**: Python Flask Microservice for PDF Reports and Analytics

## Project Structure
- `/flask-frontend`: Flask web application with Jinja2 templates
- `/backend`: Go API Server
- `/ai-service`: Python Flask Microservice

## Getting Started

### Prerequisites
- Python 3.10+
- Go 1.21+

### 1. Frontend Setup (Flask)
```bash
cd flask-frontend
pip install Flask requests python-dotenv
python app.py
```
Access the UI at `http://localhost:5000`.

**Pages Available:**
- Login: `/login`
- Account Creation: `/account-creation`
- Dashboard: `/dashboard`
- Data Entry: `/data-entry`
- Accounts: `/accounts`
- Reports: `/reports`
- KYC Verification: `/kyc`

### 2. Backend Setup
```bash
cd backend
go mod tidy
go run main.go
```
API runs at `http://localhost:8080`.

### 3. AI Service Setup
```bash
cd ai-service
python -m venv venv
# Windows:
.\venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
Service runs at `http://localhost:5001`.

## Features
- **Dashboard**: Overview of waste monitoring with real-time statistics
- **KYC Verification**: Identity verification with document upload and webcam selfie capture
- **Data Entry**: Track waste collection by type (Plastic, Organic, Metal, Paper, Glass, E-Waste, Hazardous, Mixed)
- **Accounts Management**: Manage consumer and business accounts with search and filters
- **Reports & Analytics**: Interactive charts showing collection trends, waste distribution, and geographic analysis
- **Navy Blue Design**: Modern, professional UI with Tailwind CSS

## Architecture
- **Frontend**: Flask serves Jinja2 templates with Tailwind CSS for styling
- **Backend**: Go REST API handles business logic and database operations
- **AI Service**: Python microservice for advanced analytics and PDF generation
- **Integration**: Flask frontend proxies API calls to Go backend

## Development
The Flask frontend runs independently on port 5000 and communicates with the Go backend on port 8080 via REST API calls.
