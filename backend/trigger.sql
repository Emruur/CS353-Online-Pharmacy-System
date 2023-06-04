-- TRIGGERS
DROP VIEW IF EXISTS patient_prescription;
DROP EVENT IF EXISTS check_presc_valid;
DROP TRIGGER IF EXISTS doctor_not_pharmacists;
DROP TRIGGER IF EXISTS pharmacist_not_doctor;
DROP TRIGGER IF EXISTS pharmacy_before_purchase;
DROP TRIGGER IF EXISTS before_insert_patient;
DROP TRIGGER IF EXISTS before_update_patient;
DROP TRIGGER IF EXISTS check_doctor_insert;
DROP TRIGGER IF EXISTS check_request_insert;
DROP TRIGGER IF EXISTS check_prescription_to_oneself;
DROP TRIGGER IF EXISTS check_prescription_max;
DROP TRIGGER IF EXISTS balance_check;
DROP TRIGGER IF EXISTS check_amount;

-- Doctors can not be pharmacists
DELIMITER //
CREATE TRIGGER doctor_not_pharmacists
BEFORE INSERT ON Pharmacist
FOR EACH ROW
BEGIN
    DECLARE is_doctor INT;

    SELECT COUNT(*)
    INTO is_doctor
    FROM Doctor
    WHERE user_id = NEW.user_id;

    IF is_doctor > 0 THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: A doctor can not be a pharmacist!';
    END IF;
END; //
DELIMITER ;

-- Pharmacists can not be doctor
DELIMITER //
CREATE TRIGGER pharmacist_not_doctor BEFORE
INSERT ON Doctor FOR EACH ROW BEGIN
DECLARE is_pharmacist TINYINT(1);
SELECT EXISTS(
        SELECT 1
        FROM Pharmacist
        WHERE user_id = NEW.user_id
    ) INTO is_pharmacist;
IF is_pharmacist THEN SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Error: A pharmacist can not be a doctor!';
END IF;
END;//
DELIMITER ;

-- Before insert into purchase check existence of an pharmacy
DELIMITER //
CREATE TRIGGER pharmacy_before_purchase BEFORE
INSERT ON Purchase FOR EACH ROW BEGIN
DECLARE is_exists TINYINT(1);
SELECT EXISTS(
        SELECT 1
        FROM Pharmacy
        WHERE pharmacy_id = NEW.pharmacy_id
    ) INTO is_exists;
IF NOT is_exists THEN SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Error: No such pharmacy exists!';
END IF;
END;//
DELIMITER ;

DELIMITER //
CREATE TRIGGER before_insert_patient
BEFORE INSERT ON Patient
FOR EACH ROW
BEGIN
    SET NEW.age = TIMESTAMPDIFF(YEAR, NEW.birthday, CURDATE());
END; //

CREATE TRIGGER before_update_patient
BEFORE UPDATE ON Patient
FOR EACH ROW
BEGIN
    SET NEW.age = TIMESTAMPDIFF(YEAR, NEW.birthday, CURDATE());
END;//

DELIMITER ;

DELIMITER //
CREATE TRIGGER check_doctor_insert
BEFORE INSERT ON prescription
FOR EACH ROW
BEGIN
    DECLARE is_doctor INT;

    SELECT COUNT(*) INTO is_doctor
    FROM doctor
    WHERE user_id = NEW.prescribed_by;


    IF is_doctor = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Only doctors can add prescriptions.!';
    END IF;
END; //
DELIMITER ;

DELIMITER //
CREATE TRIGGER check_request_insert
BEFORE INSERT ON RequestedPrescription
FOR EACH ROW
BEGIN
    DECLARE is_requested INT;

    SELECT COUNT(*) INTO is_requested
    FROM RequestedPrescription
    WHERE patient_id = NEW.patient_id and pres_id=NEW.pres_id and status = 'pending';


    IF is_requested = 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'There is already a pending request!';
    END IF;
END; //
DELIMITER ;

DELIMITER //
CREATE TRIGGER check_prescription_to_oneself
BEFORE INSERT ON Prescription
FOR EACH ROW
BEGIN
     IF NEW.prescribed_by = NEW.prescribed_to THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Doctor cannot prescribe to themselves.';
    END IF;
END; //
DELIMITER ;

DELIMITER //
CREATE TRIGGER check_prescription_max
BEFORE INSERT ON PrescribedMedication
FOR EACH ROW
BEGIN
     IF NEW.med_count > 5 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Doctor cannot prescribe more than 5 of same medicine!';
    END IF;
END; //
DELIMITER ;

-- views

CREATE VIEW patient_prescription AS
SELECT u.user_id, p.pres_id,p2.med_id
FROM user u
    join prescription p on u.user_id = p.prescribed_to
    join prescribedmedication p2 on p.pres_id = p2.pres_id
WHERE p.status='valid';


CREATE VIEW patient_prescription_all AS
SELECT doc.first_name as doctor_name, doc.middle_name as doctor_middle_name,
       doc.surname as doctor_surname, u.user_id, p.pres_id, p2.med_id,
       p2.med_count, name, prescription_type, used_for, side_effects, date
FROM User u
    JOIN Prescription p ON u.user_id = p.prescribed_to
    JOIN PrescribedMedication p2 ON p.pres_id = p2.pres_id
    JOIN Medicine ON p2.med_id = Medicine.med_id
    JOIN User doc on p.prescribed_by = doc.user_id

DELIMITER //
CREATE TRIGGER balance_check BEFORE UPDATE ON Wallet
FOR EACH ROW 
BEGIN
   IF NEW.balance < 0 THEN 
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Balance cannot be negative';
   END IF;
END;//
DELIMITER ;

DELIMITER //
CREATE TRIGGER check_amount BEFORE UPDATE ON StoredIn
FOR EACH ROW 
BEGIN
   IF NEW.amount < 0 THEN 
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Amount cannot be negative';
   END IF;
END;//
DELIMITER ;


-- events
DELIMITER //
CREATE EVENT check_presc_valid
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
    UPDATE prescription p
    SET p.status = 'expired'
    WHERE DATEDIFF(NOW(), p.date) >= 4;
END;//
DELIMITER ;
