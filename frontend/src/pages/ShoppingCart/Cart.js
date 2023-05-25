import { Container, Grid } from '@mui/material';
import { ShoppingList } from './ShoppingList';
import Parol from 'assets/images/parol.png'
import Augmentin from 'assets/images/augmentin.png'

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
	return (
		<>
			<title>Medicine</title>
			<Container maxWidth="md">
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
