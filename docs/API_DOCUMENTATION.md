# Nino360 HRMS API Documentation

## Overview

The Nino360 HRMS API provides RESTful endpoints for managing all aspects of the HR management system. All endpoints require authentication and follow standard HTTP conventions.

## Base URL

\`\`\`
Production: https://api.nino360.com/v1
Development: http://localhost:3000/api
\`\`\`

## Authentication

All API requests require authentication using Bearer tokens:

\`\`\`bash
Authorization: Bearer <your_api_token>
\`\`\`

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Standard endpoints**: 100 requests per 10 seconds
- **AI endpoints**: 20 requests per minute
- **Bulk operations**: 10 requests per hour
- **Export operations**: 30 requests per hour

Rate limit headers are included in all responses:

\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
\`\`\`

## Error Handling

The API uses standard HTTP status codes:

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

Error responses include a JSON body:

\`\`\`json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
\`\`\`

## Pagination

List endpoints support pagination:

\`\`\`
GET /api/crm/leads?page=1&limit=20
\`\`\`

Response format:

\`\`\`json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
\`\`\`

## Filtering and Sorting

List endpoints support filtering and sorting:

\`\`\`
GET /api/crm/leads?status=new&sort=created_at&order=desc
\`\`\`

## CRM Module

### Leads

#### List Leads

\`\`\`http
GET /api/crm/leads
\`\`\`

Query Parameters:
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20)
- `status` (string) - Filter by status
- `source` (string) - Filter by source
- `search` (string) - Search by name, email, or company

Response:

\`\`\`json
{
  "data": [
    {
      "id": "lead_123",
      "name": "John Doe",
      "email": "john@example.com",
      "company": "Acme Corp",
      "status": "new",
      "source": "website",
      "score": 85,
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
\`\`\`

#### Create Lead

\`\`\`http
POST /api/crm/leads
\`\`\`

Request Body:

\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Corp",
  "phone": "+1234567890",
  "source": "website",
  "notes": "Interested in enterprise plan"
}
\`\`\`

Response:

\`\`\`json
{
  "id": "lead_123",
  "name": "John Doe",
  "email": "john@example.com",
  "status": "new",
  "created_at": "2024-01-15T10:00:00Z"
}
\`\`\`

#### Update Lead

\`\`\`http
PUT /api/crm/leads/:id
\`\`\`

Request Body:

\`\`\`json
{
  "status": "qualified",
  "score": 90,
  "notes": "Follow up scheduled"
}
\`\`\`

#### Delete Lead

\`\`\`http
DELETE /api/crm/leads/:id
\`\`\`

### Contacts

Similar structure to Leads endpoints...

## Talent Module

### Job Requisitions

#### List Jobs

\`\`\`http
GET /api/talent/jobs
\`\`\`

#### Create Job

\`\`\`http
POST /api/talent/jobs
\`\`\`

Request Body:

\`\`\`json
{
  "title": "Senior Software Engineer",
  "department": "Engineering",
  "location": "Remote",
  "type": "full-time",
  "description": "...",
  "requirements": "...",
  "salary_min": 120000,
  "salary_max": 180000
}
\`\`\`

### Candidates

#### List Candidates

\`\`\`http
GET /api/talent/candidates
\`\`\`

#### Upload Resume

\`\`\`http
POST /api/talent/upload-resume
Content-Type: multipart/form-data
\`\`\`

Request Body:
- `file` (file) - Resume file (PDF, DOC, DOCX)
- `job_id` (string) - Optional job ID for matching

Response:

\`\`\`json
{
  "candidate_id": "cand_123",
  "parsed_data": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "skills": ["JavaScript", "React", "Node.js"],
    "experience": [...]
  },
  "match_score": 85
}
\`\`\`

## HRMS Module

### Employees

#### List Employees

\`\`\`http
GET /api/hrms/employees
\`\`\`

#### Create Employee

\`\`\`http
POST /api/hrms/employees
\`\`\`

Request Body:

\`\`\`json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@company.com",
  "department": "Engineering",
  "position": "Software Engineer",
  "start_date": "2024-02-01",
  "employment_type": "full-time"
}
\`\`\`

### Timesheets

#### Submit Timesheet

\`\`\`http
POST /api/hrms/timesheets
\`\`\`

Request Body:

\`\`\`json
{
  "employee_id": "emp_123",
  "week_start": "2024-01-15",
  "entries": [
    {
      "date": "2024-01-15",
      "hours": 8,
      "project_id": "proj_456",
      "description": "Feature development"
    }
  ]
}
\`\`\`

## Finance Module

### Invoices

#### List Invoices

\`\`\`http
GET /api/finance/invoices
\`\`\`

#### Create Invoice

\`\`\`http
POST /api/finance/invoices
\`\`\`

Request Body:

\`\`\`json
{
  "customer_id": "cust_123",
  "invoice_date": "2024-01-15",
  "due_date": "2024-02-15",
  "line_items": [
    {
      "description": "Consulting Services",
      "quantity": 40,
      "rate": 150,
      "amount": 6000
    }
  ],
  "tax_rate": 0.08,
  "notes": "Payment terms: Net 30"
}
\`\`\`

## Webhooks

### Register Webhook

\`\`\`http
POST /api/webhooks
\`\`\`

Request Body:

\`\`\`json
{
  "url": "https://your-app.com/webhook",
  "events": ["lead.created", "candidate.hired"],
  "secret": "your_webhook_secret"
}
\`\`\`

### Webhook Events

Available events:
- `lead.created`, `lead.updated`, `lead.deleted`
- `candidate.created`, `candidate.hired`
- `employee.created`, `employee.updated`
- `invoice.created`, `invoice.paid`

Webhook payload:

\`\`\`json
{
  "event": "lead.created",
  "timestamp": "2024-01-15T10:00:00Z",
  "data": {
    "id": "lead_123",
    "name": "John Doe",
    ...
  }
}
\`\`\`

## SDK Examples

### JavaScript/TypeScript

\`\`\`typescript
import { Nino360Client } from '@nino360/sdk'

const client = new Nino360Client({
  apiKey: process.env.NINO360_API_KEY,
})

// Create a lead
const lead = await client.crm.leads.create({
  name: 'John Doe',
  email: 'john@example.com',
  company: 'Acme Corp',
})

// List candidates
const candidates = await client.talent.candidates.list({
  page: 1,
  limit: 20,
  status: 'active',
})
\`\`\`

### Python

\`\`\`python
from nino360 import Nino360Client

client = Nino360Client(api_key=os.environ['NINO360_API_KEY'])

# Create a lead
lead = client.crm.leads.create(
    name='John Doe',
    email='john@example.com',
    company='Acme Corp'
)

# List candidates
candidates = client.talent.candidates.list(
    page=1,
    limit=20,
    status='active'
)
\`\`\`

## Support

For API support, contact: api-support@nino360.com
