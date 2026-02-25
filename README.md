# Digital Consent Management Application

This is a full-stack Digital Consent Management Application built with Spring Boot, React, and PostgreSQL.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

## How to Run (Docker)

The easiest way to run the entire application stack is using Docker Compose. This will spin up the PostgreSQL database, the Spring Boot backend API, and the React frontend.

1. Open a terminal (PowerShell, Command Prompt, or bash).
2. Navigate to the root folder of this project (`consentApp/consentApp`).
3. Run the following command:

```bash
docker-compose up --build -d
```

4. Once the containers are built and running, you can access the applications at:
   - **Frontend UI**: [http://localhost](http://localhost) (or `http://localhost:80` if port 80 is occupied, you might need to map to another port in `docker-compose.yml`)
   - **Backend API & Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

## How to Test the Flow

1. **Access the Frontend**: Go to `http://localhost` in your browser.
2. **Register an Admin**: Create an account using the email `admin@consent.app` to automatically receive `ADMIN` privileges.
3. **Create a Template**: As an admin, create a new Consent Template (e.g., "Terms of Service") and mark it as active.
4. **Register a User**: Log out and create a regular user account (e.g., `user@example.com`).
5. **Sign Consent**: Log in as the user, navigate to the "Pending Consents" tab, review the template, and sign it.
6. **Verify Audit**: Log back in as the `admin@consent.app` and navigate to the "Consent Audits" tab to see the securely generated SHA-256 signature hash for that record.

## Stopping the Application

To stop the running Docker containers:

```bash
docker-compose down
```

## Running Locally (Without Docker)

If you prefer to run the components individually without Docker:

### 1. Database
Ensure you have a PostgreSQL instance running locally. Create a database named `consentdb` with user `consentuser` and password `consentpassword` (or update `backend/src/main/resources/application.yml` with your local credentials).

### 2. Backend
Navigate to the `backend` folder and run:
```bash
mvn spring-boot:run
```

### 3. Frontend
Navigate to the `frontend` folder, install dependencies, and run the development server:
```bash
npm install
npm run dev
```
The frontend will typically be available at `http://localhost:5173`.
