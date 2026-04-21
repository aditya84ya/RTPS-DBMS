package models;

import java.sql.Date;
import java.sql.Timestamp;

public class Ticket {
    private int ticketId;
    private String pnrNumber;
    private int trainId;
    private int passengerId;
    private Date journeyDate;
    private int seatNumber;
    private Timestamp bookingDate;
    private String status;
    private double totalFare;

    // Presentation fields for joined queries
    private String trainName;
    private String trainNumberDisplay;
    private String passengerName;
    private String source;
    private String destination;
    private String paymentMode;

    public Ticket() {}

    public int getTicketId() { return ticketId; }
    public void setTicketId(int ticketId) { this.ticketId = ticketId; }

    public String getPnrNumber() { return pnrNumber; }
    public void setPnrNumber(String pnrNumber) { this.pnrNumber = pnrNumber; }

    public int getTrainId() { return trainId; }
    public void setTrainId(int trainId) { this.trainId = trainId; }

    public int getPassengerId() { return passengerId; }
    public void setPassengerId(int passengerId) { this.passengerId = passengerId; }

    public Date getJourneyDate() { return journeyDate; }
    public void setJourneyDate(Date journeyDate) { this.journeyDate = journeyDate; }

    public int getSeatNumber() { return seatNumber; }
    public void setSeatNumber(int seatNumber) { this.seatNumber = seatNumber; }

    public Timestamp getBookingDate() { return bookingDate; }
    public void setBookingDate(Timestamp bookingDate) { this.bookingDate = bookingDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public double getTotalFare() { return totalFare; }
    public void setTotalFare(double totalFare) { this.totalFare = totalFare; }

    // Navigation/Presentation Field Getters and Setters
    public String getTrainName() { return trainName; }
    public void setTrainName(String trainName) { this.trainName = trainName; }

    public String getTrainNumberDisplay() { return trainNumberDisplay; }
    public void setTrainNumberDisplay(String trainNumberDisplay) { this.trainNumberDisplay = trainNumberDisplay; }

    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }

    @Override
    public String toString() {
        return "Ticket [PNR: " + pnrNumber + ", Status: " + status + 
               " | Passenger: " + passengerName + 
               " | Train: " + trainNumberDisplay + " " + trainName + 
               " (" + source + " -> " + destination + ")" +
               " | Date: " + journeyDate + " | Seat: " + (seatNumber > 0 ? seatNumber : "N/A") + 
               " | Fare: ₹" + totalFare + " | Payment: " + paymentMode + "]";
    }
}
