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
import axios from 'axios_config';

const Collapsable = (props) => {
    const {prescription} = props;

    //console.log(prescription[0].pres_id)
    const token = "Bearer " + sessionStorage.getItem("token");
    const [expand, setExpand] = useState(false);
    const [isRejected, setIsRejected] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);

	let arrow;

	if (!expand) {
		arrow = <ArrowDropDown />;
	} else {
		arrow = <ArrowDropUp />;
	}

	let title = `#${prescription[0].pres_id} Prescribed To: ${prescription[0].first_name} ${prescription[0].middle_name} ${prescription[0].surname}`;
    let subheader = `Prescription Date: ${prescription[0].date.substring(5, 16)}`

    const handleAcceptPrescription = () => {
        const requestUrl = `/prescription/request/${prescription[0].pres_id}`;
        const payload = {
          status: 'accepted',
        };
    
        axios.post(requestUrl, payload, {
          headers: {
            Authorization: token,
          },
        })
        .then(response => {
          console.log('Prescription accept successful');
          setIsAccepted(true);
        })
        .catch(error => {
          console.error('Error accepting prescription:', error);
        });
      };
    
      const handleRejectPrescription = () => {
        const requestUrl = `/prescription/request/${prescription[0].pres_id}`;
        const payload = {
          status: 'rejected',
        };
    
        axios.post(requestUrl, payload, {
          headers: {
            Authorization: token,
          },
        })
        .then(response => {
          console.log('Prescription rejection successful');
          setIsRejected(true);
        })
        .catch(error => {
          console.error('Error rejecting prescription:', error);
        });
      };

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
                                                <TableCell align='left'>{medicine.med_name}</TableCell>
                                                <TableCell align="right">
                                                    <SeverityPill color={`${medicine.pres_type}`}>
                                                        {medicine.pres_type}
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
                            justifyContent: 'space-between',
                            p: 2,
                        }}
                        >
                        <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            p: 2,
                        }}
                        >
                        {isAccepted || isRejected ? (
                            <Box>
                            {isAccepted ? (
                                <p>Prescription accepted successfully!</p>
                            ) : (
                                <p>Prescription rejected successfully!</p>
                            )}
                            </Box>
                        ) : (
                            <>
                            <Box>
                                <Button
                                color="primary"
                                size="large"
                                variant="contained"
                                onClick={handleAcceptPrescription}
                                disabled={isAccepted || isRejected}
                                >
                                Accept Prescription
                                </Button>
                            </Box>
                            <Box>
                                <Button
                                color="primary"
                                size="large"
                                variant="contained"
                                onClick={handleRejectPrescription}
                                disabled={isAccepted || isRejected}
                                >
                                Reject Prescription
                                </Button>
                            </Box>
                            </>
                        )}
                        </Box>
                        </Box>
					</CardContent>
				</Box>
			</Collapse>
        </>
    );
};

export {Collapsable};