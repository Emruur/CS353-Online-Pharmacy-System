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
} from '@mui/material';
import { useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
const PurchaseList = (props) => {
	const { items } = props;

	useEffect(() => {
		console.log(items)
	  }, []);

	return (
		<Card>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<CardHeader title="Previous Purchases" />
			</Box>
			<PerfectScrollbar>
				<Box>
					<Table>
						<TableHead sx={{ display: 'table-header-group' }}>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell>Wallet</TableCell>
                            </TableRow>
							<TableRow>
								<TableCell>Date</TableCell>
								<TableCell align="center">Medicine Name</TableCell>
								<TableCell align="right">Total</TableCell>
								<TableCell align="right">Quantity</TableCell>
                                <TableCell align="right">Change</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{items.map((item, index) => (
								<TableRow
									key={index}
									sx={{
										border: 0,
									}}
								>
									<TableCell>{item.date}</TableCell>
									<TableCell>{item.name}</TableCell>
									<TableCell align="right">{item.total + ' ₺'}</TableCell>
									<TableCell align="right">{item.quantity}</TableCell>
									<TableCell align="right">{'-' + item.total + ' ₺'}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>
			</PerfectScrollbar>
		</Card>
	);
};

export { PurchaseList };
