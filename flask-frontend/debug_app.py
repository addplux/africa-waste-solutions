from app import app
from flask import session

# Auto-login as admin for debugging
@app.before_request
def mock_login():
    # Only if not already logged in (optional, but good practice)
    if 'user' not in session:
        session['user'] = {
            'role': 'admin', 
            'name': 'Debug Tester', 
            'id': 'debug-uuid-1234',
            'email': 'debug@test.com'
        }
        session['token'] = 'debug-token'
        session['details_confirmed'] = True

if __name__ == '__main__':
    print("🚀 Starting Debug Server on http://localhost:5001")
    print("🔓 Login is BYPASSED. You can access all pages directly.")
    app.run(debug=True, port=5001)
