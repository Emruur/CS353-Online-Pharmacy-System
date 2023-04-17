CREATE TABLE User (
    user_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    surname VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
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
    height INTEGER,
    weight INTEGER,
    birthday DATE,
    age INT GENERATED ALWAYS AS (DATEDIFF(CURRENT_DATE, birth_date) / 365) VIRTUAL
    -- // birthday ve age mi?
);

-- // FIXME
-- TODO Adresi usera bağlı weak entity mi yapsak?
CREATE TABLE Adress(
    address_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER NOT NULL,
    country VARCHAR(255),
    city VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);


-- //FIXME
-- Adres meselesini birdaha düşünelim, bunda adresin field olması normalizationa karşı
CREATE TABLE Hospital(
    hospital_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    adress,
);


-- // FIXME
-- Special condition niye weak entity, birçok userın ortak conditionu olabilir
CREATE TABLE SpecialCondition(
    user_id INTEGER NOT NULL,
    condition_name VARCHAR(255) NOT NULL,
    condition_description VARCHAR(255),
    PRIMARY KEY (user_id, condition_name)
);

-- //TODO specialization trigerı ekle
