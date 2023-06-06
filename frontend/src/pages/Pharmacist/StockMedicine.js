import { Alert,AlertTitle, Container, Grid } from '@mui/material';
import { PharmacistStock } from './PharmacistStock';
import axios from 'axios_config';
import { useEffect, useState } from 'react';

const StockMedicine = () => {

	const token = "Bearer " + sessionStorage.getItem("token");
	const [medicineList, setMedicineList] = useState([]);
	const [medicineNameList, setMedicineNameList] = useState([]);

	const [successMessage, setSuccessMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');


	console.log(token);
	useEffect(() => {
		console.log("Bearer ");
		const getAllMedicine = async () => {
			await axios.get('/pharmacy/mypharmacy', {
				headers: {
					"Authorization": token
				}
			})
				.then((res) => {
                    console.log('bu' ,res.data);
					if (res && res.data) {
						let arr = []
						for (let i = 0; i < res.data.length; i++) {
							arr.push(res.data[i])
						}
						setMedicineList(arr);
					}
				})
				.catch((err) => {
					if (err && err.response) {
						console.log(err.response.data)
					}
				})
		};
		getAllMedicine();

		const getAllMedicineName = async () => {
			await axios.get('/medicine/', {
				headers: {
					"Authorization": token
				}
			})
				.then((res) => {
                    //console.log('bu' ,res.data);
					if (res && res.data) {
						let arr1 = []
						let arr2 = []
						for (let i = 0; i < res.data.length; i++) {
							arr1.push(res.data[i])
						}
						setMedicineNameList(arr1);
					}
				})
				.catch((err) => {
					if (err && err.response) {
						console.log(err.response.data)
					}
				})
		};
		getAllMedicineName();
	}, [])

	const displayMessage = (medicine,result) => {
		if (!result) {
			setSuccessMessage(`${medicine} has been added to the system`);
		}
		else if(result===1){
			setErrorMessage(`Medicine cannot be added. Please check the fields.`);
		}
		else if(result===2){
			setErrorMessage(`Medicine cannot be added. This medicine already exists.`);
		}
	}


	return (
		<>
			<title>Medicine</title>
			<Container maxWidth="md">
			{successMessage.trim().length !== 0 && (
					<Alert
						severity="success"
						onClose={() => {
							setSuccessMessage('');
						}}
					>
						<AlertTitle>Success</AlertTitle>
						{successMessage}
					</Alert>
				)}
					{errorMessage.trim().length !== 0 && (
					<Alert
						severity="error"
						onClose={() => {
							setErrorMessage('');
						}}
					>
						<AlertTitle>Error</AlertTitle>
						{errorMessage}
					</Alert>
				)}

				<Grid container spacing={3}>
					<Grid item lg={12} md={12} xl={15} xs={12}>
						<PharmacistStock 
							medicines={medicineList}
							medicinenames= {medicineNameList}
							displayMessage={displayMessage}

						/>
					</Grid>
				</Grid>
			</Container>
		</>
	);
};

export default StockMedicine;
