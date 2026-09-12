# Support CRM

A full-stack Support CRM application for managing customer support tickets.

The application allows support teams to create, search, filter, view, and update support tickets, while maintaining notes and comments for each ticket.

## Live Demo

Frontend:
https://support-crm-woad.vercel.app

Backend API:
https://supportcrm-production-6bf0.up.railway.app/api/tickets

## Features

- Create new support tickets
- View all support tickets
- Search tickets by:
  - Customer name
  - Ticket ID
  - Customer email
  - Description
- Filter tickets by status:
  - Open
  - In Progress
  - Closed
- View complete ticket details
- Update ticket status
- Add notes and comments to tickets
- Automatic ticket creation timestamps
- Automatic ticket update timestamps
- Responsive and clean user interface
- RESTful backend API
- MySQL database persistence
- Input validation and error handling

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Jakarta Validation

### Database

- MySQL 8

### Deployment

- Frontend: Vercel
- Backend: Railway
- Database: Railway MySQL

## REST API

### Create Ticket

```http
POST /api/tickets
GET /api/tickets

GET /api/tickets?search=customer
GET /api/tickets?status=Open
GET /api/tickets?status=In%20Progress&search=login

GET /api/tickets/{ticket_id}