# Team 4 Project - Appointment Management System

A full-stack web application for managing appointments with user authentication, built with Spring Boot (Backend) and React (Frontend).

## Features

- User registration and authentication
- Appointment booking and management
- MySQL database integration
- Responsive React frontend with TypeScript
- RESTful API backend

## Quick Start

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- Docker (optional, for easy MySQL setup)

### Option 1: Docker Setup (Recommended)

1. **Start MySQL Database:**
   ```bash
   docker-compose up -d
   ```

2. **Backend Setup:**
   ```bash
   cd Backend
   ./mvnw spring-boot:run
   ```

3. **Frontend Setup:**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

### Option 2: Local MySQL Setup

1. **Install MySQL** and create database:
   - Install MySQL 8.0
   - Create database: `team4_db`
   - Create user: `root` with password `8459`

2. **Backend Setup:**
   ```bash
   cd Backend
   ./mvnw spring-boot:run
   ```

3. **Frontend Setup:**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create new appointment
- `GET /api/appointments/{id}` - Get appointment by ID

## Database Schema

The application uses Hibernate to automatically create the following tables:
- `users` - User accounts
- `appointments` - Customer appointments
- `topics` - Service types
- `branches` - Location branches

## Development

### Backend
- Spring Boot 3.5.12
- JPA/Hibernate ORM
- MySQL Connector
- Maven build system

### Frontend
- React 18 with TypeScript
- Vite build tool
- Tailwind CSS
- React Router

## Contributing

1. Clone the repository
2. Follow the Quick Start setup
3. Create a feature branch
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## Troubleshooting

- **Port conflicts**: Backend runs on port 8080, Frontend on 5173
- **Database connection**: Ensure MySQL is running and credentials match
- **CORS issues**: Backend is configured to allow frontend origins