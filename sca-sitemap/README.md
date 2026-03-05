# SCA Sitemap 🗂️

A modern, professional sitemap and screen management system featuring Role-Based Access Control (RBAC). Built with a powerful **FastAPI** backend and a reactive **Vue 3** frontend.

---

## 🚀 Features

- **Intelligent Dashboard**: Real-time overview of screen counts and project status.
- **Role-Based Access (RBAC)**:
  - **QA Staff**: Full administrative control (Create, Update, Delete) with secure authentication.
  - **Guest/Dev Staff**: Read-only access to browse screens and sitemaps without logging in.
- **Categorized Screen Management**: Specialized modules for:
  - Buyer & Seller Flows
  - Appraisal Boss & Admin Panels
  - Mobile Worker App
  - Marketplace & Read/Controller Modules
- **Advanced Search & Filter**: Find specific screens instantly across the entire project.
- **Secure Authentication**: JWT-based token system with secure password hashing (Bcrypt).
- **Responsive Design**: Premium UI built with Bootstrap 5 and curated modern aesthetics.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: [Vue 3](https://vuejs.org/) (Composition API)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [Vue Router 4](https://router.vuejs.org/)
- **HTTP Client**: [Axios](https://axios-http.com/) (with JWT Interceptors)
- **Styling**: [Bootstrap 5](https://getbootstrap.com/) & [Bootstrap Icons](https://icons.getbootstrap.com/)
- **Notifications**: [SweetAlert2](https://sweetalert2.github.io/)

### **Backend**
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Server**: [Uvicorn](https://www.uvicorn.org/)
- **ORM**: [SQLAlchemy](https://www.sqlalchemy.org/)
- **Database**: PostgreSQL / MySQL
- **Security**: [Jose](https://python-jose.readthedocs.io/en/latest/) (JWT), [Passlib](https://passlib.readthedocs.io/en/stable/) (Bcrypt)

---

## 📂 Project Structure

```text
.
├── backend/                # API & Database Logic
│   ├── main.py             # App entry & API endpoints
│   ├── auth.py             # JWT & Security dependencies
│   ├── models.py           # SQLAlchemy Database models
│   ├── schemas.py          # Pydantic data validation
│   └── database.py         # Database engine configuration
├── src/                    # Frontend Application
│   ├── api/                # Axios instance & interceptors
│   ├── components/         # Reusable UI (Sidebar, Tables, Modals)
│   ├── views/              # Page views (Dashboard, Login, Category Pages)
│   └── routers/            # Vue Router configuration
├── public/                 # Static assets
├── package.json            # Frontend dependencies
└── vite.config.js          # Vite configuration
```

---

## ⚙️ Installation & Setup

### **1. Prerequisites**
- Node.js (v18.0 or later)
- Python (v3.10 or later)
- A running database instance

### **2. Backend Configuration**
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install fastapi uvicorn sqlalchemy passlib[bcrypt] python-jose[cryptography] python-multipart
   ```
4. Start the server:
   ```bash
   uvicorn main:app --reload
   ```

### **3. Frontend Configuration**
1. Install root dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```

---

## 🔐 Access Control Matrix

| Permission | QA Staff (Logged In) | Guest / Dev Staff |
| :--- | :---: | :---: |
| **View Dashboard** | ✅ | ✅ |
| **Search Screens** | ✅ | ✅ |
| **Add New Screen** | ✅ | ❌ |
| **Edit Existing Screen** | ✅ | ❌ |
| **Delete Screen** | ✅ | ❌ |

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
