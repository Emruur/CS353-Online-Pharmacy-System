import { Container, Grid } from '@mui/material';
import { PharmacistStock } from './PharmacistStock';
import axios from 'axios_config';
import { useEffect, useState } from 'react';

const StockMedicine = () => {

	const token = "Bearer " + sessionStorage.getItem("token");
	const [medicineList, setMedicineList] = useState([]);
	const [medicineNameList, setMedicineNameList] = useState([]);

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
                    console.log('bu' ,res.data);
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


	return (
		<>
			<title>Medicine</title>
			<Container maxWidth="md">
				<Grid container spacing={3}>
					<Grid item lg={12} md={12} xl={15} xs={12}>
						<PharmacistStock 
							medicines={medicineList}
							medicinenames= {medicineNameList}
						/>
					</Grid>
				</Grid>
			</Container>
		</>
	);
};

export default StockMedicine;
