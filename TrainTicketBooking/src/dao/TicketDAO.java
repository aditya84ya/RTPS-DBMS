package dao;

import models.Ticket;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class TicketDAO {

    private Connection getConnection() throws SQLException {
        try {
            return (Connection) Class.forName("DBConnection").getMethod("getConnection").invoke(null);
        } catch (Exception e) {
            throw new SQLException("Could not get DB connection", e);
        }
    }

    public String bookTicket(int trainId, int passengerId, String journeyDate, String paymentMode) {
        String sql = "{CALL sp_book_ticket(?, ?, ?, ?, ?)}";
        String pnr = null;
        try (Connection conn = getConnection();
             CallableStatement stmt = conn.prepareCall(sql)) {
            
            stmt.setInt(1, trainId);
            stmt.setInt(2, passengerId);
            stmt.setDate(3, Date.valueOf(journeyDate));
            stmt.setString(4, paymentMode);
            stmt.registerOutParameter(5, Types.VARCHAR);
            
            stmt.execute();
            
            pnr = stmt.getString(5);
        } catch (SQLException e) {
            System.err.println("Booking failed: " + e.getMessage());
        }
        return pnr;
    }

    public boolean cancelTicket(String pnr) {
        String sql = "{CALL sp_cancel_ticket(?)}";
        try (Connection conn = getConnection();
             CallableStatement stmt = conn.prepareCall(sql)) {
            
            stmt.setString(1, pnr);
            stmt.execute();
            return true; 
        } catch (SQLException e) {
            System.err.println("Cancellation failed: " + e.getMessage());
        }
        return false;
    }

    public Ticket getTicketByPNR(String pnr) {
        String sql = "SELECT t.*, tr.train_name, tr.train_number, tr.source_station, tr.destination_station, p.name as passenger_name, pay.payment_mode " +
                     "FROM tickets t " +
                     "JOIN trains tr ON t.train_id = tr.train_id " +
                     "JOIN passengers p ON t.passenger_id = p.passenger_id " +
                     "JOIN payments pay ON t.ticket_id = pay.ticket_id " +
                     "WHERE t.pnr_number = ?";
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, pnr);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToTicket(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<Ticket> getTicketsByPassenger(int passengerId) {
        List<Ticket> tickets = new ArrayList<>();
        String sql = "SELECT t.*, tr.train_name, tr.train_number, tr.source_station, tr.destination_station, p.name as passenger_name, pay.payment_mode " +
                     "FROM tickets t " +
                     "JOIN trains tr ON t.train_id = tr.train_id " +
                     "JOIN passengers p ON t.passenger_id = p.passenger_id " +
                     "JOIN payments pay ON t.ticket_id = pay.ticket_id " +
                     "WHERE t.passenger_id = ? ORDER BY t.booking_date DESC";
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, passengerId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    tickets.add(mapResultSetToTicket(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return tickets;
    }

    private Ticket mapResultSetToTicket(ResultSet rs) throws SQLException {
        Ticket t = new Ticket();
        t.setTicketId(rs.getInt("ticket_id"));
        t.setPnrNumber(rs.getString("pnr_number"));
        t.setTrainId(rs.getInt("train_id"));
        t.setPassengerId(rs.getInt("passenger_id"));
        t.setJourneyDate(rs.getDate("journey_date"));
        t.setSeatNumber(rs.getInt("seat_number"));
        t.setBookingDate(rs.getTimestamp("booking_date"));
        t.setStatus(rs.getString("status"));
        t.setTotalFare(rs.getDouble("total_fare"));
        
        // Joined fields
        t.setTrainName(rs.getString("train_name"));
        t.setTrainNumberDisplay(rs.getString("train_number"));
        t.setPassengerName(rs.getString("passenger_name"));
        t.setSource(rs.getString("source_station"));
        t.setDestination(rs.getString("destination_station"));
        t.setPaymentMode(rs.getString("payment_mode"));
        
        return t;
    }
}
