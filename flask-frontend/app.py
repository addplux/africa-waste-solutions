from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
import requests
from config import Config
import os
from werkzeug.utils import secure_filename
from functools import wraps

from datetime import datetime

app = Flask(__name__)
app.config.from_object(Config)

# Initialize CSRF protection
try:
    from flask_wtf.csrf import CSRFProtect, generate_csrf
    csrf = CSRFProtect(app)
    
    @app.context_processor
    def inject_csrf():
        return dict(csrf_token=generate_csrf)
except ImportError:
    print("Warning: Flask-WTF not available, CSRF protection disabled")
    csrf = None
    @app.context_processor
    def inject_csrf_token():
        return dict(csrf_token=lambda: '')

# Helper function to check if user is logged in
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# Helper function to check if user is admin
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session or session['user'].get('role') != 'admin':
            flash('Access denied. Admin privileges required.', 'error')
            return redirect(url_for('dashboard'))
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

@app.route('/objectives')
def objectives():
    return render_template('objectives.html')

@app.route('/safety-protocols')
def safety_protocols():
    return render_template('safety_protocols.html')

@app.route('/separation-guide')
def separation_guide():
    return render_template('separation_guide.html')

# Routes
@app.route('/')
def index():
    if 'user' in session:
        return redirect(url_for('dashboard'))
    
    # Fetch monitored products for the landing page
    products = []
    response = api_call('products', method='GET')
    if response and response.status_code == 200:
        products = response.json().get('data', [])
        
    return render_template('landing.html', products=products)

@app.route('/monitored-items')
def monitored_items():
    # Fetch monitored products for the dedicated page
    products = []
    response = api_call('products', method='GET')
    if response and response.status_code == 200:
        products = response.json().get('data', [])
        
    return render_template('monitored_items.html', products=products)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        remember = request.form.get('remember')
        
        # Call Go backend authentication API
        response = api_call('auth/login', method='POST', data={'email': email, 'password': password})
        
        if response and response.status_code == 200:
            data = response.json()
            session['user'] = data['user']
            session['token'] = data['token']
            session['login_time'] = datetime.now().strftime("%I:%M %p, %d %b %Y")
            session['details_confirmed'] = False # Reset confirmation on login
            flash(f"Welcome back, {session['user']['name']}!", 'success')
            
            # If user is admin, skip confirmation or go to dashboard
            if session['user'].get('role') == 'admin':
                return redirect(url_for('dashboard'))
            return redirect(url_for('confirm_details'))
        else:
            flash('Invalid email or password', 'error')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out.', 'info')
    return redirect(url_for('login'))

@app.route('/confirm-details', methods=['GET', 'POST'])
@login_required
def confirm_details():
    if request.method == 'POST':
        session['details_confirmed'] = True
        return redirect(url_for('dashboard'))
    
    # In a real app we might fetch the latest account details here
    # For now we'll use session data or mock it if needed
    user = session.get('user', {})
    
    # We need account details specifically for households
    # The 'user' object might not have everything, let's try to get account stats or similar
    account_details = {
        'name': user.get('name'),
        'area': user.get('area', 'Unknown Location'),
        'plot_number': user.get('plot_number', 'N/A'),
        'contact': user.get('contact', 'N/A')
    }

    # If backend has an endpoint for account details, we should use it
    # Looking at the codebase, stats/profile might have it
    response = api_call('auth/stats', method='GET')
    if response and response.status_code == 200:
        data = response.json().get('data', {})
        # Assuming the backend returns account info in the stats data
        # Let's enrich what we have
        account_details.update({
            'area': data.get('area', account_details['area']),
            'plot_number': data.get('plot_number', account_details['plot_number']),
            'contact': data.get('contact', account_details['contact']),
            'name': data.get('name', account_details['name'])
        })

    return render_template('confirm_details.html', user=user, details=account_details)

@app.route('/account-creation', methods=['GET', 'POST'])
def account_creation():
    if request.method == 'POST':
        # Handle form submission
        step = request.form.get('step', '1')
        
        if step == '3':  # Final step with KYC
            # Handle file uploads
            id_file = request.files.get('id_document')
            selfie_file = request.files.get('selfie') # Might be coming as form data if base64
            
            print(f"[DEBUG] KYC Upload: ID File={id_file.filename if id_file else 'None'}, Selfie={'Received' if request.form.get('selfie') else 'None'}")
            
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
                'company_name': request.form.get('companyName'),
                'date_of_birth': request.form.get('dateOfBirth'),
                'selfie': request.form.get('selfie'), # Base64 string from canvas
                'is_international': str(is_international).lower(),
                'kyc_status': 'pending'
            }

            print(f"[DEBUG] Form Data for Backend: { {k: v for k, v in data.items() if k != 'password'} }")
            
            # Prepare files for upload
            files = {}
            if id_file:
                # We need to send the file object, but requests.post expects (filename, file_handle, content_type)
                # or just the file handle.
                # Since we are forwarding, we can pass the stream.
                files['id_document'] = (id_file.filename, id_file.stream, id_file.mimetype)

            # Send to Go Backend Auth Register Endpoint
            # This creates both User and Account
            print(f"[DEBUG] Forwarding to Backend API: {app.config['BACKEND_API_URL']}/auth/register")
            response = api_call('auth/register', method='POST', data=data, files=files)
            
            if response is not None:
                print(f"[DEBUG] Backend Response Status: {response.status_code}")
                if response.status_code not in [200, 201]:
                    print(f"[DEBUG] Backend Error Body: {response.text}")
            else:
                print("[DEBUG] Backend API call returned None")

            if response and response.status_code in [200, 201]:
                resp_data = response.json()
                # Check for token and auto-login
                if 'token' in resp_data:
                    session['user'] = resp_data['user']
                    session['token'] = resp_data['token']
                    session['login_time'] = datetime.now().strftime("%I:%M %p, %d %b %Y")  # Store formatted login time
                    flash(f"Account created! Welcome, {session['user']['name']}.", 'success')
                    return redirect(url_for('dashboard'))
                else:
                    flash('Account created successfully! Please login.', 'success')
                    return redirect(url_for('login'))
            else:
                error_msg = 'Failed to create account.'
                if response:
                    try:
                        resp_json = response.json()
                        error_msg = resp_json.get('message', error_msg)
                        if 'error' in resp_json and not resp_json.get('message'):
                            error_msg = resp_json.get('error')
                    except:
                        # If not JSON, use the status text or first 100 chars of body
                        error_msg = f"Backend Error ({response.status_code}): {response.text[:100]}"
                flash(error_msg, 'error')
                return redirect(url_for('account_creation'))

    
    return render_template('account_creation.html')

@app.route('/dashboard')
@login_required
def dashboard():
    if session.get('user', {}).get('role') != 'admin' and not session.get('details_confirmed'):
        return redirect(url_for('confirm_details'))

    # Fetch personalized stats from Go Backend (for all users)
    user_stats = {
        'supply_received': 0,
        'distributed': 0,
        'returned': 0,
        'kyc_status': 'unknown',
        'account_type': 'consumer',
        'balance': 0
    }
    
    response = api_call('auth/stats', method='GET')
    if response and response.status_code == 200:
        try:
            user_stats.update(response.json().get('data', {}))
        except (ValueError, AttributeError):
            print("[ERROR] Dashboard - Failed to parse user stats JSON")

    # ADMIN SPECIFIC REAL-TIME DATA
    admin_stats = {}
    recent_activity = []
    recent_accounts = []

    if session.get('user', {}).get('role') == 'admin':
        # 1. Fetch Report Stats for "Global Recovery" and "Distributed"
        rep_resp = api_call('reports/stats', method='GET')
        rep_data = {}
        if rep_resp and rep_resp.status_code == 200:
            try:
                rep_data = rep_resp.json().get('data', {})
            except (ValueError, AttributeError):
                print("[ERROR] Dashboard - Failed to parse report stats JSON")
        
        # 2. Fetch Accounts for "Total Nodes" and "KYC Queue"
        acc_resp = api_call('accounts', method='GET')
        all_accounts = []
        recent_accounts = []
        if acc_resp and acc_resp.status_code == 200:
            try:
                all_accounts = acc_resp.json().get('data', [])
                # Sort for recent accounts table (Newest first)
                recent_accounts = sorted(all_accounts, key=lambda x: x.get('created_at') or '', reverse=True)[:5]
            except (ValueError, AttributeError, TypeError):
                print("[ERROR] Dashboard - Failed to parse or sort accounts JSON")
        
        # Calculate Admin KPI Stats
        admin_stats['total_accounts'] = len(all_accounts)
        admin_stats['pending_kyc'] = len([a for a in all_accounts if a.get('kyc_status') == 'pending'])
        admin_stats['global_recovery'] = rep_data.get('returned', 0)
        
        # Calculate Node Status (Active / Total)
        active_nodes = len([a for a in all_accounts if a.get('status', 'active') == 'active'])
        if admin_stats['total_accounts'] > 0:
            uptime = (active_nodes / admin_stats['total_accounts']) * 100
            admin_stats['node_status'] = f"{int(uptime)}%"
        else:
            admin_stats['node_status'] = "100%"

        # 3. Build Recent Activity Stream
        # Fetch Entries
        ent_resp = api_call('entries', method='GET')
        all_entries = []
        if ent_resp and ent_resp.status_code == 200:
            try:
                all_entries = ent_resp.json().get('data', [])
            except (ValueError, AttributeError):
                print("[ERROR] Dashboard - Failed to parse entries JSON")

        # Combine Accounts (New Signups) and Entries (Transactions)
        # We need to normalize them to: {type, title, subtitle, time, icon, color}
        
        for acc in all_accounts:
            recent_activity.append({
                'raw_date': acc.get('created_at', ''),
                'title': 'New Account Created',
                'subtitle': f"{acc.get('name', 'Unknown')} • {acc.get('account_type', 'User')} • {acc.get('area', 'N/A')}",
                'icon': 'fa-user-plus',
                'color': 'green'
            })
            
        for ent in all_entries:
            e_type = ent.get('transaction_type', 'log')
            title = "Transaction Logged"
            icon = "fa-exchange-alt"
            color = "blue"
            
            if e_type == 'supply':
                 title = "Production Recorded"
                 icon = "fa-industry"
                 color = "indigo"
            elif e_type == 'return':
                 title = "Waste Recovery"
                 icon = "fa-recycle"
                 color = "green"
            elif e_type == 'transfer':
                 title = "Stock Transfer"
                 icon = "fa-truck"
                 color = "blue"

            qty = ent.get('unit', 0) # Simplified display
            group = ent.get('product_group', 'General')
            
            recent_activity.append({
                'raw_date': ent.get('created_at', ''),
                'title': title,
                'subtitle': f"{group} • {qty} Units",
                'icon': icon,
                'color': color
            })

        # Sort by date descending (newest first)
        recent_activity.sort(key=lambda x: x['raw_date'], reverse=True)
        # Take top 10
        recent_activity = recent_activity[:10]

        # Calculate "Ago" time
        now = datetime.now()
        for item in recent_activity:
            try:
                # Go time format ex: 2024-12-12T10:00:00.000Z
                dt = datetime.strptime(item['raw_date'].split('.')[0], "%Y-%m-%dT%H:%M:%S")
                diff = now - dt
                seconds = diff.total_seconds()
                
                if seconds < 60:
                    item['time_ago'] = "JUST NOW"
                elif seconds < 3600:
                    item['time_ago'] = f"{int(seconds // 60)} MIN AGO"
                elif seconds < 86400:
                    item['time_ago'] = f"{int(seconds // 3600)} HOURS AGO"
                else:
                    item['time_ago'] = f"{int(seconds // 86400)} DAYS AGO"
            except:
                item['time_ago'] = "RECENTLY"

    return render_template('dashboard.html', user=session.get('user'), stats=user_stats, admin_stats=admin_stats, recent_activity=recent_activity, recent_accounts=recent_accounts)

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
            source_id = request.form.get('transfer_source_id')
            target_id = request.form.get('transfer_target_id')
        elif tx_type == 'return':
            source_id = request.form.get('household_id')
            target_id = None # Leaving the market as waste

        # Normalize empty strings to None (for UUID unmarshaling in Go)
        if not source_id or not source_id.strip():
            source_id = None
        if not target_id or not target_id.strip():
            target_id = None

        # Clean integer inputs
        def get_int(key):
            try:
                val = request.form.get(key)
                if val and val.strip():
                    return int(val)
            except (ValueError, TypeError):
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
            'series': get_int('qty_series'),
            'level_16': get_int('qty_level_16'),
            'level_10': get_int('qty_level_10')
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
    all_accounts = [] # Initialize all_accounts to prevent undefined error
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
    
    # Fetch Products
    products = []
    products_response = api_call('products', method='GET')
    if products_response and products_response.status_code == 200:
        products = products_response.json().get('data', [])

    # Identify current user's account if they are not admin
    current_account = None
    if session.get('user', {}).get('role') != 'admin':
        user_id = session.get('user', {}).get('id')
        user_name = session.get('user', {}).get('name')
        user_email = session.get('user', {}).get('email')
        
        for acc in all_accounts:
            # 1. Primary check: Was this account created by this user?
            if acc.get('created_by') == user_id:
                current_account = acc
                break
            # 2. Secondary check: Does the name match exactly?
            if user_name and acc.get('name') == user_name:
                current_account = acc
                break
            # 3. Tertiary check: Does the company name match user name?
            if user_name and acc.get('company_name') == user_name:
                current_account = acc
                break

    return render_template('data_entry.html', 
                           user=session.get('user'),
                           current_account=current_account,
                           manufacturers=manufacturers,
                           distributors=distributors,
                           households=households,
                           recent_entries=recent_entries,
                           account_map=account_map,
                           products=products)

@app.route('/data-transfer', methods=['GET', 'POST'])
@login_required
def data_transfer():
    if request.method == 'POST':
        # Force transaction type to transfer
        tx_type = 'transfer'
        
        source_id = request.form.get('transfer_source_id')
        target_id = request.form.get('transfer_target_id')

        # Normalize empty strings to None
        if not source_id or not source_id.strip():
            source_id = None
        if not target_id or not target_id.strip():
            target_id = None

        # Clean integer inputs
        def get_int(key):
            try:
                val = request.form.get(key)
                if val and val.strip():
                    return int(val)
            except (ValueError, TypeError):
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
            'series': get_int('qty_series'),
            'level_16': get_int('qty_level_16'),
            'level_10': get_int('qty_level_10')
        }

        # Send to Go Backend
        response = api_call('entries', method='POST', data=data)
        
        if response and response.status_code in [200, 201]:
            flash('Dispatch recorded successfully!', 'success')
        else:
            error_msg = 'Failed to submit dispatch.'
            if response:
                try:
                    error_msg = response.json().get('message', error_msg)
                except:
                    pass
            flash(error_msg, 'error')
            
        return redirect(url_for('data_transfer'))
    
    # GET Request: Fetch accounts AND recent entries
    all_accounts = [] 
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
        recent_entries.sort(key=lambda x: x.get('entry_date', ''), reverse=True)
        recent_entries = recent_entries[:10] 
    
    # Fetch Products
    products = []
    products_response = api_call('products', method='GET')
    if products_response and products_response.status_code == 200:
        products = products_response.json().get('data', [])

    # Identify current user's account
    current_account = None
    if session.get('user', {}).get('role') != 'admin':
        user_id = session.get('user', {}).get('id')
        user_name = session.get('user', {}).get('name')
        
        for acc in all_accounts:
            if acc.get('created_by') == user_id:
                current_account = acc
                break
            if user_name and acc.get('name') == user_name:
                current_account = acc
                break
            if user_name and acc.get('company_name') == user_name:
                current_account = acc
                break

    return render_template('data_transfer.html', 
                           user=session.get('user'),
                           current_account=current_account,
                           manufacturers=manufacturers,
                           distributors=distributors,
                           households=households,
                           recent_entries=recent_entries,
                           account_map=account_map,
                           products=products)

@app.route('/my-account')
@login_required
def my_account():
    user = session.get('user', {})
    
    # Reuse logic from confirm_details/stats to get account details
    account_details = {
        'account_type': 'consumer', # Default
        'company_name': None,
        'contact': user.get('contact'),
        'area': user.get('area'),
        'plot_number': user.get('plot_number'),
        'created_at': user.get('created_at'),
        'kyc_status': 'unknown',
        'is_international': False
    }

    # Fetch more details from stats API if possible, or accounts API filtering by ID
    # Stats API is a good place if it returns account info
    response = api_call('auth/stats', method='GET')
    if response and response.status_code == 200:
        data = response.json().get('data', {})
        account_details.update({
            'account_type': data.get('account_type', account_details['account_type']),
            'kyc_status': data.get('kyc_status', account_details['kyc_status']),
             # Mapping other fields if returned by stats, or fallback to user session
            'contact': data.get('contact', account_details['contact']),
            'area': data.get('area', account_details['area']),
            # Add other specific fields if available in stats or consider fetching specific account info
        })
        
        # If stats doesn't return full profile strings (like 'company_name'), we might need to fetch account specific info
        # But 'auth/stats' in backend seems to return limited info based on previous file reads.
        # Let's try to find this user in the 'accounts' list if they are not admin, 
        # although 'accounts' endpoint might be admin-only (it is in app.py).
        # However, for the user to see THEIR OWN info, we might need an endpoint.
        # IF 'accounts' is admin only, we can't use it here easily without logic change or a new backend endpoint.
        # Let's rely on what we have or 'auth/stats'. 
        
        # Actually, looking at 'dashboard' route, 'auth/stats' returns basic stats.
        # The 'confirm_details' route suggests 'auth/stats' returns some profile info.
        # Let's assume 'auth/stats' or session has enough for now, or add a TODO to backend.
        
        # Refinement: Let's check 'accounts' logic in 'data_entry'. 
        # It fetches ALL accounts to find the current user's account.
        # But `accounts` endpoint is likely protected or we are filtering it.
        # In `data_entry` it calls `api_call('accounts', method='GET')`.
        # Taking a look there helps.
        pass

    # Attempt to fetch full account details if possible (reusing logic from data_entry to find self)
    # Note: If 'accounts' endpoint is restricted to admins in backend, this fails. 
    # But in 'data_entry' it is used by non-admins? 
    # 'data_entry' route calls `api_call('accounts', method='GET')`. 
    # Let's try to get full details from there.
    if user.get('role') != 'admin':
         acc_resp = api_call('accounts', method='GET')
         if acc_resp and acc_resp.status_code == 200:
             all_accs = acc_resp.json().get('data', [])
             user_id = user.get('id')
             for acc in all_accs:
                 if acc.get('created_by') == user_id or acc.get('email') == user.get('email'): # Email might not be in account
                     # Match found
                     account_details.update(acc)
                     break
    
    return render_template('my_account.html', user=user, account=account_details)

@app.route('/accounts')
@login_required
@admin_required
def accounts():
    # Fetch all accounts from backend
    response = api_call('accounts', method='GET')
    accounts_list = []
    
    if response and response.status_code == 200:
        data = response.json()
        accounts_list = data.get('data', [])
    
    # Calculate stats
    stats = {
        'total': len(accounts_list),
        'active': len([a for a in accounts_list if a.get('status') == 'active']),
        'pending_kyc': len([a for a in accounts_list if a.get('kyc_status') == 'pending']),
        'suspended': len([a for a in accounts_list if a.get('status') == 'suspended'])
    }
    
    return render_template('accounts.html', user=session.get('user'), accounts=accounts_list, stats=stats)

@app.route('/account/block/<string:account_id>', methods=['POST'])
@login_required
@admin_required
def block_account(account_id):
    response = api_call(f'accounts/{account_id}/block', method='POST')
    if response and response.status_code == 200:
        flash('Account blocked successfully.', 'success')
    else:
        error_msg = 'Failed to block account.'
        if response:
            try:
                error_msg = response.json().get('message', error_msg)
            except:
                pass
        flash(error_msg, 'error')
    return redirect(url_for('accounts'))

@app.route('/admin/account/create', methods=['GET', 'POST'])
@login_required
@admin_required
def admin_create_account():
    try:
        if request.method == 'POST':
            try:
                # Collect form data
                account_type = request.form.get('account_type')
                company_name = request.form.get('company_name', '')
                full_name = request.form.get('full_name')
                date_of_birth = request.form.get('date_of_birth')
                email = request.form.get('email')
                password = request.form.get('password')
                contact = request.form.get('contact')
                pin = request.form.get('pin', '1234')  # Default to 1234 if not provided
                plot_number = request.form.get('plot_number')
                area = request.form.get('area', '')
                company_type = request.form.get('company_type', 'local')
                
                # Get uploaded files
                id_document = request.files.get('id_document')
                selfie_file = request.files.get('selfie_file')
                
                # Prepare data payload
                data = {
                    'account_type': account_type,
                    'company_name': company_name,
                    'name': full_name,
                    'date_of_birth': date_of_birth,
                    'email': email,
                    'password': password,
                    'contact': contact,
                    'pin': pin,
                    'plot_number': plot_number,
                    'area': area,
                    'is_international': str(company_type == 'international').lower()
                }
                
                # Prepare files for upload
                files = {}
                if id_document:
                    files['id_document'] = (id_document.filename, id_document.stream, id_document.mimetype)
                if selfie_file:
                    files['selfie_file'] = (selfie_file.filename, selfie_file.stream, selfie_file.mimetype)
                
                # Call backend registration endpoint
                response = api_call('auth/register', method='POST', data=data, files=files)
                
                if response and response.status_code in [200, 201]:
                    flash(f'Account created successfully for {full_name}!', 'success')
                    return redirect(url_for('accounts'))
                else:
                    error_msg = 'Failed to create account.'
                    if response:
                        try:
                            error_msg = response.json().get('message', error_msg)
                        except:
                            pass
                    flash(error_msg, 'error')
            except Exception as e:
                print(f"Error in POST handler: {str(e)}")
                flash(f'Error creating account: {str(e)}', 'error')
        
        return render_template('admin_account_create.html', user=session.get('user'))
    except Exception as e:
        print(f"Error in admin_create_account route: {str(e)}")
        import traceback
        traceback.print_exc()
        return f"Internal Server Error: {str(e)}", 500

@app.route('/account/suspend/<string:account_id>', methods=['POST'])
@login_required
@admin_required
def suspend_account(account_id):
    response = api_call(f'accounts/{account_id}/suspend', method='PUT')
    if response and response.status_code == 200:
        flash('Account suspended successfully.', 'success')
    else:
        error_msg = 'Failed to suspend account.'
        if response:
            try:
                error_msg = response.json().get('message', error_msg)
            except:
                pass
        flash(error_msg, 'error')
    return redirect(url_for('accounts'))

@app.route('/account/unsuspend/<string:account_id>', methods=['POST'])
@login_required
@admin_required
def unsuspend_account(account_id):
    response = api_call(f'accounts/{account_id}/unsuspend', method='PUT')
    if response and response.status_code == 200:
        flash('Account reactivated successfully.', 'success')
    else:
        error_msg = 'Failed to reactivate account.'
        if response:
            try:
                error_msg = response.json().get('message', error_msg)
            except:
                pass
        flash(error_msg, 'error')
    return redirect(url_for('accounts'))

@app.route('/account/delete/<string:account_id>', methods=['POST'])
@login_required
@admin_required
def delete_account(account_id):
    response = api_call(f'accounts/{account_id}', method='DELETE')
    if response and response.status_code == 200:
        flash('Account deleted successfully.', 'success')
    else:
        error_msg = 'Failed to delete account.'
        if response:
            try:
                error_msg = response.json().get('message', error_msg)
            except:
                pass
        flash(error_msg, 'error')
    return redirect(url_for('accounts'))

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
        'returned': 0,
        'top_distributors': [],
        'categories': []
    }
    
    response = api_call('reports/stats', method='GET')
    if response and response.status_code == 200:
        data = response.json().get('data', {})
        stats['manufactured'] = data.get('manufactured') or 0
        stats['distributed'] = data.get('distributed') or 0
        stats['returned'] = data.get('returned') or 0
        stats['top_distributors'] = data.get('top_distributors') or []
        stats['categories'] = data.get('categories') or []

    return render_template('reports.html', user=session.get('user'), stats=stats)

@app.route('/reports/download')
@login_required
def download_report():
    # Call Backend to generate PDF
    response = api_call('reports/export', method='GET')
    
    if response and response.status_code == 200:
        # Stream the PDF back to the user
        return response.content, 200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=waste_report.pdf'
        }
    else:
        flash('Failed to generate report.', 'error')
        return redirect(url_for('reports'))

@app.route('/reports/insights')
@login_required
def get_insights():
    # Call Backend to get AI analysis
    response = api_call('reports/insights', method='GET')
    
    if response and response.status_code == 200:
        return jsonify(response.json())
    
    return jsonify({"status": "error", "message": "Could not fetch insights"}), 500

@app.route('/kyc')
@login_required
@admin_required
def kyc():
    # Fetch all accounts
    response = api_call('accounts', method='GET')
    accounts = []
    if response and response.status_code == 200:
        accounts = response.json().get('data', [])
    
    # Filter for KYC Dashboard
    pending_apps = [a for a in accounts if a.get('kyc_status', 'pending') == 'pending']
    
    # Sort by date (newest first)
    pending_apps.sort(key=lambda x: x.get('created_at', ''), reverse=True)

    # Calculate KYC Stats for the dashboard
    stats = {
        'pending': len(pending_apps),
        'approved_today': 0, # Not tracked in current model
        'rejected_today': 0, # Not tracked in current model
        'total_verified': len([a for a in accounts if a.get('kyc_status') == 'approved'])
    }

    return render_template('kyc.html', user=session.get('user'), stats=stats, pending_apps=pending_apps)

if __name__ == '__main__':
    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(debug=True, port=5000)
