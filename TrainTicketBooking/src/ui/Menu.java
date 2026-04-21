package ui;

import dao.PassengerDAO;
import dao.TicketDAO;
import dao.TrainDAO;
import models.Passenger;
import models.Ticket;
import models.Train;

import java.util.List;
import java.util.Scanner;
import java.util.regex.Pattern;

public class Menu {
    private final TrainDAO trainDAO;
    private final PassengerDAO passengerDAO;
    private final TicketDAO ticketDAO;
    private final Scanner scanner;

    public Menu() {
        trainDAO = new TrainDAO();
        passengerDAO = new PassengerDAO();
        ticketDAO = new TicketDAO();
        scanner = new Scanner(System.in);
    }

    public void start() {
        while (true) {
            printDivider();
            System.out.println("   TRAIN TICKET BOOKING SYSTEM");
            printDivider();
            System.out.println("1. View All Trains");
            System.out.println("2. Search Trains");
            System.out.println("3. Register Passenger");
            System.out.println("4. Book Ticket");
            System.out.println("5. Cancel Ticket");
            System.out.println("6. Check PNR Status");
            System.out.println("7. View Booking History");
            System.out.println("8. Exit");
            System.out.print("Enter your choice: ");

            String input = scanner.nextLine().trim();
            if (input.isEmpty()) continue;

            int choice;
            try {
                choice = Integer.parseInt(input);
            } catch (NumberFormatException e) {
                System.out.println("Invalid choice. Please enter a number.");
                continue;
            }

            try {
                switch (choice) {
                    case 1: viewAllTrains(); break;
                    case 2: searchTrains(); break;
                    case 3: registerPassenger(); break;
                    case 4: bookTicket(); break;
                    case 5: cancelTicket(); break;
                    case 6: checkPNRStatus(); break;
                    case 7: viewBookingHistory(); break;
                    case 8: 
                        System.out.println("Thank you for using the system. Goodbye!");
                        return;
                    default:
                        System.out.println("Invalid choice. Select between 1 and 8.");
                }
            } catch (Exception e) {
                System.out.println("An unexpected error occurred: " + e.getMessage());
            }
        }
    }

    private void viewAllTrains() {
        printDivider();
        System.out.println("   AVAILABLE TRAINS");
        printDivider();
        List<Train> trains = trainDAO.getAllTrains();
        if (trains.isEmpty()) {
            System.out.println("No trains available.");
        } else {
            for (Train t : trains) {
                System.out.println(t);
            }
        }
    }

    private void searchTrains() {
        printDivider();
        System.out.print("Enter Source Station: ");
        String source = scanner.nextLine().trim();
        System.out.print("Enter Destination Station: ");
        String dest = scanner.nextLine().trim();

        if (source.isEmpty() || dest.isEmpty()) {
            System.out.println("Source and Destination cannot be empty.");
            return;
        }

        List<Train> trains = trainDAO.searchTrains(source, dest);
        printDivider();
        if (trains.isEmpty()) {
            System.out.println("No trains found for this route.");
        } else {
            System.out.println("Trains found:");
            for (Train t : trains) {
                System.out.println(t);
            }
        }
    }

    private void registerPassenger() {
        printDivider();
        System.out.println("   REGISTER PASSENGER");
        printDivider();
        
        System.out.print("Enter Name: ");
        String name = scanner.nextLine().trim();
        if (name.isEmpty()) {
            System.out.println("Name cannot be empty.");
            return;
        }
        
        System.out.print("Enter Age: ");
        String ageStr = scanner.nextLine().trim();
        int age;
        try {
            age = Integer.parseInt(ageStr);
            if(age <= 0) throw new NumberFormatException();
        } catch (NumberFormatException e) {
            System.out.println("Invalid age. Must be a positive number.");
            return;
        }
        
        System.out.print("Enter Gender (Male/Female/Other): ");
        String gender = scanner.nextLine().trim();
        if(!gender.equalsIgnoreCase("Male") && !gender.equalsIgnoreCase("Female") && !gender.equalsIgnoreCase("Other")) {
            System.out.println("Invalid gender.");
            return;
        }
        
        System.out.print("Enter Email: ");
        String email = scanner.nextLine().trim();
        if (email.isEmpty()) {
            System.out.println("Email cannot be empty.");
            return;
        }
        
        Passenger existing = passengerDAO.getPassengerByEmail(email);
        if (existing != null) {
            System.out.println("Email already registered, please log in instead (Passenger ID: " + existing.getPassengerId() + ")");
            return;
        }
        
        System.out.print("Enter Phone (10 digits): ");
        String phone = scanner.nextLine().trim();
        if (!Pattern.matches("^\\d{10}$", phone)) {
            System.out.println("Invalid phone number. Must be 10 digits.");
            return;
        }

        Passenger p = new Passenger();
        p.setName(name);
        p.setAge(age);
        p.setGender(gender.substring(0,1).toUpperCase() + gender.substring(1).toLowerCase());
        p.setEmail(email);
        p.setPhone(phone);

        int id = passengerDAO.registerPassenger(p);
        if (id > 0) {
            System.out.println("Passenger registered successfully! Your Passenger ID is: " + id);
        } else {
            System.out.println("Registration failed. Please try again.");
        }
    }

    private void bookTicket() {
        printDivider();
        System.out.println("   BOOK TICKET");
        printDivider();

        System.out.print("Enter Passenger ID: ");
        String pIdStr = scanner.nextLine().trim();
        int passengerId;
        try {
            passengerId = Integer.parseInt(pIdStr);
        } catch(Exception e) {
            System.out.println("Invalid ID.");
            return;
        }
        
        Passenger p = passengerDAO.getPassengerById(passengerId);
        if (p == null) {
            System.out.println("Passenger not found. Please register first.");
            return;
        }

        System.out.print("Enter Train ID: ");
        String tIdStr = scanner.nextLine().trim();
        int trainId;
        try {
            trainId = Integer.parseInt(tIdStr);
        } catch(Exception e) {
            System.out.println("Invalid Train ID.");
            return;
        }

        Train t = trainDAO.getTrainById(trainId);
        if (t == null) {
            System.out.println("Train not found.");
            return;
        }

        System.out.print("Enter Journey Date (YYYY-MM-DD): ");
        String date = scanner.nextLine().trim();
        if (!Pattern.matches("^\\d{4}-\\d{2}-\\d{2}$", date)) {
            System.out.println("Invalid date format. Use YYYY-MM-DD.");
            return;
        }
        
        try {
            java.sql.Date.valueOf(date);
        } catch (IllegalArgumentException e) {
            System.out.println("Invalid calendar date.");
            return;
        }

        System.out.print("Enter Payment Mode (CASH/CARD/UPI): ");
        String payment = scanner.nextLine().trim().toUpperCase();
        if (!payment.equals("CASH") && !payment.equals("CARD") && !payment.equals("UPI")) {
            System.out.println("Invalid Payment Mode.");
            return;
        }

        String pnr = ticketDAO.bookTicket(trainId, passengerId, date, payment);
        
        if (pnr != null) {
            System.out.println("\nBooking Processed!");
            printTicketReceipt(ticketDAO.getTicketByPNR(pnr));
        } else {
            System.out.println("Booking failed.");
        }
    }

    private void cancelTicket() {
        printDivider();
        System.out.print("Enter PNR Number to Cancel: ");
        String pnr = scanner.nextLine().trim();

        Ticket t = ticketDAO.getTicketByPNR(pnr);
        if (t == null) {
            System.out.println("Ticket with this PNR not found.");
            return;
        }

        if (t.getStatus().equals("CANCELLED")) {
            System.out.println("Ticket is already cancelled.");
            return;
        }

        boolean success = ticketDAO.cancelTicket(pnr);
        if (success) {
            System.out.println("Ticket cancelled successfully! Refund initiated to original payment mode.");
        } else {
            System.out.println("Failed to cancel ticket.");
        }
    }

    private void checkPNRStatus() {
        printDivider();
        System.out.print("Enter PNR Number: ");
        String pnr = scanner.nextLine().trim();

        Ticket t = ticketDAO.getTicketByPNR(pnr);
        if (t != null) {
            printTicketReceipt(t);
        } else {
            System.out.println("Ticket not found.");
        }
    }

    private void viewBookingHistory() {
        printDivider();
        System.out.print("Enter Passenger ID: ");
        try {
            int passengerId = Integer.parseInt(scanner.nextLine().trim());
            List<Ticket> history = ticketDAO.getTicketsByPassenger(passengerId);
            if (history.isEmpty()) {
                System.out.println("No booking history found for this Passenger ID.");
            } else {
                for (Ticket t : history) {
                    System.out.println(t);
                }
            }
        } catch (Exception e) {
            System.out.println("Invalid input.");
        }
    }

    private void printTicketReceipt(Ticket t) {
        if (t == null) return;
        printDivider();
        System.out.println("          TICKET RECEIPT");
        printDivider();
        System.out.printf("PNR Number      : %s%n", t.getPnrNumber());
        System.out.printf("Passenger Name  : %s%n", t.getPassengerName());
        System.out.printf("Train           : %s - %s%n", t.getTrainNumberDisplay(), t.getTrainName());
        System.out.printf("Route           : %s -> %s%n", t.getSource(), t.getDestination());
        System.out.printf("Journey Date    : %s%n", t.getJourneyDate());
        System.out.printf("Seat Number     : %s%n", t.getSeatNumber() > 0 ? String.valueOf(t.getSeatNumber()) : "WAITING");
        System.out.printf("Booking Status  : %s%n", t.getStatus());
        System.out.printf("Total Fare      : ₹%.2f%n", t.getTotalFare());
        System.out.printf("Payment Mode    : %s%n", t.getPaymentMode());
        printDivider();
    }

    private void printDivider() {
        System.out.println("===========================");
    }
}
