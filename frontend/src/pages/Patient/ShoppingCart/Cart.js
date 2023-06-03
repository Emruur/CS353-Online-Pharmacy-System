import { Alert, AlertTitle, Container, Grid } from '@mui/material';
import { ShoppingList } from './ShoppingList';
import Parol from 'assets/images/parol.png'
import Augmentin from 'assets/images/augmentin.png'
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGlobalState } from 'GlobalCart';

const shoppingList = [
	{
		name: 'Parol',
		quantity: 3,
		total: 30,
		image: Parol,
	},
	{
		name: 'Augmentin',
		quantity: 2,
		total: 60,
		image: Augmentin,
	},
];


const Cart = () => {

	const [total, setTotal] = useState(0);
	
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	
	const navigate = useNavigate();
	
	const [list, setCartItems] = useGlobalState("cartItems");

	useEffect(() => {
		const data = window.sessionStorage.getItem("literalcartting");
		if (data !== null) {
		  setCartItems(JSON.parse(data));
		  calculateTotal();
		}
	}, []);

	console.log(list);

	useEffect(() => {
		window.sessionStorage.setItem(
		  "literalcartting",
		  JSON.stringify(list)
		);
	}, [list]);

	useEffect(() => {
		return () => {
		  window.sessionStorage.setItem("literalcartting", JSON.stringify(list));
		};
	}, []);

	const goBackList = () => {
		navigate('/medication');
	}

	const checkout = () => {
		let balance = sessionStorage.getItem("balance");
		if (balance < total) {
			setErrorMessage('Not enough money on balance for transaction! Please make payment and come back again.');
		} else {
			sessionStorage.setItem("balance", balance - total);
			let copy = [...list];
			for (let i = 0; i < copy.length; i++) {
				copy[i].quantity = 0;
				copy[i].total = 0;
			}
			setCartItems(copy);
			calculateTotal()
			window.sessionStorage.setItem("literalcartting", list);
			balance = sessionStorage.getItem("balance");
			setSuccessMessage(`Checkout complete. New balance ${balance}`);
		}
	}

	const calculateTotal = () => {
		let tempTotal = 0;
		for (let i = 0; i < list.length; i++) {
			console.log(list[i].total);
			tempTotal = list[i].total + tempTotal;
			setTotal(tempTotal);
		}
	}

	const increaseAmount = (medicine) => {
		let copy = [...list];
		for (let i = 0; i < copy.length; i++) {
			if (copy[i].medicine.name === medicine.name) {
				copy[i].quantity++;
				copy[i].total += copy[i].medicine.price;
			}
		}
		setCartItems(copy);
		calculateTotal();
		console.log(list);
	}

	const decreaseAmount = (medicine) => {
		let copy = [...list];
		for (let i = 0; i < copy.length; i++) {
			if (copy[i].medicine.name === medicine.name) {
				copy[i].quantity--;
				copy[i].total -= copy[i].medicine.price;
			}
		}
		setCartItems(copy);
		calculateTotal();
		console.log(list);
	}

	return (
		<>
			<title>Medicine</title>
			<Container maxWidth="md">
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
						<ShoppingList 
							items={list ? list: []}
							total={total}
							setTotal={setTotal}
							goBackList={goBackList}	
							checkout={checkout}
							increaseAmount={increaseAmount}
							decreaseAmount={decreaseAmount}
							calculateTotal={calculateTotal}
						/>
					</Grid>
				</Grid>
			</Container>
		</>
	);
};

export default Cart;
