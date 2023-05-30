import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Collapse,
	Grid,
	IconButton,
	InputAdornment,
	TextField,
} from '@mui/material';
import { useState } from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import {
	formatCVC,
	formatCreditCardNumber,
	formatExpirationDate,
} from '../utils';

export const Visa = () => {
	const [expand, setExpand] = useState(false);

	const [amount, setAmount] = useState(0);

	let arrow;

	if (!expand) {
		arrow = <ArrowDropDown />;
	} else {
		arrow = <ArrowDropUp />;
	}

	let title = 'Credit/Debit Card';
	const [state, setState] = useState({
		number: '',
		expiry: '',
		cvc: '',
		name: '',
		focus: '',
	});

	const handleInputChange = (evt) => {
		const { name, value } = evt.target;
		if (name === 'number') {
			setState((prev) => ({ ...prev, [name]: formatCreditCardNumber(value) }));
		} else if (name === 'expiry') {
			setState((prev) => ({ ...prev, [name]: formatExpirationDate(value) }));
		} else if (name === 'cvc') {
			setState((prev) => ({ ...prev, [name]: formatCVC(value) }));
		} else {
			setState((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleInputFocus = (evt) => {
		setState((prev) => ({ ...prev, focus: evt.target.name }));
	};

	const handleChange = (e) => {
		setAmount(e.target.value)
	}

	const handleSubmit = () => {
		if (amount !== 0) {
			const balance = parseInt(sessionStorage.getItem("balance")) + parseInt(amount)
			console.log(balance)
			sessionStorage.setItem("balance", balance)
		} else {
			alert("sa")
		}

	}

	return (
		<>
			<title>Visa</title>
			<Card></Card>
			<CardActions>
				<Grid container>
					<CardHeader title={title} />
					<IconButton onClick={() => setExpand(!expand)}>{arrow}</IconButton>
				</Grid>
			</CardActions>
			<Collapse in={expand}>
				<Box
					sx={{
						m: 2,
						mt: -2,
					}}
				>
					<CardContent>
						<Box>
							<Cards
								number={state.number}
								expiry={state.expiry}
								cvc={state.cvc}
								name={state.name}
								focused={state.focus}
							/>
						</Box>
						<form noValidate autoComplete='off'>
						<Box sx={{ py: 2 }}>
							<TextField
								fullWidth
								margin="normal"
								type="text"
								name="number"
								placeholder="Card Number"
								value={state.number}
								onChange={handleInputChange}
								onFocus={handleInputFocus}
								required
							/>
							<TextField
								fullWidth
								margin="normal"
								type="text"
								name="name"
								placeholder="Name"
								value={state.name}
								onChange={handleInputChange}
								onFocus={handleInputFocus}
								required
							/>
							<TextField
								fullWidth
								margin="normal"
								type="text"
								name="expiry"
								placeholder="MM/DD"
								value={state.expiry}
								onChange={handleInputChange}
								onFocus={handleInputFocus}
								required
							/>
							<TextField
								fullWidth
								margin="normal"
								type="text"
								name="cvc"
								placeholder="CVC"
								value={state.cvc}
								onChange={handleInputChange}
								onFocus={handleInputFocus}
								required
							/>
							<TextField
								fullWidth
								margin="normal"
								type="number"
								name="amount"
								placeholder="Amount"
								onChange={handleChange}
								value={amount}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">₺</InputAdornment>
									),
								}}
								required
							/>
						</Box>
						<Box>
							<Button
								color="primary"
								fullWidth
								size="large"
								variant="contained"
								onClick={handleSubmit}
								>
								Deposit
							</Button>
						</Box>
						</form>
					</CardContent>
				</Box>
			</Collapse>
		</>
	);
};
