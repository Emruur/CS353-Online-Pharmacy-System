CREATE TABLE User (
    user_id INTEGER PRIMARY KEY,
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


CREATE TABLE Doctor (
    user_id INTEGER PRIMARY KEY,
    speciality VARCHAR(255),
    title VARCHAR(255),
    hospital_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (hospital_id) REFERENCES Hospital(hospital_id)
);


CREATE TABLE Pharmacist(
    user_id INTEGER PRIMARY KEY,
    education VARCHAR(255),
    pharmacy_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (pharmacy_id) REFERENCES Pharmacy(pharmacy_id)
);

CREATE TABLE Admin(
    admin_id INTEGER PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
);

CREATE TABLE Patient(
    user_id INTEGER PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    primary_doc_id INTEGER,
    FOREIGN KEY (primary_doc_id) REFERENCES Doctor(user_id) ON DELETE CASCADE,
    height INTEGER,
    weight INTEGER,
    birthday DATE,
    age INT GENERATED ALWAYS AS (DATEDIFF(CURRENT_DATE, birth_date) / 365) VIRTUAL
);

CREATE TABLE Address(
    address_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    country VARCHAR(255),
    city VARCHAR(255),
    description VARCHAR(255)
);

CREATE TABLE Hospital(
    hospital_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    address_id INTEGER NOT NULL,
    FOREIGN KEY (address_id) REFERENCES Address(address_id)
);

CREATE TABLE SpecialCondition(
    condition_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    condition_name VARCHAR(255) NOT NULL,
);

CREATE TABLE UserCondition(
    condition_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (condition_id, user_id)
);

CREATE TABLE Medicine (
    med_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    prescription_type VARCHAR(255) NOT NULL,
    used_for VARCHAR(255),
    dosages VARCHAR(255),
    side_effects VARCHAR(255),
    risk_factors VARCHAR(255),
    preserve_conditions VARCHAR(255),
    prod_firm VARCHAR(255),
    price Numeric(10,2) NOT NULL
);


CREATE TABLE Report (
    report_id INTEGER PRIMARY KEY AUTO_INCREMENT ,
    start_date DATE,
    end_date DATE,
    data TEXT,
    pharmacy_id INTEGER,
    FOREIGN KEY (pharmacy_id) REFERENCES Pharmacy(pharmacy_id)
);

CREATE TABLE Prescription (
    pres_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    prescribed_by INTEGER,
    FOREIGN KEY (prescribed_by) REFERENCES Doctor(user_id),
    prescribed_to INTEGER,
    FOREIGN KEY (prescribed_to) REFERENCES Patient(user_id),
    date DATE,
    type VARCHAR(255),
    status enum("valid","used", "expired")
);

CREATE TABLE PrescribedMedication (
    pres_id INTEGER,
    FOREIGN KEY (pres_id) REFERENCES Prescription(pres_id),
    med_id INTEGER,
    FOREIGN KEY (med_id) REFERENCES Medicine(med_id),
    PRIMARY KEY (pres_id, med_id)
);

CREATE TABLE Pharmacy (
    pharmacy_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    address_id INTEGER,
    FOREIGN KEY (address_id) REFERENCES Address(address_id)
);

CREATE TABLE StoredIn (
    pharmacy_id INTEGER,
    FOREIGN KEY (pharmacy_id) REFERENCES Pharmacy(pharmacy_id),
    med_id INTEGER,
    FOREIGN KEY (med_id) REFERENCES Medicine(med_id),
    amount INTEGER NOT NULL,
    PRIMARY KEY (pharmacy_id, med_id)
);

CREATE TABLE Purchase (
    purchase_id INTEGER PRIMARY KEY,
    pharmacy_id INTEGER,
    date DATE,
    deduction Numeric(10,2) NOT NULL,
    wallet_id VARCHAR(255),
    FOREIGN KEY (wallet_id) REFERENCES Wallet(wallet_id),
    FOREIGN KEY (pharmacy_id) REFERENCES Pharmacy(pharmacy_id),
);

CREATE TABLE PurchasedMedicine (
    purchase_id INTEGER,
    FOREIGN KEY (purchase_id) REFERENCES Purchase(purchase_id),
    med_id INTEGER,
    FOREIGN KEY (med_id) REFERENCES Medicine(med_id),
    PRIMARY KEY (purchase_id, med_id)
);

CREATE TABLE Wallet (
    wallet_id VARCHAR(255) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    balance Numeric(10,2) NOT NULL,
    payment_id INTEGER NOT NULL,
    FOREIGN KEY (payment_id) REFERENCES PaymentMethod(payment_id)
);

-- // create trigger to deduce balance on purchase

CREATE TABLE PaymentMethod (
    payment_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE RequestedPrescription (
    doctor_id INTEGER,
    patient_id INTEGER,
    pres_id INTEGER,
    status VARCHAR(255) NOT NULL,
    PRIMARY KEY (doctor_id, patient_id, pres_id),
    status ENUM ("pending","accepted","rejected") DEFAULT 'pending'
);

CREATE TABLE EquivalentTo (
    orig_id INTEGER,
    eqv_id INTEGER,
    PRIMARY KEY (orig_id, eqv_id)
);

    -- TRIGGERS

-- Doctors can not be pharmacists

CREATE TRIGGER doctor_not_pharmacists
BEFORE INSERT
ON Pharmacist FOR EACH ROW
BEGIN
    DECLARE is_doctor TINYINT(1);

    SET is_doctor = (
        SELECT EXISTS(
            SELECT 1
            FROM Doctors
            WHERE doctor_id = NEW.pharmacist_id
        )
    );

    IF is_doctor = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: A doctor can not be a pharmacist!';
    END IF;
END;

-- Pharmacists can not be doctor

CREATE TRIGGER pharmacist_not_doctor
BEFORE INSERT
ON Doctor FOR EACH ROW
BEGIN
    DECLARE is_pharmacist TINYINT(1);

    SET is_pharmacist = (
        SELECT EXISTS(
            SELECT 1
            FROM Pharmacist
            WHERE pharmacist_id = NEW.doctor_id
        )
    );
    IF is_pharmacist = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: A pharmacist can not be a doctor!';
    END IF;
END;

-- Before insert into purchase check existence of an address

CREATE TRIGGER address_before_purchase
BEFORE INSERT
ON Purchase FOR EACH ROW
BEGIN
    DECLARE address VARCHAR(50)

    SET address = (
        SELECT adress_id FROM User
        WHERE User.user_id = (
            SELECT user_id
            FROM Wallet
            WHERE wallet_id= Purchase.wallet_id
        );
    );
    IF adress = NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: User needs an adress before placing a purchase!';
    END IF;
END;

CREATE TRIGGER reduce_balance_on_purchase
BEFORE INSERT
ON Purchase FOR EACH ROW
BEGIN
    DECLARE total = Numeric(10,2)
    DECLARE balance= Numeric(10,2)

    SET total = (
        SELECT sum(price)
        FROM Medicine
        NATURAL JOIN PurchasedMedicine
        WHERE PurchasedMedicine.purchase_id= NEW.purchase_id);

    SET balance = (SELECT balance
        FROM Wallet WHERE wallet_id= NEW.wallet_id)

    IF balance < total
        -- Remove all purchasedmedicine entities
        DELETE FROM PurchasedMedicine
        WHERE purchase_id= NEW.purchase_id

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: not enough money!';
    END IF;

    UPDATE Wallet
    SET balance = balance - total;
    WHERE Wallet(wallet_id) = NEW.wallet_id;

    -- Update Purchase deduction
    SET NEW.deduction= total
END;


-- //TODO change prescription status trigger


-- //TODO create trigger to set Pharmacist(pharmacy_id) on Pharmcy deletion




    -- Doctors patients view
CREATE VIEW AssignedPatients AS
SELECT *
FROM Patient NATURAL JOIN User
WHERE primary_doc_id= @doctor_id


