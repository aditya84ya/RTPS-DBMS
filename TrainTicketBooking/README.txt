Train Ticket Booking Management System (TTBMS)

## Overview
This is a comprehensive Java Console-based application integrated with MySQL using JDBC without any build tools.

## Prerequisites
1. Java Development Kit (JDK) 8 or higher
2. MySQL Server running locally on port 3306
3. MySQL Connector/J JAR (e.g., mysql-connector-j-8.x.x.jar)

## Database Setup
1. Open your MySQL command line or IDE (e.g., MySQL Workbench).
2. Execute the `database/setup.sql` script. It will automatically build the `train_booking_db` schema, insert dummy data, and setup stored procedures.
3. Keep MySQL running locally with credentials root / root. (If your password differs, update `src/DBConnection.java`).

## How to Run in an IDE

### IntelliJ IDEA
1. Open the `TrainTicketBooking` folder.
2. Go to File -> Project Structure -> Modules -> Dependencies tab.
3. Click the '+' sign -> JARs or directories -> Select your downloaded `mysql-connector-j-8.x.x.jar`. 
4. Check the box to apply it and click OK.
5. Run `Main.java`.

### Eclipse
1. Import the folder or create a new Java Project using `TrainTicketBooking` as root.
2. Right-click the project -> Build Path -> Configure Build Path...
3. Select the Libraries tab -> Add External JARs... -> Select your downloaded `mysql-connector-j-8.x.x.jar`.
4. Apply and Close.
5. Run `Main.java` as Java Application.

### VS Code
1. Ensure you have the `Extension Pack for Java` installed.
2. Locate the "JAVA PROJECTS" view in the Explorer side-panel.
3. Expand your project under "Referenced Libraries", click the '+' icon.
4. Select the downloaded `mysql-connector-j-8.x.x.jar`.
5. Open `Main.java` and click "Run".

Enjoy seamless booking!

## Deploy on Vercel (React + Node API)

This repository includes a Vercel setup file at `TrainTicketBooking/vercel.json` that:
- builds the Vite frontend from `frontend/`
- serves backend API routes through `api/index.js` (Express app from `backend/server.js`)

### Vercel project settings
1. Import the GitHub repo in Vercel.
2. Set **Root Directory** to `TrainTicketBooking`.
3. Keep framework auto-detection enabled.

### Required environment variables (Vercel Project → Settings → Environment Variables)
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`

### Optional frontend environment variable
- `VITE_API_BASE_URL`
  - Leave empty for same-origin API calls on Vercel (`/api/...`).
  - Set it only if frontend and backend are deployed to different domains.
