curl -X POST -H "Content-Type: application/json" -d '{
    "user_id": "29256389766",
    "email": "patient@test.com",
    "password": "testpassword",
    "first_name": "Pat",
    "middle_name": "Doe",
    "surname": "Smith",
    "phone_number": "+1434567892",
    "user_type": "patient",
    "type_specific": {
        "height": "178",
        "weight": "77",
        "birthday": "2002-03-28"
    }
}' "http://localhost:5000/auth/signup"

curl -X POST -H "Content-Type: application/json" -d '{
    "user_id": "25256389745",
    "email": "doc@test.com",
    "password": "testpassword",
    "first_name": "Doc",
    "middle_name": "Doe",
    "surname": "Smith",
    "phone_number": "+1234567000",
    "user_type": "doctor",
    "type_specific": {
        "speciality": "KBB"
    }
}' "http://localhost:5000/auth/signup"

curl -X POST -H "Content-Type: application/json" -d '{
    "user_id": "25256389556",
    "email": "phar@test.com",
    "password": "testpassword",
    "first_name": "Phar",
    "middle_name": "Doe",
    "surname": "Smith",
    "phone_number": "+1234565692",
    "user_type": "pharmacist",
    "type_specific": {
        "education": "pharmacist?"
    }
}' "http://localhost:5000/auth/signup"
