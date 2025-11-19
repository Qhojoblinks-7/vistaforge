# VistaForge - Complete Agency Management System

## Overview

VistaForge is a comprehensive agency management system built with React (frontend) and Django (backend) that helps creative agencies manage clients, projects, time tracking, and invoicing. The system provides a complete workflow from project planning to invoice generation and payment tracking.

## Features

### 🏢 Client Management
- Add and manage client information
- Track client status (Active, Inactive, Lead)
- View client revenue history
- Contact information management

### 📋 Project Management
- Create and organize projects by client
- Kanban-style project boards
- Task management within projects
- Project status tracking (Planning, In Progress, Review, Completed, Canceled)
- Budget and deadline management

### ⏱️ Time Tracking
- Start/stop timers for tasks
- Manual time entry
- Billable vs non-billable time tracking
- Project-based time logging
- Duration calculations

### 💰 Invoice Management
- Generate invoices from billable time logs
- Professional invoice templates
- PDF generation and download
- Email invoice sending
- Payment status tracking
- Invoice analytics and reporting

### 📊 Analytics & Reporting
- Revenue tracking
- Project profitability
- Time utilization reports
- Client payment history
- Financial metrics dashboard

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **jsPDF & html2canvas** - PDF generation
- **Vite** - Build tool and dev server

### Backend
- **Django 5.2** - Python web framework
- **Django REST Framework** - API development
- **Graphene-Django** - GraphQL implementation
- **Django Simple JWT** - JWT authentication
- **SQLite** - Database (development)
- **PostgreSQL** - Database (production)

## Database Schema

### Core Models

#### 1. User (Django Built-in)
Standard Django User model with authentication and authorization.

#### 2. Client Model
```python
class Client(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Row-Level Security
    name = models.CharField(max_length=100, unique=True)
    contact_email = models.EmailField(max_length=254)
    address = models.JSONField(null=True, blank=True)
    status = models.CharField(max_length=20, default='Active', choices=[
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
        ('Lead', 'Lead'),
    ])
    total_revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    class Meta:
        unique_together = ['user', 'name']  # Unique per user
```

#### 3. Project Model
```python
class Project(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # RLS Field
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    due_date = models.DateField(null=True, blank=True)
    project_rate = models.DecimalField(max_digits=6, decimal_places=2)  # Hourly rate
    status = models.CharField(max_length=20, default='In Progress', choices=[
        ('Planning', 'Planning'),
        ('In Progress', 'In Progress'),
        ('Review', 'Review'),
        ('Completed', 'Completed'),
        ('Canceled', 'Canceled'),
    ])
    budget_hours = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    tasks = models.JSONField(default=list)  # Embedded task list
```

#### 4. TimeLog Model
```python
class TimeLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # RLS Field
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    task_id = models.CharField(max_length=50)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    duration_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    is_billable = models.BooleanField(default=True)
    is_billed = models.BooleanField(default=False)  # Critical for invoice generation
```

#### 5. Invoice Model
```python
class Invoice(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # RLS Field
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    invoice_number = models.CharField(max_length=50, unique=True)
    issue_date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='Draft', choices=[
        ('Draft', 'Draft'),
        ('Sent', 'Sent'),
        ('Paid', 'Paid'),
        ('Overdue', 'Overdue'),
    ])
    paid_date = models.DateField(null=True, blank=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True)
    items = models.JSONField(default=list)  # Invoice line items
    billed_timelogs = models.JSONField(default=list)  # IDs of billed TimeLogs
```

#### 6. Task Model (Embedded)
```python
class Task(models.Model):
    task_id = models.CharField(max_length=50)  # Unique identifier
    description = models.CharField(max_length=255)
    priority = models.IntegerField(default=2, choices=[
        (1, 'High'),
        (2, 'Medium'),
        (3, 'Low'),
    ])
    is_complete = models.BooleanField(default=False)

    class Meta:
        abstract = True  # Embedded schema
```

## API Architecture

### GraphQL Schema
```graphql
type Query {
  allInvoices: [InvoiceType!]!
  allClients: [ClientType!]!
  allManagementProjects: [ProjectType!]!
  allTimeLogs: [TimeLogType!]!
}

type Mutation {
  createInvoice(input: CreateInvoiceInput!): InvoiceType!
  updateInvoice(id: ID!, input: UpdateInvoiceInput!): InvoiceType!
  deleteInvoice(id: ID!): Boolean!
  sendInvoice(id: ID!): InvoiceType!
  markInvoicePaid(id: ID!): InvoiceType!

  createClient(input: CreateClientInput!): ClientType!
  updateClient(id: ID!, input: UpdateClientInput!): ClientType!
  deleteClient(id: ID!): Boolean!

  createProject(input: CreateProjectInput!): ProjectType!
  updateProject(id: ID!, input: UpdateProjectInput!): ProjectType!
  deleteProject(id: ID!): Boolean!

  startTimeLog(projectId: ID!, taskId: String!): TimeLogType!
  stopTimeLog(id: ID!): TimeLogType!
  createManualTimeLog(input: CreateTimeLogInput!): TimeLogType!
}
```

### REST API Endpoints
- `POST /api/auth/token/` - JWT token obtain
- `POST /api/auth/token/refresh/` - JWT token refresh
- `GET /api/invoices/` - List invoices
- `POST /api/invoices/` - Create invoice
- `DELETE /api/invoices/{id}/` - Delete invoice
- `POST /api/invoices/{id}/send_invoice/` - Send invoice
- `POST /api/invoices/{id}/mark_paid/` - Mark as paid
- `GET /api/clients/` - List clients
- `POST /api/clients/` - Create client
- `GET /api/projects/` - List projects
- `POST /api/projects/` - Create project
- `GET /api/timelogs/` - List time logs
- `POST /api/timelogs/start` - Start timer
- `PATCH /api/timelogs/{id}/stop` - Stop timer

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Clone and navigate to backend directory:**
```bash
cd agency-api
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Run migrations:**
```bash
python manage.py migrate
```

5. **Create superuser:**
```bash
python manage.py createsuperuser
```

6. **Start development server:**
```bash
python manage.py runserver 8000
```

### Frontend Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Key Features Implementation

### Row-Level Security (RLS)
All models include a `user` foreign key that enforces data isolation between users. Django's permission system ensures users can only access their own data.

### Invoice Generation Logic
1. Query unbilled TimeLogs for a project
2. Calculate total hours and amount (hours × project rate)
3. Create invoice with line items
4. Mark TimeLogs as `is_billed = True`
5. Generate unique invoice number

### Analytics Calculations
- **Total Revenue**: Sum of all paid invoice amounts
- **Pending Amount**: Sum of sent invoice amounts
- **Paid Amount**: Sum of paid invoice amounts
- **Overdue Amount**: Sum of overdue invoice amounts
- **Project Profitability**: Revenue vs time spent

### Status Management
- **Invoices**: Draft → Sent → Paid/Overdue
- **Projects**: Planning → In Progress → Review → Completed
- **Clients**: Lead → Active → Inactive

## Business Rules

1. **Invoice Creation**: Only unbilled time logs can be invoiced
2. **Payment Tracking**: Invoices can only be marked paid if sent or overdue
3. **Time Billing**: Once billed, time logs cannot be modified
4. **Client Revenue**: Automatically calculated from paid invoices
5. **Project Budget**: Optional budget tracking with hour limits

## Development Guidelines

### Frontend Architecture
- **Redux Toolkit** for state management
- **RTK Query** for API calls
- **Tailwind CSS** for styling
- **Component-based architecture**
- **Custom hooks** for reusable logic

### Backend Architecture
- **Django REST Framework** for API
- **Graphene-Django** for GraphQL
- **JWT Authentication** for security
- **Model-View-Controller** pattern
- **Service layer** for business logic

### Code Quality
- **ESLint** for JavaScript/React
- **Black** for Python formatting
- **Pre-commit hooks** for quality checks
- **Comprehensive testing** (unit, integration, e2e)

## Deployment

### Environment Variables
```env
# Django
SECRET_KEY=your-secret-key
DEBUG=False
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# JWT
JWT_SECRET_KEY=your-jwt-secret
```

### Production Deployment
1. Use PostgreSQL for database
2. Configure email backend (SendGrid, Mailgun, etc.)
3. Set up proper static file serving
4. Configure HTTPS
5. Set up monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@vistaforge.com or create an issue in the GitHub repository.

---

**VistaForge** - Streamlining agency operations, one project at a time.
