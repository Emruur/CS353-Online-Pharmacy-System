import { Container, Grid } from '@mui/material';
import { PurchaseList } from './PurchaseList';
import { useState, useEffect, ref } from 'react';
import axios from 'axios_config';

const shoppingList = [
	{
		name: 'Parol',
		quantity: 3,
		total: 30,
        date: "04/02/2021",
        balance: 1230
	},
	{
		name: 'Augmentin',
		quantity: 2,
		total: 60,
        date: "04/02/2021",
        balance: 1290
	},
    {
		name: 'Concerta',
		quantity: 1,
		total: 200,
        date: "04/02/2021",
        balance: 1490
	},
];


const Purchase = () => {
	const [data, setData] = useState([]);
	const token= "Bearer " + sessionStorage.getItem("token")
	
	useEffect(() => {
		axios.get('purchase/',{
			headers:{
				Authorization: token
			}
		})
		  .then(response => {
			console.log("RES:", response.data)
			setData(response.data);
		  })
		  .catch(error => {
			console.error('Error fetching data: ', error);
		  });
	  }, []); // Empty array ensures that effect is only run on mount and unmount
	return (
		<>
			<title>Purchase</title>
			<Container maxWidth="md">
				<Grid container spacing={3}>
					<Grid item lg={12} md={12} xl={15} xs={12}>
						<PurchaseList items={shoppingList} />
					</Grid>
				</Grid>
			</Container>
		</>
	);
};

export default Purchase;
