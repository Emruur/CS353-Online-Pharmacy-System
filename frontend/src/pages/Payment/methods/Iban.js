import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import {
	Box,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Collapse,
	Grid,
	IconButton,
	Typography,
} from '@mui/material';
import { useState } from 'react';

export const Iban = () => {
	const [expand, setExpand] = useState(false);

	let arrow;

	if (!expand) {
		arrow = <ArrowDropDown />;
	} else {
		arrow = <ArrowDropUp />;
	}

	let title = 'Iban';

	return (
		<>
			<title>Iban</title>
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
						<Box sx={{ py: 2 }}>
							<Typography variant="h5">
								{'Iban: '}
								<small>{'TR33 0006 1005 1978 6457 8413 26'}</small>
							</Typography>
						</Box>
					</CardContent>
				</Box>
			</Collapse>
		</>
	);
};
