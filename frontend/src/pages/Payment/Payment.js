import { Box, Container, Typography } from '@mui/material';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { Iban } from './methods/Iban';
import { Visa } from './methods/Visa';

const Payment = () => {
	return (
		<>
			<title>Payment</title>
			<Container maxWidth="sm">
				<Box sx={{ my: 3 }}>
					<Typography color="textPrimary" variant="h4">
						Payment Method
					</Typography>
				</Box>
				<Box>
					<Visa />
				</Box>
				<Box>
					<Iban />
				</Box>
			</Container>
		</>
	);
};

export default Payment;
