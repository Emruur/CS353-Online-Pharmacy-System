import { Alert, AlertTitle,  Container, Grid } from '@mui/material';
import { MedicineList } from './MedicineList';
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

	const [usage, setUsage] = useState('none');
	const [risk, setRisk] = useState('none');

	const navigate = useNavigate('');
  
	const checkPrescribed = (arr, medicine) => {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i]) {
				if (arr[i][0].status === "valid") {
					for (let j = 0; j < arr[i].length; j++) {
						if (arr[i][j].name === medicine.name) {
							return true;
						}
					}
				}
			}
		}
		return false;
	}

	const getAllMedicine = async (arr) => {
		let domain = '/medicine/';
		let quarries = [];
		if (usage !== "none") {
			quarries.push("used_for=" + usage);
		}
		if (risk !== "none") {
			quarries.push("risk_factors=" + risk);
		}
		for (let i = 0; i < quarries.length; i++) {
			if (i == 0) {
				domain += "?" + quarries[i];
			} else {
				domain += "&" + quarries[i];
			}
		}
		console.log(domain)
		await axios.get(domain, {
			headers: {
				"Authorization": token
			}
		})
			.then((res) => {
				if (res && res.data) {
					let arr2 = []
					let arr1 = []
					for (let i = 0; i < res.data.length; i++) {
						console.log(res.data[i])
						arr2.push({medicine: res.data[i], quantity: 0, total: 0})
						arr1.push({
							name: res.data[i].name,
							prescription_type: res.data[i].prescription_type, 
							used_for: res.data[i].used_for,
							side_effects: res.data[i].side_effects,
							prescribed: checkPrescribed(arr, res.data[i]) ? "Yes" : "No",
							prod_firm: res.data[i].prod_firm,
							med_type: res.data[i].med_type,
							min_age: res.data[i].min_age,
							risk_factors: res.data[i].risk_factors,
							price: res.data[i].price,
							preserve_conditions: res.data[i].preserve_conditions
						})
					}
					setCartItems(arr2);
					setMedicineList(arr1);
					console.log(arr1)
				}
			})
			.catch((err) => {
				if (err && err.response) {
					console.log(err.response.data)
				}
			})
	};

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
                            if (arr[res.data[i].pres_id]) {
                                arr[res.data[i].pres_id].push(res.data[i]);
                            } else {
                                arr[res.data[i].pres_id] = [res.data[i]];
                            }
                        }
						setPrescribedMeds(arr)
						getAllMedicine(arr);
                    }
                })
                .catch((err) => {
                    if (err && err.response) {
                        console.log(err.response.data)
                    }
                })
        }
        getAllPrescription();
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
			<Container maxWidth="lg">
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
							prescribedMeds={prescribedMeds}
							usage={usage}
							setUsage={setUsage}
							risk={risk}
							setRisk={setRisk}
							getAllMedicine={getAllMedicine}
						/>
					</Grid>
				</Grid>
			</Container>
		</>
	);
};

export default Medicine;
