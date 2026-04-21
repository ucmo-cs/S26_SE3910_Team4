# Database Setup Guide

## Current Configuration (H2 for Development)

Your project is currently configured to use **H2 in-memory database** for easy development setup. No MySQL installation required!

## Database Configuration
Currently configured in `Backend/src/main/resources/application.properties`:
- **Database**: H2 in-memory (testdb)
- **Host**: In-memory
- **Username**: sa
- **Password**: (blank)
- **DDL Auto Mode**: create-drop (recreates tables on each restart)

## For Development (Current Setup)

The backend is already configured to use H2 database:
- No installation required
- Data persists only during application runtime
- H2 console available at: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:testdb`

### Setup Steps:
1. **Backend is already running** with H2 database
2. **Frontend is running** on `http://localhost:5173`
3. **Test the appointment system** - reservation logic is working!

## For Production (MySQL Setup)

When ready to deploy with MySQL, modify `Backend/src/main/resources/application.properties`:

```properties
# Uncomment MySQL config and comment out H2
spring.datasource.url=jdbc:mysql://localhost:3306/team4_db
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update
```

### MySQL Setup Steps:
1. Install MySQL on your local machine
2. Create a database: `CREATE DATABASE IF NOT EXISTS team4_db;`
3. Create a MySQL user with appropriate permissions
4. Update the application.properties file with your database details
5. Restart the backend

## Tables Created Automatically

### 1. `topics` Table
Stores service/topic types for appointments
- `id` (VARCHAR, Primary Key)
- `name` (VARCHAR)
- `summary` (VARCHAR)

### 2. `branches` Table
Stores branch locations
- `id` (VARCHAR, Primary Key)
- `name` (VARCHAR)
- `address` (VARCHAR)
- `topic_ids` (VARCHAR - comma-separated topic IDs)

### 3. `appointments` Table
Stores customer appointments
- `id` (BIGINT, Primary Key, Auto-increment)
- `topic_id` (VARCHAR)
- `topic_name` (VARCHAR)
- `branch_id` (VARCHAR)
- `branch_name` (VARCHAR)
- `date_label` (VARCHAR)
- `time_label` (VARCHAR)
- `customer_name` (VARCHAR)
- `customer_email` (VARCHAR)
- `customer_phone` (VARCHAR)
- `comments` (VARCHAR)

### 4. `users` Table
Stores user account information
- `id` (BIGINT, Primary Key, Auto-increment)
- `username` (VARCHAR, Unique)
- `password` (VARCHAR) - Note: In production, passwords should be hashed
- `email` (VARCHAR, Unique)
- `first_name` (VARCHAR)
- `last_name` (VARCHAR)
- `phone` (VARCHAR)

## Current Status

✅ **Backend**: Running on port 8080 with H2 database  
✅ **Frontend**: Running on port 5173  
✅ **Database**: H2 in-memory with auto-created tables  
✅ **Reservation System**: Implemented and working  

## Setup Instructions

### Prerequisites
1. **Java 17+ installed** - Required for Spring Boot
2. **Node.js installed** - Required for frontend
3. **No MySQL required** - Using H2 in-memory database

### Step 1: Start the Backend
```bash
cd Backend
java -jar target/backend-0.0.1-SNAPSHOT.jar
```
Or with Maven:
```bash
cd Backend
.\mvnw.cmd spring-boot:run
```

The application will:
- Connect to H2 in-memory database
- Automatically create all required tables
- Seed initial data (Topics and Branches) on first run

### Step 2: Start the Frontend
```bash
cd Frontend
npm run dev
```

Navigate to `http://localhost:5173`

## Initial Data
The DatabaseSeeder automatically populates:
- **6 Topics**: Checking & Savings, Credit Cards, Auto Loans, Home Loans, Small Business, Financial Planning
- **6 Branches**: Plaza, South State Line, Downtown, Rosedale, Brookside, Leawood

Each branch is configured with specific applicable topic services.

## H2 Console Access

Access the H2 database console at: `http://localhost:8080/h2-console`
- **JDBC URL**: `jdbc:h2:mem:testdb`
- **Username**: `sa`
- **Password**: (leave blank)

## Troubleshooting

### Backend Won't Start
- Ensure no other application is using port 8080
- Check that the jar file exists in `Backend/target/`
- Verify Java is installed: `java -version`

### Frontend Issues
- Ensure port 5173 is available
- Check that Node.js and npm are installed
- Run `npm install` if dependencies are missing

### Database Issues
- H2 is in-memory, so data resets on restart
- For persistent data, switch to MySQL configuration
- Check backend logs for connection errors

### Port Already in Use
- Backend default: 8080
- Frontend default: 5173
- Change in `application.properties` (backend) or `vite.config.ts` (frontend) if needed

## Project Structure
```
Backend/
├── entity/
│   ├── Topic.java
│   ├── Branch.java
│   ├── Appointment.java
│   └── User.java
├── repository/
│   ├── TopicRepository.java
│   ├── BranchRepository.java
│   ├── AppointmentRepository.java
│   └── UserRepository.java
├── controller/
│   ├── AppointmentController.java
│   └── UserController.java
└── seeder/
    └── DatabaseSeeder.java

Frontend/
├── src/
│   ├── pages/
│   │   ├── AppointmentCreate.tsx
│   │   ├── AppointmentList.tsx
│   │   └── ...
│   └── components/
│       ├── ui/
│       └── layout/
```
