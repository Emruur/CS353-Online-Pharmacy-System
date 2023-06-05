import { Collapsable } from './Collapsable';
import { Box, Container, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios_config';

const DoctorDashboard = () => {
	
	const [reqPrescriptions, setReqPrescriptions] = useState([]);

	const token = "Bearer " + sessionStorage.getItem("token");

	useEffect(() => {
		const getReqPrescription = async () => {
            await axios.get('/prescription/request/doctor', {
                headers: {
                    "Authorization": token
                }
            })
                .then((res) => {
                    if (res && res.data) {
                        console.log(res.data)
                        let arr = []
                        for (let i = 0; i < res.data.length; i++) {
                            if (arr[res.data[i].pres_id]) {
                                arr[res.data[i].pres_id].push(res.data[i]);
                            } else {
                                arr[res.data[i].pres_id] = [res.data[i]];
                            }
                        }
                        setReqPrescriptions(arr);
                        console.log(arr)
                    }
                })
                .catch((err) => {
                    if (err && err.response) {
                        console.log(err.response.data)
                    }
                })
        }
        getReqPrescription();
	}, [])

	return (
		<>
			<title>Dashboard</title>
			<Container maxWidth="lg">
                <Grid container justifyContent="center" direction="row" spacing={6}>
                    <Grid item md={6} xs={12}>
                        <Box sx={{ my: 3 }}>
                            <Typography color="textPrimary" variant="h4">
                                Requested Prescriptions
                            </Typography>
                        </Box>
                        {reqPrescriptions.map((prescription, index) => (
                            <Box key={index}>
                                <Collapsable 
                                    prescription={prescription}
                                    //requestPrescription={requestPrescription}    
                                />
                            </Box>
                        ))}
                    </Grid>
                </Grid>
			</Container>
		</>
	);
};

export default DoctorDashboard;
