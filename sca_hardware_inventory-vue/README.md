# SCA Hardware Inventory Management System

This is a comprehensive hardware inventory management system for **Consolidated Containers of Asia (CCA)**, built with Vue 3 and FastAPI.

## 🚀 Live Demo

**URL:** [https://sca-inventory.vercel.app](https://sca-inventory.vercel.app)

**Default Login Credentials:**

- **Username:** `admin`
- **Password:** `admin123`

> **Note:** Passwords are **hashed** in the database. While you can log in with the default credentials, new passwords must be at least 8 characters long.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [Database Management](#-database-management)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Team](#-team)

## ✨ Features

### 📊 Dashboard

- **Hardware Inventory Overview**: Real-time statistics of all hardware assets
- **Department Breakdown**: Visualization of hardware distribution across departments
- **Recent Activity**: Quick view of recently added or deployed hardware
- **Recent Deployments**: List of recently deployed items with status
- **Stock Alerts**: Low stock notifications (below 5 units)
- **Visual Charts**: Interactive charts for hardware distribution and totals

### 🗄️ Hardware Management

- **CRUD Operations**: Create, Read, Update, and Delete hardware items
- **Hardware Categorization**: Filter by hardware type (laptop, monitor, projector, etc.)
- **Search & Filter**: Advanced search by CKT item number, serial number, or designation
- **Pagination**: Efficient data loading with 10 items per page
- **Bulk Operations**: Select and delete multiple hardware items
- **Stock Management**: View and update hardware stock levels

### 📋 Deployments

- **Hardware Deployment**: Assign hardware to employees with detailed information
- **Deployment Tracking**: Monitor hardware location and assignment status
- **Edit Deployments**: Update deployment details including assigned hardware
- **Deployment History**: View all past deployments
- **Auto-Deletion**: Automatically remove deployments when all hardware is unassigned

### 👥 User Management

- **Authentication**: Secure login with JWT tokens
- **Role-Based Access**: Admin and staff accounts
- **User Management**: View, create, and manage user accounts
- **Profile Management**: Update user profile information

### 🔐 Authentication

- **Login**: Secure login with username and password
- **Logout**: Secure session termination
- **Forgot Password**: Email-based password reset flow
- **Reset Password**: Set new password using reset token
- **Token Expiration**: Automatic token refresh and timeout handling

## 🛠️ Tech Stack

### Frontend

- **Vue 3**: Progressive JavaScript framework
- **Vite**: Build tool and development server
- **Vue Router**: Routing management
- **Axios**: HTTP client for API communication
- **Bootstrap 5**: CSS framework for styling
- **Chart.js**: Data visualization with Vue Chart.js
- **Font Awesome**: Icon library

### Backend

- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: ORM for database interactions
- **PostgreSQL**: Production database
- **Aiosqlite**: SQLite for development
- **PyJWT**: JWT token-based authentication
- **Bcrypt**: Password hashing
- **Uvicorn**: ASGI server
- **python-multipart**: File uploads and form data
- **python-dotenv**: Environment variable management

## 📋 Prerequisites

### Software Requirements

- **Node.js**: 16.0 or higher (for frontend development)
- **Python**: 3.8 or higher (for backend)
- **PostgreSQL**: 13 or higher (for production)
- **SQLite**: (included for development)

### Dependencies

- **Frontend**: Run `npm install` or `yarn install` in the `frontend` directory
- **Backend**: Run `pip install -r backend/requirements.txt` in the `backend` directory

## 📁 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/sca-hardware-inventory-vue.git
   cd sca-hardware-inventory-vue
   ```

2. **Install Frontend Dependencies**

   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `backend` directory with the following configuration:

```env
# Database Configuration (Production - PostgreSQL)
DB_CONNECTION=postgresql
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Database Configuration (Development - SQLite)
# Uncomment below to use SQLite for development
# DB_CONNECTION=sqlite
# DB_FILE=../database.db

# JWT Configuration
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# CORS Configuration
ALLOWED_ORIGINS=https://sca-inventory.vercel.app,http://localhost:3000

# Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

# SMTP Server (for sending emails)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_email_password
SENDER_EMAIL=your_email@gmail.com
SENDER_NAME="CKT Hardware Inventory"
```

### Frontend Configuration

Update the API base URL in `frontend/src/api/axios.js` if needed:

```javascript
const api = axios.create({
  baseURL: "https://sca-hardware-inventory-vue.onrender.com",
  // or your deployed backend URL
});
```

## 🚀 Usage

### Start Development Server

1. **Start the Backend**

   ```bash
   cd backend
   uvicorn main:app --reload --host [IP_ADDRESS] --port 8000
   ```

2. **Start the Frontend**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
cd frontend
npm run build
```

The production build will be created in the `dist` folder.

## 🗄️ Database Management

### Initialize Database

Run the initialization script to create database tables:

```bash
cd backend
python init_db.py
```

This will create:

- `database.db` SQLite file (development)
- SQLAlchemy tables based on your models
- Sample admin user with password `admin123`

### Reset Database

To completely reset the database (deleting all data):

```bash
cd backend
python reset_database.py
```

This will:

1. Delete existing database file
2. Recreate tables
3. Create new admin user

### Manage Users

To create or update user credentials:

```bash
cd backend
python manage_users.py
```

This script allows you to:

- Create new users
- List all users
- Reset user passwords

## 🌐 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import the project in Vercel
3. Set environment variables in Vercel dashboard:
   - `DB_CONNECTION=postgresql`
   -
