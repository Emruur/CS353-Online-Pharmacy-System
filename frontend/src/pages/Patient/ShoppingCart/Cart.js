import { Alert, AlertTitle, Container, Grid } from '@mui/material';
import { ShoppingList } from './ShoppingList';
import Parol from 'assets/images/parol.png'
import Augmentin from 'assets/images/augmentin.png'
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

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

	const navigate = useNavigate(); 

	const location = useLocation();

	const cart = location.state

	console.log(cart);

	const goBackList = () => {
		navigate('/medication', {state: cart});
	}

	const checkout = () => {
		const balance = sessionStorage.getItem("balance");
		if (balance < total) {
			setErrorMessage('Not enough money on balance for transaction! Please make payment and come back again.');
		} else {
			sessionStorage.setItem("balance", balance - total);
		}
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
				<Grid container spacing={3}>
					<Grid item lg={12} md={12} xl={15} xs={12}>
						<ShoppingList 
							items={cart ? cart: []}
							total={total}
							setTotal={setTotal}
							goBackList={goBackList}	
							checkout={checkout}
						/>
					</Grid>
				</Grid>
			</Container>
		</>
	);
};

export default Cart;
