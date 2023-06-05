import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Card, CardHeader } from "@mui/material";
import avatarImage from '../../assets/images/patient_avatar.png';
import axios from 'axios_config';

const PatientDashboard = () => {
  const [activePage] = useState("personal");
  const token = "Bearer " + sessionStorage.getItem("token");

  const PersonalInfo = () => {
	const [personalData, setPersonalData] = useState(null);
  
	useEffect(() => {
		axios.get('/users/getProfile', {
			headers: {
			  Authorization: token,
			},
		  })
		.then(response => {
		  setPersonalData(response.data[0]);
		  console.log(response.data)
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
		<img src={avatarImage} alt="Profile Picture" style={{ marginRight: '16px', width: '270px', height: '300px' }} />
		<div>
			<h2><strong>Personal Information</strong></h2>
			<p><strong>Name:</strong> {personalData?.first_name + " " + personalData?.middle_name}</p>
			<p><strong>Surname:</strong> {personalData.surname}</p>
			<p><strong>Title:</strong> Patient</p>
			<p><strong>Phone Number:</strong> {personalData.phone_number}</p>
			<p><strong>Email:</strong> {personalData.email}</p>
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
