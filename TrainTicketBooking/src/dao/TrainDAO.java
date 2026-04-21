package dao;

import models.Train;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class TrainDAO {

    // Helper using reflection to access default package class
    private Connection getConnection() throws SQLException {
        try {
            return (Connection) Class.forName("DBConnection").getMethod("getConnection").invoke(null);
        } catch (Exception e) {
            throw new SQLException("Could not get DB connection", e);
        }
    }

    public List<Train> getAllTrains() {
        List<Train> trains = new ArrayList<>();
        String sql = "SELECT * FROM trains";
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                trains.add(mapResultSetToTrain(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return trains;
    }

    public List<Train> searchTrains(String source, String destination) {
        List<Train> trains = new ArrayList<>();
        String sql = "SELECT * FROM trains WHERE LOWER(source_station) LIKE LOWER(?) AND LOWER(destination_station) LIKE LOWER(?)";
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, "%" + source + "%");
            stmt.setString(2, "%" + destination + "%");
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    trains.add(mapResultSetToTrain(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return trains;
    }

    public Train getTrainById(int trainId) {
        String sql = "SELECT * FROM trains WHERE train_id = ?";
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, trainId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToTrain(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean updateAvailableSeats(int trainId, int seats) {
        String sql = "UPDATE trains SET available_seats = ? WHERE train_id = ?";
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, seats);
            stmt.setInt(2, trainId);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    private Train mapResultSetToTrain(ResultSet rs) throws SQLException {
        Train t = new Train();
        t.setTrainId(rs.getInt("train_id"));
        t.setTrainNumber(rs.getString("train_number"));
        t.setTrainName(rs.getString("train_name"));
        t.setSourceStation(rs.getString("source_station"));
        t.setDestinationStation(rs.getString("destination_station"));
        t.setDepartureTime(rs.getTime("departure_time"));
        t.setArrivalTime(rs.getTime("arrival_time"));
        t.setTotalSeats(rs.getInt("total_seats"));
        t.setAvailableSeats(rs.getInt("available_seats"));
        t.setFarePerSeat(rs.getDouble("fare_per_seat"));
        return t;
    }
}
