# Database Setup Guide

## Current Configuration (MySQL)

Your project is configured to use **MySQL database**. All data persists in your local MySQL server.

## Database Configuration
Currently configured in `Backend/src/main/resources/application.properties`:
- **Database**: MySQL (team4_db)
- **Host**: localhost:3306
- **Username**: root
- **Password**: 8459
- **DDL Auto Mode**: update (automatically creates/updates tables on startup)

## Prerequisites
1. **MySQL installed** on your local machine
2. **Java 17+ installed** - Required for Spring Boot
3. **Node.js installed** - Required for frontend

## Setup Instructions

### Step 1: Verify MySQL is Running
```bash
mysql -u root -p
```

### Step 2: Create Database and User
In MySQL Command Line Client:

```sql
CREATE DATABASE IF NOT EXISTS team4_db;
CREATE USER 'root'@'localhost' IDENTIFIED BY '8459';
GRANT ALL PRIVILEGES ON team4_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Start the Backend
```bash
cd Backend
.\mvnw.cmd spring-boot:run
```

Wait for it to start (takes 30-60 seconds). You should see:
```
Started BackendApplication in X seconds
```

The application will:
- Connect to MySQL database
- Automatically create all required tables
- Seed initial data (Topics and Branches) on first run

### Step 4: Start the Frontend
Open a new terminal and run:
```bash
cd Frontend
npm run dev
```

Navigate to `http://localhost:5173`

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

## Initial Data
The DatabaseSeeder automatically populates:
- **6 Topics**: Checking & Savings, Credit Cards, Auto Loans, Home Loans, Small Business, Financial Planning
- **6 Branches**: Plaza, South State Line, Downtown, Rosedale, Brookside, Leawood

Each branch is configured with specific applicable topic services.

## Verify Tables Were Created

In MySQL Command Line Client or Workbench:
```sql
USE team4_db;
SHOW TABLES;
SELECT * FROM topics;
SELECT * FROM branches;
```

You should see 4 tables: `appointments`, `branches`, `topics`, `users`

## Troubleshooting

### Backend Won't Start
- Ensure MySQL is running: `mysql -u root -p`
- Verify database exists: `SHOW DATABASES;`
- Check credentials in `application.properties`
- Ensure no other app is using port 8080

### Frontend Issues
- Ensure port 5173 is available
- Check that Node.js and npm are installed
- Run `npm install` if dependencies are missing

### Database Connection Issues
- MySQL not running - start MySQL service
- Wrong credentials - verify username/password
- Database doesn't exist - create it with SQL commands above
- Port already in use - change in `application.properties`

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
│   ├── TestController.java
│   └── UserController.java
├── seeder/
│   └── DatabaseSeeder.java
└── pom.xml

Frontend/
├── src/
│   ├── pages/
│   │   ├── AppointmentCreate.tsx
│   │   ├── AppointmentList.tsx
│   │   ├── AppointmentDetail.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Profile.tsx
│   │   └── NotFound.tsx
│   └── components/
│       ├── ui/
│       └── layout/
```
