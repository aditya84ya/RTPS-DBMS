DROP DATABASE IF EXISTS train_booking_db;
CREATE DATABASE train_booking_db;
USE train_booking_db;

DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS passengers;
DROP TABLE IF EXISTS trains;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trains (
    train_id INT PRIMARY KEY AUTO_INCREMENT,
    train_number VARCHAR(10) UNIQUE NOT NULL,
    train_name VARCHAR(100) NOT NULL,
    source_station VARCHAR(100) NOT NULL,
    destination_station VARCHAR(100) NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    fare_per_seat DECIMAL(10,2) NOT NULL
);

CREATE TABLE passengers (
    passenger_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender ENUM('Male','Female','Other') NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL
);

CREATE TABLE tickets (
    ticket_id INT PRIMARY KEY AUTO_INCREMENT,
    pnr_number VARCHAR(15) UNIQUE NOT NULL,
    train_id INT NOT NULL,
    passenger_id INT NOT NULL,
    user_id INT NOT NULL,
    journey_date DATE NOT NULL,
    seat_number INT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('CONFIRMED','CANCELLED','WAITING') DEFAULT 'CONFIRMED',
    total_fare DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (train_id) REFERENCES trains(train_id),
    FOREIGN KEY (passenger_id) REFERENCES passengers(passenger_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_mode ENUM('CASH','CARD','UPI') NOT NULL,
    payment_status ENUM('SUCCESS','FAILED','REFUNDED') DEFAULT 'SUCCESS',
    FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id)
);

-- Insert 5 sample trains
INSERT INTO trains (train_number, train_name, source_station, destination_station, departure_time, arrival_time, total_seats, available_seats, fare_per_seat) VALUES
('12163', 'Chennai Express', 'Chennai', 'Mumbai', '18:00:00', '19:45:00', 500, 500, 1500.00),
('12301', 'Rajdhani Express', 'Kolkata', 'Delhi', '16:50:00', '10:00:00', 800, 800, 2500.00),
('12785', 'Kacheguda Express', 'Bangalore', 'Hyderabad', '18:20:00', '05:40:00', 600, 600, 850.00),
('12627', 'Karnataka Express', 'Bangalore', 'Delhi', '19:20:00', '09:00:00', 700, 700, 2100.00),
('12839', 'Chennai Mail', 'Chennai', 'Kolkata', '23:55:00', '03:30:00', 450, 450, 1800.00);

-- Stored Procedures
DELIMITER //

DROP PROCEDURE IF EXISTS sp_book_ticket //
CREATE PROCEDURE sp_book_ticket(
    IN p_train_id INT,
    IN p_passenger_id INT,
    IN p_user_id INT,
    IN p_journey_date DATE,
    IN p_payment_mode VARCHAR(10),
    OUT pnr_out VARCHAR(15)
)
BEGIN
    DECLARE v_available_seats INT;
    DECLARE v_fare DECIMAL(10,2);
    DECLARE v_status VARCHAR(10) DEFAULT 'CONFIRMED';
    DECLARE v_seat_number INT;
    DECLARE v_ticket_id INT;

    -- Error handler for rollback
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Lock the train row for update and read values
    SELECT available_seats, fare_per_seat INTO v_available_seats, v_fare 
    FROM trains WHERE train_id = p_train_id FOR UPDATE;

    IF v_available_seats > 0 THEN
        SET v_status = 'CONFIRMED';
        SET v_seat_number = v_available_seats; -- Assumes descending seat numbers
        -- Decrement seats
        UPDATE trains SET available_seats = available_seats - 1 WHERE train_id = p_train_id;
    ELSE
        SET v_status = 'WAITING';
        SET v_seat_number = 0;
    END IF;

    -- Generate PNR
    SET pnr_out = CONCAT('PNR', LPAD(UNIX_TIMESTAMP(), 12, '0'));

    -- Insert into tickets
    INSERT INTO tickets (pnr_number, train_id, passenger_id, user_id, journey_date, seat_number, status, total_fare)
    VALUES (pnr_out, p_train_id, p_passenger_id, p_user_id, p_journey_date, v_seat_number, v_status, v_fare);

    SET v_ticket_id = LAST_INSERT_ID();

    -- Insert into payments
    INSERT INTO payments (ticket_id, amount, payment_mode, payment_status)
    VALUES (v_ticket_id, v_fare, p_payment_mode, 'SUCCESS');

    COMMIT;
END //

DROP PROCEDURE IF EXISTS sp_cancel_ticket //
CREATE PROCEDURE sp_cancel_ticket(
    IN p_pnr_number VARCHAR(15),
    IN p_user_id INT
)
BEGIN
    DECLARE v_ticket_id INT;
    DECLARE v_train_id INT;
    DECLARE v_status VARCHAR(10);
    DECLARE v_owner_id INT;

    -- Error handler for rollback
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT ticket_id, train_id, status, user_id INTO v_ticket_id, v_train_id, v_status, v_owner_id 
    FROM tickets WHERE pnr_number = p_pnr_number FOR UPDATE;

    -- Ensure ticket belongs to the user requesting cancellation
    IF v_owner_id = p_user_id AND v_status = 'CONFIRMED' THEN
        -- Update ticket status
        UPDATE tickets SET status = 'CANCELLED' WHERE ticket_id = v_ticket_id;

        -- Increment available seats
        UPDATE trains SET available_seats = available_seats + 1 WHERE train_id = v_train_id;

        -- Update payment status
        UPDATE payments SET payment_status = 'REFUNDED' WHERE ticket_id = v_ticket_id;
    ELSEIF v_owner_id != p_user_id THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unauthorized cancellation attempt.';
    END IF;

    COMMIT;
END //

DELIMITER ;
