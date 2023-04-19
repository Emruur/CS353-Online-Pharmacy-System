import { Container, Grid } from '@mui/material';
import { ShoppingList } from './ShoppingList';

const shoppingList = [
	{
		name: 'Parol',
		quantity: 3,
		total: 30,
	},
	{
		name: 'Augmentin',
		quantity: 2,
		total: 60,
	},
];

const Cart = () => {
	return (
		<>
			<title>Medicine</title>
			<Container>
				<Grid container spacing={3}>
					<Grid item lg={12} md={12} xl={15} xs={12}>
						<ShoppingList items={shoppingList} />
					</Grid>
				</Grid>
			</Container>
		</>
	);
};

export default Cart;
