import { Button, Container, Grid } from '@mui/material';
import { MedicineList } from './MedicineList';
import Minoset from 'assets/images/minoset.png'
import Parol from 'assets/images/parol.png'
import Arveles from 'assets/images/arveles.png'
import Codeine from 'assets/images/codeine.png'
import Augmentin from 'assets/images/augmentin.png'
import Concerta from 'assets/images/concerta.png'
import axios from 'axios_config';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const medicineList = [
	{
		name: 'Parol',
		type: 'Paracetamol',
		requiredProspectus: 'white',
		sideEffect: 'Dryness in mouth, Dizziness, Tremors, Insomnia',
		prescriptionStatus: 'Over the Counter',
		image: Parol,
		price: 10
	},
	{
		name: 'Augmentin',
		type: 'Antibiotic',
		requiredProspectus: 'white',
		sideEffect: 'Nausea, Vomiting, Headache, Diarrhea',
		prescriptionStatus: 'Not Prescribed',
		image: Augmentin,
		price: 30
	},
	{
		name: 'Minoset Plus',
		type: 'Paracetamol',
		requiredProspectus: 'white',
		sideEffect: 'Severe nausea, Vomiting, Stomach pain',
		prescriptionStatus: 'Over the Counter',
		image: Minoset,
		price: 15
	},
	{
		name: 'Arveles',
		type: 'Anti-inflammatory',
		requiredProspectus: 'white',
		sideEffect: 'Heartburn, Nausea and vomiting, Diarrhea',
		prescriptionStatus: 'Over the Counter',
		image: Arveles,
		price: 40
	},
	{
		name: 'Concerta',
		type: 'Nervous System Stimulant',
		requiredProspectus: 'red',
		sideEffect: 'Nervousness, Trouble sleeping, Loss of appetite, Weight loss',
		prescriptionStatus: 'Not Prescribed',
		image: Concerta,
		price: 100
	},
	{
		name: 'Codeine Phosphate',
		type: 'Pain Killer',
		requiredProspectus: 'red',
		sideEffect: 'Constipation, Nausea and Stomach cramps, Mood changes, Dizziness',
		prescriptionStatus: 'Prescribed',
		image: Codeine,
		price: 1000
	},
];
const Medicine = () => {

	const token = "Bearer " + sessionStorage.getItem("token");

	const [cart, setCart] = useState([]);

	const navigate = useNavigate('');

	const location = useLocation()

	useEffect(() => {
		const getAllMedicine = async () => {
			await axios.get('/medicine/', {
				headers: {
					"Authorization": token
				}
			})
				.then((res) => {
					if (res && res.data) {
						if (location.state !== null) {
							console.log(location.state)
							setCart(location.state)
						} else {
							for (let i = 0; i < medicineList.length; i++) {
								setCart((oldArray) => [...oldArray, {medicine: medicineList[i], quantity: 0, total: 0}])
							}
						}
						console.log(cart)
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

	const addToShoppingCart = (medicine) => {
		for (let i = 0; i < cart.length; i++) {
			if (cart[i].medicine.name === medicine.name) {
				cart[i].quantity++;
			}
		}
		console.log(cart);
	}

	const confirmOrder = () => {
		for (let i = 0; i < cart.length; i++) {
			cart[i].total = cart[i].medicine.price * cart[i].quantity
		}
		navigate('/cart', {state: cart})
	}

	return (
		<>
			<title>Medicine</title>
			<Container maxWidth="md">
				<Grid container spacing={3}>
					<Grid item lg={12} md={12} xl={15} xs={12}>
						<MedicineList 
							medicines={medicineList}
							addToShoppingCart={addToShoppingCart}
							confirmOrder={confirmOrder}
						/>
					</Grid>
				</Grid>
			</Container>
		</>
	);
};

export default Medicine;
