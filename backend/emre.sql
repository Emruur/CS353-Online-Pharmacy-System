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
    -- // birthday ve age mi?
);


CREATE TABLE Adress(
    address_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    country VARCHAR(255),
    city VARCHAR(255),
    description VARCHAR(255)
);

CREATE TABLE Hospital(
    hospital_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    adress_id INTEGER,
    FOREIGN KEY (address_id) REFERENCES Address(adress_id)
);

CREATE TABLE SpecialCondition(
    condition_id INTEGER NOT PRIMARY KEY,
    condition_name VARCHAR(255) NOT NULL,
);

CREATE TABLE user_condition(
    condition_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (condition_id, user_id)
);

-- //TODO specialization trigerı ekle
