#!/bin/bash

echo "Testing Signup..."
curl -X POST -H "Content-Type: application/json" -d '{
    "user_id": "27256389765",
    "email": "test@test.com",
    "password": "testpassword",
    "first_name": "John",
    "middle_name": "Doe",
    "surname": "Smith",
    "phone_number": "+1234567890",
    "user_type": "patient"
}' "http://localhost:5000/auth/signup"
