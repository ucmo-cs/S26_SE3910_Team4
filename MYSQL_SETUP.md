# MySQL Database Setup Guide

## Overview
Your project uses Spring Boot with Hibernate ORM and MySQL. The database tables will be automatically created when you start the backend.

## Database Configuration
Currently configured in `Backend/src/main/resources/application.properties`:
- **Database**: team4_db
- **Host**: localhost:3306
- **Username**: root
- **Password**: 8459
- **DDL Auto Mode**: update (Hibernate auto-creates/updates tables based on entity definitions)

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

### 4. `notes` Table (Existing)
- `id` (BIGINT, Primary Key, Auto-increment)
- `title` (VARCHAR)

## Setup Instructions

### Prerequisites
1. **MySQL Server Running** - Ensure MySQL is installed and running on your machine
2. **Database Created** - Run this in MySQL:
   ```sql
   CREATE DATABASE IF NOT EXISTS team4_db;
   ```

### Step 1: Start the Backend
```bash
cd Backend
.\mvnw.cmd spring-boot:run
```

The application will:
- Connect to MySQL
- Automatically create all required tables if they don't exist
- Seed initial data (Topics and Branches) on first run

### Step 2: Start the Frontend
```bash
cd Frontend
npm run dev
```

Navigate to `http://localhost:5173` (or the URL shown in terminal)

## Initial Data
The DatabaseSeeder automatically populates:
- **6 Topics**: Checking & Savings, Credit Cards, Auto Loans, Home Loans, Small Business, Financial Planning
- **6 Branches**: Plaza, South State Line, Downtown, Rosedale, Brookside, Leawood

Each branch is configured with specific applicable topic services.

## Troubleshooting

### Connection Issues
If you get a connection error, verify:
1. MySQL is running: `mysql -u root -p`
2. Database exists: `SHOW DATABASES;` should list `team4_db`
3. Credentials match in `application.properties`

### Tables Not Created
1. Check the backend console for error messages
2. Ensure no other application is using the same database
3. Delete the database and restart (tables will be recreated):
   ```sql
   DROP DATABASE team4_db;
   CREATE DATABASE team4_db;
   ```

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
│   └── Appointment.java
├── repository/
│   ├── TopicRepository.java
│   ├── BranchRepository.java
│   └── AppointmentRepository.java
└── seeder/
    └── DatabaseSeeder.java
```
