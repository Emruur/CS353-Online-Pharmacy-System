#!/bin/bash

# Prompt the user to enter an email
read -p "Please enter your email (default: test@test.com): " email
# If no email is entered, use the default value
email=${email:-test@test.com}

# Prompt the user to enter a password
read -p "Please enter your password (default: testpassword): " password
# If no password is entered, use the default value
password=${password:-testpassword}

# Use the entered email and password to generate and execute the curl command
echo "Testing Login..."
curl -X POST -H "Content-Type: application/json" -d '{
    "email": "'$email'",
    "password": "'$password'"
}' "http://localhost:5000/auth/login"
