# Flask Frontend - Africa Waste Solutions

A Python Flask frontend for the Africa Waste Solutions waste management platform.

## Features

- Beautiful split-screen login with certification badges
- Multi-step account creation with KYC verification
- Webcam integration for selfie capture
- Dashboard with statistics and quick actions
- Responsive design with Tailwind CSS
- Integration with Go backend APIs

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
python app.py
```

3. Access the application at `http://localhost:5000`

## Configuration

Edit `config.py` to configure:
- Backend API URL (default: `http://localhost:8080/api/v1`)
- Secret key for sessions
- Upload folder settings
- Maximum file size

## Project Structure

```
flask-frontend/
├── app.py                 # Main Flask application
├── config.py              # Configuration settings
├── requirements.txt       # Python dependencies
├── static/
│   ├── css/
│   │   └── custom.css    # Custom styles
│   ├── js/
│   │   └── main.js       # JavaScript utilities
│   └── uploads/          # Uploaded files
└── templates/
    ├── base.html         # Base template
    ├── login.html        # Login page
    ├── account_creation.html  # Account creation
    ├── dashboard.html    # Dashboard
    └── components/
        └── sidebar.html  # Sidebar component
```

## Pages

- `/` - Redirects to dashboard or login
- `/login` - Login page
- `/logout` - Logout
- `/account-creation` - Account creation with KYC
- `/dashboard` - Main dashboard
- `/accounts` - Account management
- `/data-entry` - Data entry form
- `/reports` - Reports and analytics
- `/kyc` - KYC verification

## Integration with Go Backend

The Flask app acts as a proxy to the Go backend API. All API calls are made through the `api_call()` function in `app.py`, which:
- Adds authentication headers
- Forwards requests to the Go backend
- Handles responses and errors

## Development

Run in debug mode:
```bash
python app.py
```

The app will run on port 5000 by default.
