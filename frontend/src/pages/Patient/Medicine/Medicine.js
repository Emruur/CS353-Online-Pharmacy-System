import { Alert, AlertTitle,  Container, Grid } from '@mui/material';
import { MedicineList } from './MedicineList';
import Minoset from 'assets/images/minoset.png'
import Parol from 'assets/images/parol.png'
import Arveles from 'assets/images/arveles.png'
import Codeine from 'assets/images/codeine.png'
import Augmentin from 'assets/images/augmentin.png'
import Concerta from 'assets/images/concerta.png'
import axios from 'axios_config';
import { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { useGlobalState } from 'GlobalCart';

const Medicine = () => {

	const token = "Bearer " + sessionStorage.getItem("token");

	const [list, setCartItems] = useGlobalState("cartItems");
	const [medicineList, setMedicineList] = useState([]);
	const [prescribedMeds, setPrescribedMeds] = useState([])
	
	const [successMessage, setSuccessMessage] = useState('');

	const navigate = useNavigate('');
	console.log(token);
	useEffect(() => {
		const getAllPrescription = async () => {
            await axios.get('/prescription/', {
                headers: {
                    "Authorization": token
                }
            })
                .then((res) => {
                    if (res && res.data) {
						let arr = []
						for (let i = 0; i < res.data.length; i++) {
							arr.push(res.data[i])
						}
						setPrescribedMeds(arr)
                    }
                })
                .catch((err) => {
                    if (err && err.response) {
                        console.log(err.response.data)
                    }
                })
        }
        getAllPrescription();
		const getAllMedicine = async () => {
			await axios.get('/medicine/', {
				headers: {
					"Authorization": token
				}
			})
				.then((res) => {
					if (res && res.data) {
						let arr = []
						let arr1 = []
						for (let i = 0; i < res.data.length; i++) {
							arr.push({medicine: res.data[i], quantity: 0, total: 0})
							arr1.push(res.data[i])
						}
						setCartItems(arr);
						setMedicineList(arr1);
						console.log(list)
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
		for (let i = 0; i < list.length; i++) {
			if (list[i].medicine.name === medicine.name) {
				list[i].quantity++;
				setSuccessMessage(`${medicine.name} added to the cart`);
			}
		}
	}

	const confirmOrder = () => {
		for (let i = 0; i < list.length; i++) {
			list[i].total = list[i].medicine.price * list[i].quantity
		}
		window.sessionStorage.setItem(
			"literalcartting",
			JSON.stringify(list)
		);
		navigate('/cart')
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
