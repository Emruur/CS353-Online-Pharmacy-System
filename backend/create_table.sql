DROP TABLE IF EXISTS AssignedPatients;
DROP TABLE IF EXISTS EquivalentTo;
DROP TABLE IF EXISTS RequestedPrescription;
DROP TABLE IF EXISTS PurchasedMedicine;
DROP TABLE IF EXISTS Purchase;
DROP TABLE IF EXISTS Wallet;
DROP TABLE IF EXISTS PaymentMethod;
DROP TABLE IF EXISTS StoredIn;
DROP TABLE IF EXISTS PrescribedMedication;
DROP TABLE IF EXISTS Prescription;
DROP TABLE IF EXISTS Report;
DROP TABLE IF EXISTS Medicine;
DROP TABLE IF EXISTS UserCondition;
DROP TABLE IF EXISTS SpecialCondition;
DROP TABLE IF EXISTS Patient;
DROP TABLE IF EXISTS Admin;
DROP TABLE IF EXISTS Pharmacist;
DROP TABLE IF EXISTS Doctor;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Pharmacy;
DROP TABLE IF EXISTS Hospital;
DROP TABLE IF EXISTS Address;

CREATE TABLE Address(
    address_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    country VARCHAR(255),
    city VARCHAR(255),
    district VARCHAR(255),
    description VARCHAR(255)
);

CREATE TABLE User (
    user_id VARCHAR(11) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    surname VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address_id INTEGER,
    FOREIGN KEY (address_id) REFERENCES Address(address_id) ON DELETE CASCADE,
    user_type ENUM('patient', 'doctor', 'pharmacist') NOT NULL
);
CREATE TABLE Hospital(
    hospital_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    address_id INTEGER NOT NULL,
    FOREIGN KEY (address_id) REFERENCES Address(address_id)
);
CREATE TABLE Doctor (
    user_id VARCHAR(11) PRIMARY KEY,
    speciality VARCHAR(255),
    title VARCHAR(255),
    hospital_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (hospital_id) REFERENCES Hospital(hospital_id)
);
CREATE TABLE Pharmacy (
    pharmacy_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    address_id INTEGER,
    FOREIGN KEY (address_id) REFERENCES Address(address_id)
);
CREATE TABLE Pharmacist(
    user_id VARCHAR(11) PRIMARY KEY,
    education VARCHAR(255),
    pharmacy_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (pharmacy_id) REFERENCES Pharmacy(pharmacy_id)
);
CREATE TABLE Admin(
    admin_id INTEGER PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
CREATE TABLE Patient(
    user_id VARCHAR(11) PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    primary_doc_id VARCHAR(11),
    FOREIGN KEY (primary_doc_id) REFERENCES Doctor(user_id),
    height INTEGER,
    weight INTEGER,
    birthday DATE,
    age INT
);

CREATE TABLE SpecialCondition(
    condition_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    condition_name VARCHAR(255) NOT NULL
);
CREATE TABLE UserCondition(
    condition_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (condition_id, user_id)
);
CREATE TABLE Medicine (
    med_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    prescription_type ENUM('white', 'red', 'green', 'orange', 'purple') NOT NULL,
    used_for VARCHAR(255),
    dosages VARCHAR(255),
    side_effects VARCHAR(255),
    risk_factors VARCHAR(255),
    preserve_conditions VARCHAR(255),
    prod_firm VARCHAR(255),
    price Numeric(10, 2) NOT NULL,
    med_type VARCHAR(255),
    min_age INTEGER
);

CREATE TABLE Prescription (
    pres_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    prescribed_by VARCHAR(11),
    FOREIGN KEY (prescribed_by) REFERENCES Doctor(user_id),
    prescribed_to VARCHAR(11),
    FOREIGN KEY (prescribed_to) REFERENCES Patient(user_id),
    date DATE,
    type ENUM('white', 'red', 'green', 'orange', 'purple') NOT NULL,
    notes TEXT,
    status ENUM("valid", "used", "expired")
);
CREATE TABLE PrescribedMedication (
    pres_id INTEGER,
    med_count INTEGER,
    FOREIGN KEY (pres_id) REFERENCES Prescription(pres_id),
    med_id INTEGER,
    FOREIGN KEY (med_id) REFERENCES Medicine(med_id),
    PRIMARY KEY (pres_id, med_id)
);

CREATE TABLE Report (
    report_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    start_date DATE,
    end_date DATE,
    data TEXT,
    pharmacy_id INTEGER,
    FOREIGN KEY (pharmacy_id) REFERENCES Pharmacy(pharmacy_id)
);
CREATE TABLE StoredIn (
    pharmacy_id INTEGER,
    FOREIGN KEY (pharmacy_id) REFERENCES Pharmacy(pharmacy_id),
    med_id INTEGER,
    FOREIGN KEY (med_id) REFERENCES Medicine(med_id),
    amount INTEGER NOT NULL,
    PRIMARY KEY (pharmacy_id, med_id)
);
CREATE TABLE PaymentMethod (
    payment_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL
);
CREATE TABLE Wallet (
    wallet_id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    balance Numeric(10, 2) NOT NULL,
    payment_id INTEGER NOT NULL,
    FOREIGN KEY (payment_id) REFERENCES PaymentMethod(payment_id)
);
CREATE TABLE Purchase (
    purchase_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    pharmacy_id INTEGER,
    date DATE,
    deduction Numeric(10, 2) NOT NULL,
    wallet_id INTEGER,
    user_id varchar(11),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (wallet_id) REFERENCES Wallet(wallet_id),
    FOREIGN KEY (pharmacy_id) REFERENCES Pharmacy(pharmacy_id)
);
CREATE TABLE PurchasedMedicine (
    purchase_id INTEGER,
    purchase_count INTEGER,
    FOREIGN KEY (purchase_id) REFERENCES Purchase(purchase_id),
    med_id INTEGER,
    FOREIGN KEY (med_id) REFERENCES Medicine(med_id),
    PRIMARY KEY (purchase_id, med_id)
);


CREATE TABLE RequestedPrescription (
    doctor_id varchar(11),
    patient_id varchar(11),
    pres_id INTEGER,
    status ENUM ("pending", "accepted", "rejected") DEFAULT 'pending',
    FOREIGN KEY (doctor_id) REFERENCES Doctor(user_id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES Patient(user_id) ON DELETE CASCADE,
    FOREIGN KEY (pres_id) REFERENCES Prescription(pres_id) ON DELETE CASCADE,
    PRIMARY KEY (doctor_id, patient_id, pres_id)
);
CREATE TABLE EquivalentTo (
    orig_id INTEGER,
    eqv_id INTEGER,
    PRIMARY KEY (orig_id, eqv_id)
    -- FIXME no foreign key
);

-- FIXED TABLE VALUES (INITIALS)
INSERT INTO Address (country, city, district, description)
VALUES
    ("Turkey", "Ankara", "Akyurt", "Beyazıt Mahallesi, 9 Mayıs 90. Caddesi No:6/B"),
    ("Turkey", "Ankara", "Akyurt", "Yıldırım Mahallesi, Dr.Neslihan Özenli Caddesi, No:26/A"),
    ("Turkey", "Ankara", "Akyurt", "Yıldırım Mahallesi, Cumhuriyet Meydanı No:13"),
    ("Turkey", "Ankara", "Altındağ", "Feridun Çelik Mahallesi, 1669. Caddesi, No:18/A"),
    ("Turkey", "Ankara", "Altındağ", "Şükriye Mahallesi, Ulucanlar Caddesi, Ses Sokak No:81/A Ulucanlar"),
    ("Turkey", "Ankara", "Keçiören", "Karakaya Mahallesi, Bağlum Bulvarı No:107/B"),
    ("Turkey", "Ankara", "Keçiören", "Aşağı Eğlence Mahallesi, Altınoluk Sokak No:4/B"),
    ("Turkey", "Ankara", "Sincan", "Akşemsettin Mahallesi, Fecri Ebcioğlu Sokak No:7/A");

INSERT INTO Pharmacy (name, address_id)
VALUES
    ("Beyazıt Eczanesi", 1),
    ("Nur Eczanesi", 2),
    ("Hayat Eczanesi", 3),
    ("Bahar Eczanesi", 4),
    ("Kaçkar Eczanesi", 5),
    ("Nimet Eczanesi", 6),
    ("Birsen Eczanesi", 7),
    ("Hazar Eczanesi", 8);

INSERT INTO Hospital (hospital_id, name, address_id)
VALUES
    (1, "Ankara Şehir Hastanesi", 1),
    (2, "Ankara Etlik Şehir Hastanesi", 2),
    (3, "Gülhane Eğitim ve Araştırma Hastanesi", 3),
    (4, "Beytepe Murat Erdi Eker Devlet Hastanesi", 4),
    (5, "Haymana Devlet Hastanesi", 5),
    (6, "Ankara Atatürk Sanatoryum Eğitim ve Araştırma Hastanesi", 6),
    (7, "Gazi Üniversitesi Tıp Fakültesi Gazi Hastanesi", 7),
    (8, "Hacettepe Üniversitesi İhsan Doğramacı Çocuk Hastanesi", 8);


-- TRIGGERS

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

-- Before insert into purchase check existence of an address
DELIMITER //
CREATE TRIGGER address_before_purchase BEFORE
INSERT ON Purchase FOR EACH ROW BEGIN
DECLARE is_exists TINYINT(1);
SELECT EXISTS(
        SELECT 1
        FROM Address
        WHERE address_id = NEW.address_id
    ) INTO is_exists;
IF NOT is_exists THEN SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Error: No such address exists!';
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

-- views
CREATE VIEW patient_prescription AS
SELECT u.user_id, p.pres_id,p2.med_id
FROM user u
    join prescription p on u.user_id = p.prescribed_to
    join prescribedmedication p2 on p.pres_id = p2.pres_id
WHERE p.status='valid';


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
