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
	Table,
    TableBody,
	TableCell,
	TableHead,
    TableRow,
} from '@mui/material';
import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { SeverityPill } from 'components/SeverityPill/SeverityPill';

const Collapsable = (props) => {
    const {prescription} = props;

    //console.log(prescription[0].pres_id)

    const [expand, setExpand] = useState(false);

	let arrow;

	if (!expand) {
		arrow = <ArrowDropDown />;
	} else {
		arrow = <ArrowDropUp />;
	}

	let title = `#${prescription[0].pres_id} Prescribed To: ${prescription[0].prescribed_to}`;
    let subheader = `Prescription Date: ${prescription[0].date.substring(5, 16)}`

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
						m: 0,
						mt: -2,
					}}
				>
					<CardContent>
                    <PerfectScrollbar>
                            <Box>
                                <Table>
                                    <TableHead sx={{ display: 'table-header-group' }}>
                                        <TableRow>
                                            <TableCell>Amount</TableCell>
								            <TableCell >Medicine Name</TableCell>
                                            <TableCell align="right">Requirement</TableCell>
								            <TableCell align="right">Usage Purpose</TableCell>
                                            <TableCell align="right">Side Effects</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {prescription.map((medicine, index) => (
                                            (medicine.med_count > 0) && <TableRow
                                                key={index}
                                                sx={{
                                                    border: 0,
                                                }}
                                            >
                                                <TableCell>{medicine.med_count}</TableCell>
                                                <TableCell align='left'>{medicine.name}</TableCell>
                                                <TableCell align="right">
                                                    <SeverityPill color={`${medicine.prescription_type}`}>
                                                        {medicine.prescription_type}
                                                    </SeverityPill>
                                                </TableCell>
                                                <TableCell align="right">
										            {medicine.used_for}
									            </TableCell>
                                                <TableCell align="right">{medicine.side_effects}</TableCell>
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
                            <Box>
                                <Button
                                    color="primary"
                                    size="large"
                                    variant="contained"
                                    onClick={() => props.requestPrescription(prescription[0].pres_id)}
                                >
                                    Accept Prescription
                                </Button>
                            </Box>
                            <Box>
                                <Button
                                    color="primary"
                                    size="large"
                                    variant="contained"
                                    onClick={() => props.requestPrescription(prescription[0].pres_id)}
                                >
                                    Reject Prescription
                                </Button>
                            </Box>
						</Box>
					</CardContent>
				</Box>
			</Collapse>
        </>
    );
};

export {Collapsable};