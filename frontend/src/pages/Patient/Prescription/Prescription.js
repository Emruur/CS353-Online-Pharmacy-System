import { Box, Container, Typography } from '@mui/material';
import { Collapsable } from './Collapsable';
import { useEffect, useState } from 'react';
import axios from 'axios_config';

const Prescription = () => {

    const [prescriptions, setPrescriptions] = useState([]);

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
                        console.log(res.data)
                        let arr = []
                        for (let i = 0; i < res.data.length; i++) {
                            if (arr[res.data[i].pres_id]) {
                                arr[res.data[i].pres_id].push(res.data[i]);
                            } else {
                                arr[res.data[i].pres_id] = [res.data[i]];
                            }
                        }
                        setPrescriptions(arr);
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

    const requestPrescription = async (medicine) => {
        const values = {
            pres_id: medicine.pres_id
        }
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
            <Container maxWidth="md">
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
			</Container>
        </>
    );
};

export default Prescription;