# VistaForge - Portfolio Management System

A modern full-stack portfolio management system built with React, Django REST Framework, and SQLite.

## System Overview

VistaForge is a comprehensive portfolio management platform that allows agencies and freelancers to showcase their work, manage projects, and handle client communications. The system consists of a React frontend with a Django REST API backend, providing a complete solution for portfolio presentation and project management.

## Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with Vite for fast development and building
- **State Management**: Redux Toolkit for global state management
- **Styling**: Tailwind CSS for responsive design
- **Routing**: React Router for client-side navigation
- **Components**: Modular component architecture with reusable UI elements

### Backend (Django REST Framework)
- **Framework**: Django 5.2 with Django REST Framework
- **Database**: SQLite for development (easily configurable for production)
- **Authentication**: Token-based authentication
- **API**: RESTful API with proper serialization and validation
- **Email**: Integrated email system for client communications

### Key Features
- **Portfolio Display**: Showcase projects with rich media and case studies
- **Project Management**: CRUD operations for projects with categorization
- **Client Communication**: Contact forms with automated email responses
- **User Authentication**: Admin panel for content management
- **Responsive Design**: Mobile-first approach with modern UI/UX

## Current Issue

The system is experiencing a critical database connectivity issue where:

### Problem Description
- **Django Shell**: Can successfully access and query the database
- **Django Server**: Returns empty arrays (`[]`) for API endpoints
- **Authentication**: Token validation fails despite correct tokens
- **Database**: Contains valid data but server cannot access it

### Root Cause Analysis
After extensive debugging, the issue appears to be an **environment isolation problem** where the Django development server process cannot access the SQLite database file, even though:

1. ✅ Database file exists and contains data
2. ✅ Django shell can read/write to database
3. ✅ Database path is correctly configured
4. ✅ Migrations are applied successfully
5. ✅ Models and serializers are properly defined

### Technical Details
- **Database Path**: `BASE_DIR / 'db.sqlite3'` (resolved correctly)
- **Server Process**: `python manage.py runserver` cannot access database
- **Shell Process**: `python manage.py shell` can access database
- **Environment**: Windows 11 with Python 3.13.5

### Debugging Attempts
- ✅ Verified database file existence and permissions
- ✅ Confirmed data integrity with direct SQL queries
- ✅ Tested multiple database locations (C:\temp, project directory)
- ✅ Recreated database, migrations, and sample data
- ✅ Restarted Django server multiple times
- ✅ Killed all Python processes and restarted fresh

### Current Status
The issue persists despite all standard debugging approaches. The Django server process appears to be running in a completely isolated environment that cannot access the database file, while the shell environment works perfectly. This suggests a deep Windows/Python environment issue that may require system-level troubleshooting.

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VistaForge
   ```

2. **Backend Setup**
   ```bash
   cd agency-api
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver
   ```

3. **Frontend Setup**
   ```bash
   npm install
   npm run dev
   ```

### Usage

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:8000/admin

## API Endpoints

- `GET /api/projects/` - List all projects (authenticated users see all, public sees active only)
- `POST /api/projects/` - Create new project (authenticated only)
- `GET /api/projects/{slug}/` - Get project details
- `POST /api/contact/` - Submit contact form
- `POST /api/auth/login/` - User authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
