import { Collapsable } from './Collapsable';
import { Box, Container, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios_config';

const DoctorDashboard = () => {
	
	const [reqPrescriptions, setReqPrescriptions] = useState([]);
    const [allPrescriptions, setAllPrescriptions] = useState([]);

	const token = "Bearer " + sessionStorage.getItem("token");

    const deletePres = async (id) => {
        console.log(id)
        await axios.delete('/prescription/' + id, {
            headers: {
                "Authorization": token
            }
        })
            .then((res) => {
                if (res && res.data) {
                    console.log(res.data.msg)
                }   
            })
            .catch((err) => {
                if (err && err.response) {
                    console.log(err.response)
                }
            })
    }

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
                        //console.log(arr)
                    }
                })
                .catch((err) => {
                    if (err && err.response) {
                        console.log(err.response.data)
                    }
                })
        }
        const getAllPrescription = async () => {
            await axios.get('/prescription/doctor', {
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
                        setAllPrescriptions(arr);
                        console.log(arr)
                    }
                })
                .catch((err) => {
                    if (err && err.response) {
                        console.log(err.response.data)
                    }
                })
        }
        getAllPrescription();
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
                                    type="req" 
                                    prescription={prescription}
                                    //requestPrescription={requestPrescription}    
                                />
                            </Box>
                        ))}
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Box sx={{ my: 3 }}>
                            <Typography color="textPrimary" variant="h4">
                                All Prescriptions
                            </Typography>
                        </Box>
                        {allPrescriptions.map((prescription, index) => (
                            <Box key={index}>
                                <Collapsable 
                                    type="all"
                                    deletePres={deletePres}
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
