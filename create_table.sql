CREATE TABLE User (
    user_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    surname VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address_id INTEGER,
    FOREIGN KEY (address_id) REFERENCES Address(adress_id)
    user_type ENUM('patient', 'doctor', 'pharmacist')
);

CREATE TABLE Doctor (
    user_id INTEGER PRIMARY KEY,
    speciality VARCHAR(255),
    title VARCHAR(255),
    hospital_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (hospital_id) REFERENCES Hospital(hospital_id)
);


CREATE TABLE Pharmacist(
    user_id INTEGER PRIMARY KEY,
    education VARCHAR(255),
    pharmacy_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (pharmacy_id) REFERENCES Pharmacy(pharmacy_id)
);

-- Doctors can not be pharmacists



-- // FIXME 
CREATE TABLE Admin(
    user_id INTEGER PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE Patient(
    user_id INTEGER PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    primary_doc_id INTEGER,
    FOREIGN KEY (primary_doc_id) REFERENCES Doctor(user_id),
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
    adress_id INTEGER NOT NULL,
    FOREIGN KEY (address_id) REFERENCES Address(adress_id)
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

-- //TODO specialization trigerı ekle


CREATE TABLE Medicine (
    med_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    prescription_type VARCHAR(255) NOT NULL,
    used_for VARCHAR(255),
    dosages VARCHAR(255),
    side_effects VARCHAR(255),
    risk_factors VARCHAR(255),
    preserve_conditions VARCHAR(255),
    prod_firm VARCHAR(255)
);

CREATE TABLE Report (
    report_id INTEGER PRIMARY KEY AUTO_INCREMENT ,
    start_date DATE,
    end_date DATE,
    pharmacy_id INTEGER,
    FOREIGN KEY (pharmacy_id) REFERENCES Pharmacy(pharmacy_id)
);

CREATE TABLE MedicineReport (
    report_id INTEGER,
    FOREIGN KEY (report_id) REFERENCES Report(report_id),
    med_id INTEGER,
    FOREIGN KEY (med_id) REFERENCES Medicine(med_id),
    PRIMARY KEY (report_id, med_id)
);

CREATE TABLE Prescription (
    pres_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    prescribed_by INTEGER,
    FOREIGN KEY (prescribed_by) REFERENCES Doctor(user_id),
    prescribed_to INTEGER,
    FOREIGN KEY (prescribed_to) REFERENCES Patient(user_id),
    date DATE,
    type VARCHAR(255)
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
    adress_id INTEGER,
    FOREIGN KEY (address_id) REFERENCES Address(adress_id)
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
    purchase_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    date DATE,
    deduction INTEGER NOT NULL,
    user_id INTEGER UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Patient(user_id),
    wallet_id VARCHAR(255),
    FOREIGN KEY (wallet_id) REFERENCES Wallet(wallet_id)
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
    balance INTEGER NOT NULL,
    payment_id INTEGER NOT NULL,
    FOREIGN KEY (payment_id) REFERENCES PaymentMethod(payment_id)
);

CREATE TABLE PaymentMethod (
    payment_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE RequestedPrescription (
    doctor_id INTEGER,
    patient_id INTEGER,
    pres_id INTEGER,
    PRIMARY KEY (doctor_id, patient_id, pres_id)
);

CREATE TABLE EquivalentTo (
    orig_id INTEGER,
    eqv_id INTEGER,
    PRIMARY KEY (orig_id, eqv_id)
);