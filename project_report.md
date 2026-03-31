# Digital Consent Platform - Project Report

This report summarizes the complete transformation of the Digital Consent Application from a Docker-dependent monolith into a modern, role-based, version-controlled platform with a premium UI overhaul.

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.4
- **Language**: Java 24 (Compatible with JDK 17+)
- **Database**: PostgreSQL (Local)
- **Security**: Spring Security + JWT (Stateless Authentication)
- **Object Mapping**: Hibernate / JPA
- **Build Tool**: Maven (mvnw)

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS v4 (Alpha/Experimental)
- **Navigation**: React Router DOM v6
- **Icons**: Lucide-React
- **State Management**: React Context API
- **HTTP Client**: Axios

---

## 🚀 Implemented Features

### 1. Role-Based Access Control (RBAC)
- **ADMIN**: Full control over users and templates. Can view audit logs.
- **MENTOR**: Can create/update templates, assign students, and sign forms.
- **STUDENT**: Assigned to a specific Mentor. Can view and sign forms assigned to them.

### 2. Hierarchical Relationships
- Implemented a **Student-Mentor relationship** in the `User` entity.
- Students select their Mentor during registration (powered by `GET /api/auth/mentors`).

### 3. Immutable Form Versioning
- **Versioning Engine**: When a Template is modified, the system marks the old version as `isActive = false` and creates a new record with an incremented version number.
- **Audit Integrity**: This ensures that when a student signs a form, the signature is linked to the *specific* text version they saw, preventing "retroactive changes" to signed documents.

### 4. Premium UI Overhaul
- **Design Intent**: "Glassmorphism" aesthetic.
- **Tailwind v4 Integration**: Deep utilization of CSS variables for theming.
- **Animations**: Custom `reveal`, `pulse-glow`, and `float` animations defined in `index.css`.
- **Role-specific Dashboards**: Distinct landing pages for Admin, Mentor, and Student.

---

## 🏗 Project Structure

```text
/Consent-Web-App
│
├── /backend                    # Spring Boot Application
│   ├── /src/main/java          # Source Code
│   │   └── /com/consentapp
│   │       ├── /controller     # REST Endpoints
│   │       ├── /entity         # JPA Entities (DB Models)
│   │       ├── /repository     # Data Access Layer
│   │       ├── /service        # Business Logic (Versioning engine)
│   │       ├── /security       # JWT & Auth Config
│   │       └── /dto            # Data Transfer Objects
│   └── /src/main/resources     # application.yml config
│
├── /frontend                   # React Application
│   ├── /src
│   │   ├── /context            # AuthContext (Role management)
│   │   ├── /pages              # UI Components
│   │   │   ├── /admin          # AdminDashboard
│   │   │   ├── /mentor         # MentorDashboard
│   │   │   └── /student        # StudentDashboard
│   │   ├── App.jsx             # Routing Logic
│   │   └── index.css           # Global Theme & Animations
│   └── tailwind.config.cjs     # Utility mappings
```

---

## ⚡ How to Run

### Prerequisite: Database
1. Ensure a PostgreSQL instance is running on `localhost:5432`.
2. Manual Step: Create the database `consentdb`.
   ```powershell
   # Password for user 'postgres' expected: 9284
   $env:PGPASSWORD = "9284"
   createdb -U postgres consentdb
   ```

### 1. Run Backend
```powershell
cd backend
$env:JAVA_HOME = "C:\Program Files\Java\jdk-24" # Path to your JDK
.\mvnw.cmd spring-boot:run
```
*Backend will be available at http://localhost:8080*

### 2. Run Frontend
```powershell
cd frontend
npm install
npm run dev
```
*Frontend will be available at http://localhost:5173*

---

## ⚠️ Problems Faced & Solutions

| Problem | Root Cause | Solution |
| :--- | :--- | :--- |
| **Monolith Restriction** | App was originally locked to Docker. | Decoupled the database configuration to point to `localhost`. |
| **Missing Build Tools** | Local environment lacked a global `mvn` install. | Bootstrapped the project with **Maven Wrapper (`mvnw`).** |
| **Java Version Mismatch** | `mvnw` required `JAVA_HOME` pointing to a valid JDK. | Identified local JDK 24 and explicitly set the environment variable. |
| **Database Not Found** | FATAL: database `consentdb` does not exist. | Used `createdb` utility to initialize the empty schema. |
| **Tailwind Build Error** | Tailwind v4 failed to recognize `text-charcoal`. | Created `tailwind.config.cjs` to bridge CSS variables to Tailwind utilities. |

---

## 📝 On Hold / Future Improvements
- **Document Export**: Ability to download signed forms as PDFs.
- **Email Notifications**: Notify students when a new form is published by their mentor.
- **Real-time Updates**: Use WebSockets for live audit logs in the Admin Dashboard.
- **Advanced Signature**: Physical signature pad component for mobile devices.
