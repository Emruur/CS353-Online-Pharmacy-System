import {
	Box,
	Button,
	Card,
	CardHeader,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
	Tooltip,
	IconButton
} from '@mui/material';
import { useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const ShoppingList = (props) => {
	const { items, total } = props;

	useEffect(() => {
		props.calculateTotal();
	}, []);

	console.log(items);

	return (
		<Card>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<CardHeader title="Shopping Bag" />
			</Box>
			<PerfectScrollbar>
				<Box>
					<Table>
						<TableHead sx={{ display: 'table-header-group' }}>
							<TableRow>
								<TableCell>Image</TableCell>
								<TableCell align="center">Medicine Name</TableCell>
								<TableCell align="right">Quantity</TableCell>
								<TableCell align="right">Total</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{items.map((item, index) => (
								item.quantity !== 0 && <TableRow
									key={index}
									sx={{
										border: 0,
									}}
								>
									<TableCell>
										<img src={item.medicine.image}/>
									</TableCell>
									<TableCell align='center'>{item.medicine.name}</TableCell>
									<TableCell align='right'>
										<Tooltip>
											<IconButton
												onClick={() => {props.decreaseAmount(item.medicine)}}
											>
												<RemoveIcon />
											</IconButton>
										</Tooltip>
										{item.quantity}
										<Tooltip>
											<IconButton
												onClick={() => {props.increaseAmount(item.medicine)}}
											>
												<AddIcon />
											</IconButton>
										</Tooltip>
									</TableCell>
									<TableCell align="right">{item.total + ' ₺'}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>
			</PerfectScrollbar>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'flex-end',
					p: 2,
				}}
			>
				<Typography>{'Total: ' + total + ' ₺'}</Typography>
			</Box>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					p: 2,
				}}
			>
				<Button 
					color="primary" 
					size="large" 
					variant="contained"
					onClick={props.goBackList}
				>
					Back to List
				</Button>
				<Button
					color="primary" 
					size="large" 
					variant="contained"
					onClick={props.checkout}
				>
					Checkout
				</Button>
			</Box>
		</Card>
	);
};

export { ShoppingList };
