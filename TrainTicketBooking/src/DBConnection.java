/* JDBC Setup Note:
 * To connect Java to MySQL, you need to add the MySQL Connector/J JAR file to your classpath.
 * Please download it from: https://dev.mysql.com/downloads/connector/j/
 * 
 * IntelliJ IDEA:
 * 1. File -> Project Structure -> Modules -> Dependencies tab.
 * 2. Click '+' -> JARs -> Select the downloaded .jar file -> Apply -> OK.
 * 
 * Eclipse:
 * 1. Right-click project -> Build Path -> Configure Build Path...
 * 2. Select Libraries tab -> Add External JARs... -> Select the .jar file -> Apply and Close.
 * 
 * VS Code:
 * 1. Ensure you have the Java Extension Pack installed.
 * 2. Find the "JAVA PROJECTS" view in the Explorer panel.
 * 3. Expand "Referenced Libraries" -> click the '+' icon -> Select the downloaded .jar file.
 */

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {

    private static final String URL = "jdbc:mysql://localhost:3306/train_booking_db";
    private static final String USER = "root";
    // Configurable password, change to match your MySQL root setup
    private static final String PASSWORD = "Aditya@1010"; 

    private static Connection connection = null;

    private DBConnection() {
        // private constructor for Singleton
    }

    public static Connection getConnection() {
        try {
            if (connection == null || connection.isClosed()) {
                Class.forName("com.mysql.cj.jdbc.Driver");
                connection = DriverManager.getConnection(URL, USER, PASSWORD);
            }
        } catch (ClassNotFoundException e) {
            System.err.println("MySQL Driver not found. Please add the Connector/J JAR to your classpath.");
            e.printStackTrace();
        } catch (SQLException e) {
            System.err.println("Database connection failed. Please check credentials and ensure MySQL is running.");
            e.printStackTrace();
        }
        return connection;
    }
}
