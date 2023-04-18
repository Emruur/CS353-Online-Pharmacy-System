CREATE TABLE Medicine (
    med_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    prescription_type VARCHAR(255) NOT NULL,
    prospectus VARCHAR(255),
    used_for VARCHAR(255),
    dosages VARCHAR(255),
    side_effects VARCHAR(255),
    risk_factors VARCHAR(255),
    preserve_conditions VARCHAR(255),
    prod_firm VARCHAR(255)
);

CREATE TABLE Report (
    report_id INTEGER PRIMARY KEY AUTO_INCREMENT,
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
    address VARCHAR(255),
    name VARCHAR(255) NOT NULL
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
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    wallet_type VARCHAR(255),
    FOREIGN KEY (wallet_type) REFERENCES Wallet(wallet_type)
);

CREATE TABLE PurchasedMedicine (
    purchase_id INTEGER,
    FOREIGN KEY (purchase_id) REFERENCES Purchase(purchase_id),
    med_id INTEGER,
    FOREIGN KEY (med_id) REFERENCES Medicine(med_id),
    PRIMARY KEY (purchase_id, med_id)
);

CREATE TABLE Wallet (
    user_id INTEGER,
    wallet_type VARCHAR(255) NOT NULL,
    balance INTEGER NOT NULL,
    payment_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, wallet_type),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (payment_id) REFERENCES PaymentMethod(payment_id)
);

CREATE TABLE PaymentMethod (
    payment_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL
);