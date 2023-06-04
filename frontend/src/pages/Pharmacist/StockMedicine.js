import { Alert, AlertTitle, Button, Container, Grid } from '@mui/material';
import { PharmacistStock } from '../components/PharmacistStock';
import axios from 'axios_config';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


const StockMedicine = () => {

	const token = "Bearer " + sessionStorage.getItem("token");
	const [pharmacistStock, setPharmacistStock] = useState([]);
	const [medicineList, setMedicineList] = useState([]);
	const navigate = useNavigate('');

	const location = useLocation()
	console.log("Bearer ");

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
                    console.log(res);
					if (res && res.data) {
						let arr = []
						for (let i = 0; i < res.data.length; i++) {
							arr.push(res.data[i])
						}
						setMedicineList(arr1);
					}
				})
				.catch((err) => {
					if (err && err.response) {
						console.log(err.response.data)
					}
				})
		};
		getAllMedicine();
	}, [])


	return (
		<>
			<title>Medicine</title>
			<Container maxWidth="md">
				<Grid container spacing={3}>
					<Grid item lg={12} md={12} xl={15} xs={12}>
						<PharmacistStock 
							medicines={medicineList}
						/>
					</Grid>
				</Grid>
			</Container>
		</>
	);
};

export default StockMedicine;
