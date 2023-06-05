import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Card, CardHeader } from "@mui/material";
import avatarImage from '../../assets/images/avatar.jpg';
import axios from 'axios';

const PatientDashboard = () => {
  const [activePage] = useState("personal");
  const token = "Bearer " + sessionStorage.getItem("token");

  const PersonalInfo = () => {
	const [personalData, setPersonalData] = useState(null);
  
	useEffect(() => {
	  axios.get('/users/getProfile')
		.then(response => {
		  setPersonalData(response.data);
		})
		.catch(error => {
		  console.error('Error retrieving personal info:', error);
		});
	}, []); 
  
	if (!personalData) {
	  return <div>Loading...</div>;
	}
  
	return (
	  <div style={{ display: 'flex', alignItems: 'center' }}>
		<img src={avatarImage} alt="Profile Picture" style={{ marginRight: '16px', width: '200px', height: '250px' }} />
		<div>
		  <h2>Personal Information</h2>
		  <p>Name: {personalData.name}</p>
		  <p>Surname: {personalData.surname}</p>
		  <p>Title: {personalData.title}</p>
		  <p>Phone Number: {personalData.phoneNumber}</p>
		  <p>Email: {personalData.email}</p>
		</div>
	  </div>
	);
  };
  

  return (
    <>
      <Container maxWidth="md">
        <Grid container spacing={3}>
          <Grid item lg={12} md={12} xl={15} xs={12}>
            <Card>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CardHeader titleTypographyProps={{ variant: 'h3', fontWeight: 'bold' }} title="Patient Dashboard" />
              </Box>
              <div>
                <nav>
                  <ul></ul>
                </nav>
                <div className="content">
                  {activePage === "personal" && <PersonalInfo />}
                </div>
              </div>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default PatientDashboard;
