import EditIcon from '@mui/icons-material/Edit';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddIcon from '@mui/icons-material/Add';
import {
	Box,
	Button,
	Card,
	CardHeader,
	Divider,
    Dialog,
	DialogActions,
	DialogTitle,
	DialogContent,
	DialogContentText,
	FormControl,
	FormControlLabel,
	FormLabel,
	IconButton,
	MenuItem,
	MenuList,
	Popover,
	Radio,
	RadioGroup,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
    TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import axios from 'axios_config';
import defaultpic from 'assets/images/default.png'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { SeverityPill } from 'components/SeverityPill/SeverityPill';
import * as Yup from 'yup';

const PharmacistStock = (props) => {
	const { medicines } = props;

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
	console.log("Bearer ");

	console.log('anan',medicines);

	const [type, setType] = useState('none');

	const [filteredMedinices, setFilteredMedinices] = useState(medicines);

	const handlePrescription = (event) => {
		setType(event.target.value);
	};

	const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpen] = useState(false);
    const [openNewMedicineDialog, setOpenNewMedicine] = useState(false);
    const [openMedicineStockDialog, setOpenMedicineStock] = useState(false);

    const prescription_type = [
        {
          value: 'white',
        },
        {
          value: 'red',
        },
        {
          value: 'green',
        },
        {
          value: 'orange',
        },
        {
            value: 'purple',
          },
      ];


	const handleOpenPopover = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClosePopover = () => {
		setAnchorEl(null);
	};

    const handleClickOpen = () => {
		setOpen(true);
	};
	
	const handleClose = () => {
		setOpen(false);
	};
    const handleOpenNewMedicine = () => {
		setOpenNewMedicine(true);
	  };
      const handleCloseNewMedicine = () => {
		setOpenNewMedicine(false);
	};

    const handleOpenMedicineStock = () => {
		setOpenMedicineStock(true);
	  };
      const handleCloseMedicineStock = () => {
		setOpenMedicineStock(false);
	};

	const applyFilters = () => {
		if (type !== 'none') {
			setFilteredMedinices(
				medicines.filter(
					(medicine) => medicine.type === type
				)
			);
		} else {
			setFilteredMedinices(medicines);
		}
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

    const formik = useFormik({
		initialValues: {
			medicinename: 'anan',
			prescriptiontype: '',
			usedfor: '',
			dosage: '',
			side_effects: '',
			risk_factors: '',
			preserve_conditions: '',
			prod_firm: '',
            price: '',
            medtype: '',
            minage: '',
		},
		validationSchema: Yup.object({
			medicinename: Yup.string().max(50).required('Medicine name is required'),
			prescriptiontype: Yup.string().max(50).required('Prescription type is required'),
			usedfor: Yup.string().max(50).required('Used for is required'),
			dosage: Yup.string().max(50).required('Dosage is required'),
			side_effects: Yup.string().required('Side effect is required'),
            risk_factors: Yup.string().required('Risk factor is required'),
			preserve_conditions: Yup.string().required('Preserve condition is required'),
            prod_firm: Yup.string(),//.required('Name of pharmacy is required'),
            price: Yup.number().min(1,'Price cannot be zero').required('Price is required'),
            medtype: Yup.string().required('Medicine type is required'),
            minage: Yup.number().required('Minimum age is required'),
		}),
		onSubmit: async (values) => {
			const newValues = {
				medicinename: values.medicinename,
				prescriptiontype: values.prescriptiontype,
				usedfor:  values.usedfor,
				dosage: values.dosage,
				side_effects: values.side_effects,
				risk_factors: values.risk_factors,
                preserve_conditions: values.preserve_conditions,
                prod_firm: values.prod_firm,
                price: values.price,
                medtype: values.medtype,
                minage: values.minage,
			}
			console.log(newValues);
			await axios
				.post('/register_drug', newValues)
				.then((res) => {
					if (res && res.data) {
						console.log(res.data);
						navigate('/pharmacystock');
					}
				})
				.catch((err) => {
					if (err && err.response) {
						console.log("Error:", err.response.data);
						if (err.response.status === 401) {
							setErrorMessage('Invalid TCKN or password');
						} else if (err.response.status === 400) {
							setErrorMessage(err.response.data.msg);
						}
					} else {
						setErrorMessage('Connection error');
					}
				});
			},
		});
		
		return (
			<Card>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
				}}
				>
				<CardHeader title="Medicine List" />
                <Tooltip title="Add a medicine">
							<IconButton		onClick={handleClickOpen}>
						<AddIcon />
					</IconButton>
				</Tooltip>
        <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Add a medicine</DialogTitle>
        <DialogContent>
            <Button onClick={handleOpenNewMedicine}>Add new medicine to database</Button>
            <Button onClick={handleOpenMedicineStock}>Add new medicine to stock</Button>
            <DialogContentText>
            To subscribe to this website, please enter your Dosages here. We
            will send updates occasionally.
          </DialogContentText>
        </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
		</Dialog>
        //new medicine dialog
            <Dialog open={openNewMedicineDialog} onClose={handleCloseNewMedicine}>
            <DialogTitle>Register New Medicine</DialogTitle>
            <DialogContent>
                <DialogContentText>
                Register a new medicine to the database by filling the form.
            	</DialogContentText>
            <form onSubmit={formik.handleSubmit}>
            <TextField
                autoFocus
                margin="dense"
                id="medicinename"
				name='medicinename'
                label="Name"
                type="email"
                fullWidth
                variant="standard"
            />
            <TextField
                id="prescriptiontype"
				name='prescriptiontype'
                select
                label="Prescription Type"
                defaultValue="White"
                onBlur={formik.handleBlur}
                SelectProps={{
                    native: true,
                  }}
                helperText="Please select prescription type"
                fullWidth
                variant="standard"
            >
            {prescription_type.map((option) => (
            <option key={option.value} value={option.value}>
              {option.value}
            </option>
            ))}
            </TextField>
            <TextField
                autoFocus
                margin="dense"
                id="usedfor"
				name='usedfor'
                label="Used For"
                fullWidth
                variant="standard"
            />
            <TextField
                autoFocus
                margin="dense"
                id="dosage"
				name='dosage'
                label="Dosages"
                fullWidth
                variant="standard"
            />
            <TextField
                autoFocus
                margin="dense"
                id="side_effects"
				name='side_effects'
                label="Side effects"
                fullWidth
                variant="standard"
            />
            <TextField
                autoFocus
                margin="dense"
                id="risk_factors"
				name='risk_factors'
                label="Risk Factors"
                fullWidth
                variant="standard"
            />
            <TextField
                autoFocus
                margin="dense"
                id="preserve_conditions"
				name='preserve_conditions'
                label="Preserve Conditions"
                fullWidth
                variant="standard"
            />
             <TextField
                autoFocus
                margin="dense"
                id="prod_firm"
				name='prod_firm'
                label="Producing firm"
                fullWidth
                variant="standard"
            />
             <TextField
                autoFocus
                margin="dense"
                id="price"
				name='price'
                label="Price"
                type='number'
                fullWidth
                variant="standard"
            />
            <TextField
                autoFocus
                margin="dense"
                id="medtype"
				name='medtype'
                label="Medication Type"
                fullWidth
                variant="standard"
            />
            <TextField
                autoFocus
                margin="dense"
                id="minage"
				name='minage'
                label="Minimum Age"
                type='number'
                fullWidth
                variant="standard"
            />
            </form>
            </DialogContent>
                <DialogActions>
                <Button onClick={handleCloseNewMedicine}>Cancel</Button>
                <Button type='submit' onClick={formik.handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>

            //add amount dialog
            <Dialog open={openMedicineStockDialog} onClose={handleCloseMedicineStock}>
            <DialogTitle>Add medicine to stock</DialogTitle>
            <DialogContent>
                <DialogContentText>
                You can add a medicine to stock by selecting the name and selecting an amount.
            </DialogContentText>
			<form onSubmit={formik.handleSubmit}>
            <TextField
                autoFocus
                margin="dense"
                id="medicinename"
                label="Name"
                type="email"
                fullWidth
                variant="standard"
            />
            <TextField
                id="prescriptiontype"
                select
                label="Prescription Type"
                defaultValue="White"
                SelectProps={{
                    native: true,
                  }}
                helperText="Please select prescription type"
                variant="standard"
            >
            {prescription_type.map((option) => (
            <option key={option.value} value={option.value}>
              {option.value}
            </option>
            ))}
            </TextField>
      
            <TextField
                autoFocus
                margin="dense"
                id="amount"
                label="Amount"
                type='number'
                fullWidth
                variant="standard"
            />
			</form>
            </DialogContent>
                <DialogActions>
                <Button onClick={handleCloseMedicineStock}>Cancel</Button>
                <Button onClick={formik.handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>

				<Tooltip>
					<IconButton onClick={handleOpenPopover}>
						<FilterAltIcon />
					</IconButton>
				</Tooltip>
				<Popover
					id={id}
					open={open}
					anchorEl={anchorEl}
					onClose={handleClosePopover}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
				>
					<Box
						sx={{
							py: 1.5,
							px: 2,
						}}
					>
						<Typography variant="overline">Filters</Typography>
						<Divider />
						<FormControl>
							<FormLabel id="demo-radio-buttons-group-label">
								Prescription
							</FormLabel>
							<RadioGroup
								aria-labelledby="demo-radio-buttons-group-label"
								defaultValue="female"
								name="radio-buttons-group"
								value={type}
								onChange={handlePrescription}
							>
								<FormControlLabel
									value="Paracetamol"
									control={<Radio />}
									label="Paracetamol"
								/>
								<FormControlLabel
									value="Nervous System Stimulant" 
									control={<Radio />} 
									label="Nervous System Stimulant" 
								/>
								<FormControlLabel
									value="Antibiotic"
									control={<Radio />}
									label="Antibiotic"
								/>
								<FormControlLabel
									value="Anti-inflammatory"
									control={<Radio />}
									label="Anti-inflammatory"
								/>
								<FormControlLabel
									value="none"
									control={<Radio />}
									label="None"
								/>
							</RadioGroup>
						</FormControl>
					</Box>
					<MenuList
						disablePadding
						sx={{
							'& > *': {
								'&:first-of-type': {
									borderTopColor: 'divider',
									borderTopStyle: 'solid',
									borderTopWidth: '1px',
								},
								padding: '12px 16px',
							},
						}}
					>
						<MenuItem onClick={applyFilters}>Apply Filters</MenuItem>
					</MenuList>
				</Popover>
			</Box>
			<PerfectScrollbar>
				<Box>
					<Table>
						<TableHead sx={{ display: 'table-header-group' }}>
							<TableRow>
								<TableCell>Image</TableCell>
								<TableCell align="center">Medicine Name</TableCell>
								<TableCell align="right">Requirement</TableCell>
								<TableCell align="right">Usage Purpose</TableCell>
								<TableCell align="right">Side Effects</TableCell>
								<TableCell align="right">Prescribed</TableCell>
								<TableCell align="right">Amount</TableCell>
								<TableCell align="right">Operation</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
                            
							{medicines.map((medicine, index) => (
								<TableRow
									key={index}
									sx={{
										border: 0,
									}}
								>
									<TableCell>
										<img  alt={defaultpic} src={defaultpic} width="100" height="100"/>
									</TableCell>
									<TableCell>{medicine.name}</TableCell>
									<TableCell align="right">
										<SeverityPill color={`${medicine.prescription_type}`}>
											{medicine.prescription_type}
										</SeverityPill>
									</TableCell>
									<TableCell align="right">
										{medicine.med_type}
									</TableCell>
									<TableCell align="right">{medicine.side_effects}</TableCell>
									<TableCell align="right">
										{medicine.price}
									</TableCell>
									<TableCell align="right">
										{medicine.amount}
									</TableCell>
									<TableCell align="right">
										<>
											<Tooltip>
												<IconButton
													disabled= 'false'
												>
													<EditIcon />
												</IconButton>
											</Tooltip>
										</>
									</TableCell>
								</TableRow>
							))
							}
						</TableBody>
					</Table>
				</Box>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'flex-end',
						p: 2,
					}}
				>
				</Box>
			</PerfectScrollbar>
		</Card>
	);
};

export { PharmacistStock };
