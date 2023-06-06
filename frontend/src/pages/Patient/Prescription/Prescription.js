import { Box, Container, Grid, Typography } from '@mui/material';
import { Collapsable } from './Collapsable';
import { useEffect, useState } from 'react';
import axios from 'axios_config';

const Prescription = () => {

    const [prescriptions, setPrescriptions] = useState([]);
    const [reqPrescriptions, setReqPrescriptions] = useState([]);

	const token = "Bearer " + sessionStorage.getItem("token");

    useEffect(() => {
        const getAllPrescription = async () => {
            await axios.get('/prescription/', {
                headers: {
                    "Authorization": token
                }
            })
                .then((res) => {
                    if (res && res.data) {
                        //console.log(res.data)
                        let arr = []
                        for (let i = 0; i < res.data.length; i++) {
                            if (arr[res.data[i].pres_id]) {
                                arr[res.data[i].pres_id].push(res.data[i]);
                            } else {
                                arr[res.data[i].pres_id] = [res.data[i]];
                            }
                        }
                        setPrescriptions(arr);
                        getReqPrescription(arr);
                        //console.log(arr)
                    }
                })
                .catch((err) => {
                    if (err && err.response) {
                        console.log(err.response.data)
                    }
                })
        }
        const getReqPrescription = async (arrAll) => {
            await axios.get('/prescription/user', {
                headers: {
                    "Authorization": token
                }
            })
                .then((res) => {
                    if (res && res.data) {
                        //console.log(arrAll)
                        let arr = []
                        console.log(res.data)
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
        getAllPrescription();
    }, []);

    const requestPrescription = async (id) => {
        const values = {
            pres_id: id
        }
        console.log(values)
        await axios.post('/prescription/request', values,{
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
                if (err) {
                    console.log(err.response)
                }
            })
    }

    return(
        <>
            <title>Prescriptions</title>
            <Container maxWidth="lg">
                <Grid container justifyContent="center" direction="row" spacing={6}>
                    <Grid item md={6} xs={12}>
                        <Box sx={{ my: 3 }}>
                            <Typography color="textPrimary" variant="h4">
                                Previous Prescriptions
                            </Typography>
                        </Box>
                        {prescriptions.map((prescription, index) => (
                            <Box key={index}>
                                <Collapsable 
                                    prescription={prescription}
                                    requestPrescription={requestPrescription}    
                                />
                            </Box>
                        ))}
                    </Grid>
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
                                    prescriptions={prescriptions}
                                    requestPrescription={requestPrescription}    
                                />
                            </Box>
                        ))}
                    </Grid>
                </Grid>  
			</Container>
        </>
    );
};

export default Prescription;