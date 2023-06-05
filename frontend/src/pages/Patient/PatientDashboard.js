import React, { useState } from "react";
import { Box, Container, Grid, Card, CardHeader } from "@mui/material";

const PatientDashboard = () => {
  const [activePage] = useState("personal");

  const PersonalInfo = () => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src="frontend/src/assets/images/avatar.jpg" alt="Profile Picture" style={{ marginRight: '16px' }} />
        <div>
          <h2>Personal Information</h2>
          <p>Name: John</p>
          <p>Surname: Doe</p>
          <p>Title: Dr.</p>
          <p>Phone Number: 123-456-7890</p>
          <p>Email: johndoe@example.com</p>
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
