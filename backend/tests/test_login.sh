#!/bin/bash

# Prompt the user to enter an access token
read -p "Please enter your access token: " access_token

# Use the entered access token to generate and execute the curl command
curl -X GET -H "Authorization: Bearer $access_token" "http://localhost:5000/auth/protected"
