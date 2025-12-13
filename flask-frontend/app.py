from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
import requests
from config import Config
import os
from werkzeug.utils import secure_filename
from functools import wraps

app = Flask(__name__)
app.config.from_object(Config)

# Helper function to check if user is logged in
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# Helper function to make API calls to Go backend
def api_call(endpoint, method='GET', data=None, files=None):
    url = f"{app.config['BACKEND_API_URL']}/{endpoint}"
    headers = {}
    
    if 'token' in session:
        headers['Authorization'] = f"Bearer {session['token']}"
    
    try:
        if method == 'GET':
            response = requests.get(url, headers=headers)
        elif method == 'POST':
            if files:
                response = requests.post(url, data=data, files=files, headers=headers)
            else:
                response = requests.post(url, json=data, headers=headers)
        elif method == 'PUT':
            response = requests.put(url, json=data, headers=headers)
        elif method == 'DELETE':
            response = requests.delete(url, headers=headers)
        
        return response
    except requests.exceptions.RequestException as e:
        print(f"API call error: {e}")
        return None

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Routes
@app.route('/')
def index():
    if 'user' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        remember = request.form.get('remember')
        
        # TODO: Call Go backend authentication API
        # For now, simulate login
        session['user'] = {'name': 'Admin', 'email': email}
        session['token'] = 'dummy-token'  # Replace with actual token from backend
        
        flash('Login successful!', 'success')
        return redirect(url_for('dashboard'))
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out.', 'info')
    return redirect(url_for('login'))

@app.route('/account-creation', methods=['GET', 'POST'])
def account_creation():
    if request.method == 'POST':
        # Handle form submission
        step = request.form.get('step', '1')
        
        if step == '3':  # Final step with KYC
            # Handle file uploads
            id_file = request.files.get('id_document')
            selfie_file = request.files.get('selfie')
            
            # Map form data to backend JSON structure
            is_international = (request.form.get('companyType') == 'international')
            
            data = {
                'name': request.form.get('fullName'),
                'email': request.form.get('email'),
                'password': request.form.get('password'),
                'contact': request.form.get('contact'),
                'plot_number': request.form.get('plotNumber'),
                'area': request.form.get('area'),
                'account_type': request.form.get('accountType'),
                'is_international': is_international,
                'kyc_status': 'pending'
            }

            # Upload files if present
            # Note: For now we just save locally. In production, we'd send these to backend or S3
            if id_file and allowed_file(id_file.filename):
                id_filename = secure_filename(id_file.filename)
                id_file.save(os.path.join(app.config['UPLOAD_FOLDER'], id_filename))
            
            if selfie_file and allowed_file(selfie_file.filename):
                selfie_filename = secure_filename(selfie_file.filename)
                selfie_file.save(os.path.join(app.config['UPLOAD_FOLDER'], selfie_filename))
            
            # Send to Go Backend Auth Register Endpoint
            # This creates both User and Account
            response = api_call('auth/register', method='POST', data=data)
            
            if response and response.status_code in [200, 201]:
                flash('Account created successfully! Please login.', 'success')
                return redirect(url_for('login'))
            else:
                error_msg = 'Failed to create account.'
                if response:
                    try:
                        error_msg = response.json().get('message', error_msg)
                    except:
                        pass
                flash(error_msg, 'error')
                return redirect(url_for('account_creation'))
    
    return render_template('account_creation.html')

@app.route('/dashboard')
@login_required
def dashboard():
    # TODO: Fetch dashboard data from Go backend
    return render_template('dashboard.html', user=session.get('user'))

@app.route('/accounts')
@login_required
def accounts():
    # TODO: Fetch accounts data from Go backend
    return render_template('accounts.html', user=session.get('user'))

@app.route('/data-entry', methods=['GET', 'POST'])
@login_required
def data_entry():
    if request.method == 'POST':
        # Extract basic info
        data = {
            'account_id': request.form.get('account_id'),
            'product_group': request.form.get('product_group'),
            'product_name': request.form.get('product_name'),
            'package_levels': {},
            'waste_levels': {}
        }

        # Matrix keys
        keys = ['series0', 'level4', 'level6', 'level10', 'level12', 'level16']

        # Construct JSON for levels
        for key in keys:
            # Supply (Package Levels)
            supply_val = request.form.get(f'supply_{key}')
            if supply_val and supply_val.strip() != '':
                data['package_levels'][key] = int(supply_val)
            
            # Waste (Disposal Levels)
            waste_val = request.form.get(f'waste_{key}')
            if waste_val and waste_val.strip() != '':
                data['waste_levels'][key] = int(waste_val)

        # Send to Go Backend
        response = api_call('entries', method='POST', data=data)
        
        if response and response.status_code in [200, 201]:
            flash('Data entry submitted successfully!', 'success')
        else:
            flash('Failed to submit data. Please try again.', 'error')
            
        return redirect(url_for('data_entry'))
    
    return render_template('data_entry.html', user=session.get('user'))

@app.route('/reports')
@login_required
def reports():
    # TODO: Fetch reports data from Go backend
    return render_template('reports.html', user=session.get('user'))

@app.route('/kyc')
@login_required
def kyc():
    # TODO: Fetch KYC data from Go backend
    return render_template('kyc.html', user=session.get('user'))

if __name__ == '__main__':
    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(debug=True, port=5000)
