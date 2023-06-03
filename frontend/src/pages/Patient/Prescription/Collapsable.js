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
	Link,
	Table,
    TableBody,
	TableCell,
	TableHead,
    TableRow,
    Tooltip,
	TextField,
} from '@mui/material';
import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { SeverityPill } from 'components/SeverityPill/SeverityPill';

const Collapsable = (props) => {
    const {prescription} = props;
    console.log(prescription)

    const [expand, setExpand] = useState(false);

	let arrow;

	if (!expand) {
		arrow = <ArrowDropDown />;
	} else {
		arrow = <ArrowDropUp />;
	}

	let title = `#${prescription.id + 1} Prescribed By: Dr. ${prescription.prescribedBy}`;
    let subheader = `Prescription Date: ${prescription.date}`

    return(
        <>
            <title>Prescription</title>
            <Card></Card>
			<CardActions>
				<Grid container>
					<CardHeader title={title} subheader={subheader}/>
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
                    <PerfectScrollbar>
                            <Box>
                                <Table>
                                    <TableHead sx={{ display: 'table-header-group' }}>
                                        <TableRow>
                                            <TableCell>Image</TableCell>
								            <TableCell align="right">Medicine Name</TableCell>
                                            <TableCell align="right">Requirement</TableCell>
								            <TableCell align="right">Usage Purpose</TableCell>
                                            <TableCell align="right">Side Effects</TableCell>
                                            <TableCell align="right">Prescribed</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {prescription.medication.map((medicine, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{
                                                    border: 0,
                                                }}
                                            >
                                                <TableCell>
										            <img src={medicine.image}/>
									            </TableCell>
                                                <TableCell>{medicine.name}</TableCell>
                                                <TableCell align="right">
                                                    <SeverityPill color={`${medicine.requiredProspectus}`}>
                                                        {medicine.requiredProspectus}
                                                    </SeverityPill>
                                                </TableCell>
                                                <TableCell align="right">
										            {medicine.type}
									            </TableCell>
                                                <TableCell align="right">{medicine.sideEffect}</TableCell>
                                                <TableCell align="right">
                                                    {medicine.prescriptionStatus}
                                                </TableCell>
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
							<Button
								color="primary"
								size="large"
								variant="contained"
							>
								Re-request Prescription
							</Button>
						</Box>
					</CardContent>
				</Box>
			</Collapse>
        </>
    );
};

export {Collapsable};