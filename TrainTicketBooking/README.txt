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
