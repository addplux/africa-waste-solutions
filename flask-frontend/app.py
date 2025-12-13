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
        tx_type = request.form.get('transaction_type')
        
        # Determine Source and Target based on transaction type
        source_id = None
        target_id = None

        if tx_type == 'supply':
            source_id = request.form.get('manufacturer_id')
            target_id = None # Production adds to source stock
        elif tx_type == 'transfer':
            source_id = request.form.get('source_id')
            target_id = request.form.get('target_id')
        elif tx_type == 'return':
            source_id = request.form.get('household_id')
            target_id = request.form.get('return_target_id')

        # Clean integer inputs
        def get_int(key):
            try:
                val = request.form.get(key)
                if val and val.strip():
                    return int(val)
            except ValueError:
                pass
            return 0

        data = {
            'transaction_type': tx_type,
            'source_account_id': source_id,
            'target_account_id': target_id,
            'pin': request.form.get('pin'), # Send PIN for verification
            'product_group': request.form.get('product_group'),
            'product_name': request.form.get('product_name'),
            'unit': get_int('qty_unit'),
            'dozen': get_int('qty_dozen'),
            'half_dozen': get_int('qty_half_dozen'),
            'case': get_int('qty_case'),
            'series': get_int('qty_series')
        }

        # Send to Go Backend
        response = api_call('entries', method='POST', data=data)
        
        if response and response.status_code in [200, 201]:
            flash(f'{tx_type.capitalize()} recorded successfully!', 'success')
        else:
            error_msg = 'Failed to submit entry.'
            if response:
                try:
                    error_msg = response.json().get('message', error_msg)
                except:
                    pass
            flash(error_msg, 'error')
            
            
        return redirect(url_for('data_entry'))
    
    # GET Request: Fetch accounts AND recent entries
    accounts_response = api_call('accounts', method='GET')
    entries_response = api_call('entries', method='GET')
    
    manufacturers = []
    distributors = []
    households = []
    recent_entries = []
    account_map = {}
    
    if accounts_response and accounts_response.status_code == 200:
        all_accounts = accounts_response.json().get('data', [])
        for acc in all_accounts:
            account_map[acc['id']] = acc['name']
            a_type = acc.get('account_type', '').lower()
            if a_type == 'manufacturer':
                manufacturers.append(acc)
            elif a_type == 'distributor':
                distributors.append(acc)
            elif a_type == 'household':
                households.append(acc)

    if entries_response and entries_response.status_code == 200:
        recent_entries = entries_response.json().get('data', [])
        # Sort by date desc (simple python sort if backend doesn't sort)
        recent_entries.sort(key=lambda x: x.get('entry_date', ''), reverse=True)
        recent_entries = recent_entries[:10] # Top 10
    
    return render_template('data_entry.html', 
                           user=session.get('user'),
                           manufacturers=manufacturers,
                           distributors=distributors,
                           households=households,
                           recent_entries=recent_entries,
                           account_map=account_map)

@app.route('/entry/reverse/<string:entry_id>', methods=['POST'])
@login_required
def reverse_entry(entry_id):
    response = api_call(f'entries/{entry_id}', method='DELETE')
    if response and response.status_code == 200:
        flash('Transaction reversed successfully.', 'success')
    else:
        flash('Failed to reverse transaction.', 'error')
    return redirect(url_for('data_entry'))

@app.route('/reports')
@login_required
def reports():
    # Fetch stats from Go Backend
    stats = {
        'manufactured': 0,
        'distributed': 0,
        'returned': 0
    }
    
    response = api_call('reports/stats', method='GET')
    if response and response.status_code == 200:
        data = response.json().get('data', {})
        stats['manufactured'] = data.get('manufactured', 0)
        stats['distributed'] = data.get('distributed', 0)
        stats['returned'] = data.get('returned', 0)

    return render_template('reports.html', user=session.get('user'), stats=stats)

@app.route('/kyc')
@login_required
def kyc():
    # TODO: Fetch KYC data from Go backend
    return render_template('kyc.html', user=session.get('user'))

if __name__ == '__main__':
    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(debug=True, port=5000)
