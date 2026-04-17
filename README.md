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
- MySQL 8.0 or higher

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd S26_SE3910_Team4
   ```

2. **Setup MySQL Database:**
   - Install MySQL 8.0
   - Create a database (any name you prefer)
   - Create a MySQL user with appropriate permissions
   - Update `Backend/src/main/resources/application.properties` with your database details:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/your_database_name
     spring.datasource.username=your_mysql_username
     spring.datasource.password=your_mysql_password
     ```

3. **Backend Setup:**
   ```bash
   cd Backend
   ./mvnw spring-boot:run
   ```

4. **Frontend Setup:**
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
2. Setup your local MySQL database and update application.properties
3. Follow the Quick Start setup
4. Create a feature branch
5. Make your changes
6. Test thoroughly
7. Submit a pull request

## Troubleshooting

- **Port conflicts**: Backend runs on port 8080, Frontend on 5173
- **Database connection**: Ensure MySQL is running and credentials in application.properties are correct
- **CORS issues**: Backend is configured to allow frontend origins