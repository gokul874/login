import os
import logging
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from excel_manager import ExcelManager

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "your-secret-key-change-in-production")

# Initialize Excel manager
excel_manager = ExcelManager()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    try:
        username = request.form['username']
        password = request.form['password']
        user_type = request.form['userType']
        
        if user_type == 'admin':
            admin_name = request.form.get('adminName', '')
            if not admin_name:
                flash('Admin name is required', 'error')
                return redirect(url_for('index'))
            
            admin = excel_manager.get_admin(username)
            if admin and check_password_hash(admin['password'], password) and admin['admin_name'] == admin_name:
                session['user_id'] = admin['id']
                session['username'] = username
                session['user_type'] = 'admin'
                session['admin_name'] = admin_name
                flash('Login successful!', 'success')
                return redirect('https://admin-side-medicare-1.onrender.com')
            else:
                flash('Invalid admin credentials', 'error')
        else:
            user = excel_manager.get_user(username)
            if user and check_password_hash(user['password'], password):
                session['user_id'] = user['id']
                session['username'] = username
                session['user_type'] = 'user'
                flash('Login successful!', 'success')
                return redirect('https://member-side.onrender.com')
            else:
                flash('Invalid user credentials', 'error')
                
    except Exception as e:
        logging.error(f"Login error: {str(e)}")
        flash('An error occurred during login', 'error')
    
    return redirect(url_for('index'))

@app.route('/register', methods=['POST'])
def register():
    try:
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        user_type = request.form['userType']
        
        # Check if username already exists
        if user_type == 'admin':
            admin_name = request.form.get('adminName', '')
            if not admin_name:
                flash('Admin name is required', 'error')
                return redirect(url_for('index'))
            
            if excel_manager.get_admin(username):
                flash('Admin username already exists', 'error')
                return redirect(url_for('index'))
            
            # Create new admin
            admin_data = {
                'username': username,
                'email': email,
                'password': generate_password_hash(password),
                'admin_name': admin_name
            }
            excel_manager.add_admin(admin_data)
            flash('Admin registration successful! Please login.', 'success')
        else:
            if excel_manager.get_user(username):
                flash('Username already exists', 'error')
                return redirect(url_for('index'))
            
            # Create new user
            user_data = {
                'username': username,
                'email': email,
                'password': generate_password_hash(password)
            }
            excel_manager.add_user(user_data)
            flash('Registration successful! Please login.', 'success')
            
    except Exception as e:
        logging.error(f"Registration error: {str(e)}")
        flash('An error occurred during registration', 'error')
    
    return redirect(url_for('index'))

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        flash('Please login to access dashboard', 'error')
        return redirect(url_for('index'))
    
    if session.get('user_type') == 'admin':
        # Get all users for admin dashboard
        users = excel_manager.get_all_users()
        admins = excel_manager.get_all_admins()
        return render_template('dashboard.html', 
                             users=users, 
                             admins=admins,
                             current_user=session.get('username'),
                             admin_name=session.get('admin_name'),
                             user_type=session.get('user_type'))
    else:
        # Regular user dashboard
        return render_template('dashboard.html',
                             current_user=session.get('username'),
                             user_type=session.get('user_type'))

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out successfully', 'success')
    return redirect(url_for('index'))

@app.route('/delete_user/<int:user_id>')
def delete_user(user_id):
    if session.get('user_type') != 'admin':
        flash('Access denied', 'error')
        return redirect(url_for('dashboard'))
    
    try:
        excel_manager.delete_user(user_id)
        flash('User deleted successfully', 'success')
    except Exception as e:
        logging.error(f"Delete user error: {str(e)}")
        flash('Error deleting user', 'error')
    
    return redirect(url_for('dashboard'))

@app.route('/delete_admin/<int:admin_id>')
def delete_admin(admin_id):
    if session.get('user_type') != 'admin':
        flash('Access denied', 'error')
        return redirect(url_for('dashboard'))
    
    # Prevent admin from deleting themselves
    if admin_id == session.get('user_id'):
        flash('Cannot delete your own admin account', 'error')
        return redirect(url_for('dashboard'))
    
    try:
        excel_manager.delete_admin(admin_id)
        flash('Admin deleted successfully', 'success')
    except Exception as e:
        logging.error(f"Delete admin error: {str(e)}")
        flash('Error deleting admin', 'error')
    
    return redirect(url_for('dashboard'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
