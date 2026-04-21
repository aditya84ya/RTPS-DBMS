package dao;

import models.Passenger;
import java.sql.*;

public class PassengerDAO {

    private Connection getConnection() throws SQLException {
        try {
            return (Connection) Class.forName("DBConnection").getMethod("getConnection").invoke(null);
        } catch (Exception e) {
            throw new SQLException("Could not get DB connection", e);
        }
    }

    public int registerPassenger(Passenger p) {
        String sql = "INSERT INTO passengers (name, age, gender, email, phone) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setString(1, p.getName());
            stmt.setInt(2, p.getAge());
            stmt.setString(3, p.getGender());
            stmt.setString(4, p.getEmail());
            stmt.setString(5, p.getPhone());
            
            int affectedRows = stmt.executeUpdate();
            if (affectedRows > 0) {
                try (ResultSet rs = stmt.getGeneratedKeys()) {
                    if (rs.next()) {
                        return rs.getInt(1);
                    }
                }
            }
        } catch (SQLException e) {
            System.err.println("Could not register: " + e.getMessage());
        }
        return -1;
    }

    public Passenger getPassengerByEmail(String email) {
        String sql = "SELECT * FROM passengers WHERE email = ?";
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, email);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToPassenger(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public Passenger getPassengerById(int id) {
        String sql = "SELECT * FROM passengers WHERE passenger_id = ?";
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToPassenger(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    private Passenger mapResultSetToPassenger(ResultSet rs) throws SQLException {
        Passenger p = new Passenger();
        p.setPassengerId(rs.getInt("passenger_id"));
        p.setName(rs.getString("name"));
        p.setAge(rs.getInt("age"));
        p.setGender(rs.getString("gender"));
        p.setEmail(rs.getString("email"));
        p.setPhone(rs.getString("phone"));
        return p;
    }
}
