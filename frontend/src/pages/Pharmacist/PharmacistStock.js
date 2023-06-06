import CheckIcon from '@mui/icons-material/Check';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddIcon from '@mui/icons-material/Add';
import {
	Alert,
	AlertTitle,
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
import { useRef,createRef, useEffect, useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { SeverityPill } from 'components/SeverityPill/SeverityPill';
import * as Yup from 'yup';

const PharmacistStock = (props) => {
	const { medicines,medicinenames } = props;

	const token = "Bearer " + sessionStorage.getItem("token");

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

	const [type, setType] = useState('none');
	const [med_id, setMedID] = useState(1);

	const formMedName = useRef();
	const formPrescType = useRef();
	const formUsedFor = useRef();
	const formDosage = useRef();
	const formSideEffect = useRef();
	const formRiskFactor = useRef();
	const formPreserveConditions = useRef();
	const formProducingFirm = useRef();
	const formPrice = useRef();
	const formMedType = useRef();
	const formMinAge = useRef();


	const submitButtonDisable = formMedName.current & formPrescType.current & 
						formUsedFor.current & formDosage.current & formSideEffect.current &
						formRiskFactor.current & formPreserveConditions.current &
						formProducingFirm.current & formPrice.current & formMedType.current &
						formMinAge.current;

	const handleMedChange = (event) => {
		setMedID(event.target.value)
	}

	const [filteredMedinices, setFilteredMedinices] = useState(medicines);

	const handlePrescription = (event) => {
		setType(event.target.value);
	};

	const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpen] = useState(false);
    const [openNewMedicineDialog, setOpenNewMedicine] = useState(false);
    const [openMedicineStockDialog, setOpenMedicineStock] = useState(false);

	const [updateClickable, setUpdateClickable] = useState(false);
	const lineRefs = useRef([]);
	const amountRef = useRef(null);

	lineRefs.current = medicines.map((_, i) => lineRefs.current[i] ?? createRef());

//() => {editAmount(medicine.med_id,{updateRef} )}
	async function handleUpdateClick( index,id) {
		const request= {med_id: id,
						med_no: lineRefs.current[index].current.value};
			await axios
				.put('/pharmacy/mypharmacy', request, {
					headers: {
                    	"Authorization": token
                	}
			})
				.then((res) => {
					if (res && res.data) {
						//console.log(res.data);
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
		redirect('/pharmacystock');

	  //console.log(lineRefs.current[index].current.value);
	}

	async function handleStockUpdate() {
		const request= {med_id: med_id,
						med_no: amountRef.current.value};
			//console.log(request);
			await axios
				.put('/pharmacy/mypharmacy', request, {
					headers: {
                    	"Authorization": token
                	}
			})
				.then((res) => {
					if (res && res.data) {
						//console.log(res.data);
						navigate('/pharmacystock');
					}
				})
				.catch((err) => {
					if (err && err.response) {
						console.log("Error:", err.response.data);
						if (err.response.status === 401) {
							//setErrorMessage('Invalid TCKN or password');
						} else if (err.response.status === 400) {
							setErrorMessage(err.response.data.msg);
						}
					} else {
						setErrorMessage('Connection error');
					}
			});
			window.location.reload();
			handleCloseMedicineStock();
			handleClose();
	}

	async function handleNewMedicineSubmit() {
		const request= {med_name: formMedName.current.value,
					med_dosage: formDosage.current.value,
					med_type: formMedType.current.value,
					med_used_for: formUsedFor.current.value,
					med_age: formMinAge.current.value,
					med_presc_type: formPrescType.current.value,
					med_side_effects: formSideEffect.current.value,
					med_risk_factors: formRiskFactor.current.value,
					med_preserve_cond: formPreserveConditions.current.value,
					med_prod_firm: formProducingFirm.current.value,
					med_price: formPrice.current.value};
			await axios
				.post('/pharmacy/register_drug', request, {
					headers: {
                    	"Authorization": token
                	}
			})
				.then((res) => {
					if (res && res.data) {
						//console.log(res.data);
						props.displayMessage(formMedName.current.value,0);
						navigate('/pharmacystock');
					}
				})
				.catch((err) => {
					if (err && err.response) {
						console.log("Error:", err.response.data);
						if (err.response.status === 401) {
							setErrorMessage('Authorization error');
						} else if (err.response.status === 400) {
							setErrorMessage(err.response.data.msg);
						}
						else if (err.response.status === 500) {
							if(err.response.data.includes('Duplicate'))
							props.displayMessage(formMedName.current.value,2)
							else
							props.displayMessage(formMedName.current.value,1)

						}
					} else {
						setErrorMessage('Connection error');
					}
			});
			window.location.reload();
			handleCloseNewMedicine();
			handleClose();
		}
  
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
	const initialValues = {
		medicinename: '',
		prescriptiontype: 'White',
		usedfor: '',
		dosage: '',
		side_effects: '',
		risk_factors: '',
		preserve_conditions: '',
		prod_firm: '',
		price: '',
		medtype: '',
		minage: '',
	  };

	const validationSchema = Yup.object({
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
        <DialogTitle align='center'> Add a medicine</DialogTitle>
        <DialogContent>
            <Button onClick={handleOpenNewMedicine}>Register new medicine to system</Button>
            <Button onClick={handleOpenMedicineStock}>Add new medicine to stock</Button>
        </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
		</Dialog>
            <Dialog open={openNewMedicineDialog} onClose={handleCloseNewMedicine}>
            <DialogTitle>Register New Medicine</DialogTitle>
    
            <DialogContent>
                <DialogContentText>
                Register a new medicine to the database by filling the form.
            	</DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="medicinename"
				name='medicinename'
                label="Name"
				inputRef={formMedName}
                fullWidth
                variant="standard"
            />
            <TextField
                id="prescriptiontype"
				name='prescriptiontype'
                select
                label="Prescription Type"
				inputRef={formPrescType}
                defaultValue="White"
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
				inputRef={formUsedFor}
                fullWidth
                variant="standard"
            />
            <TextField
                autoFocus
                margin="dense"
                id="dosage"
				name='dosage'
				inputRef={formDosage}
                label="Dosages"
                fullWidth
                variant="standard"
            />
            <TextField
                autoFocus
                margin="dense"
                id="side_effects"
				name='side_effects'
				inputRef={formSideEffect}
                label="Side effects"
                fullWidth
                variant="standard"
            />
            <TextField
                autoFocus
                margin="dense"
                id="risk_factors"
				name='risk_factors'
				inputRef={formRiskFactor}
                label="Risk Factors"
                fullWidth
                variant="standard"
            />
            <TextField
                autoFocus
                margin="dense"
                id="preserve_conditions"
				name='preserve_conditions'
				inputRef={formPreserveConditions}
                label="Preserve Conditions"
                fullWidth
                variant="standard"
            />
             <TextField
                autoFocus
                margin="dense"
                id="prod_firm"
				name='prod_firm'
				inputRef={formProducingFirm}
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
				inputRef={formPrice}
                type='number'
                fullWidth
                variant="standard"
            />
            <TextField
                autoFocus
                margin="dense"
                id="medtype"
				name='medtype'
				inputRef={formMedType}
                label="Medication Type"
                fullWidth
                variant="standard"
            />
            <TextField
                autoFocus
                margin="dense"
                id="minage"
				name='minage'
				inputRef={formMinAge}
                label="Minimum Age"
                type='number'
                fullWidth
                variant="standard"
            />
            </DialogContent>
                <DialogActions>
                <Button onClick={handleCloseNewMedicine}>Cancel</Button>
				<Button onClick={()=> handleNewMedicineSubmit()} >Submit</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openMedicineStockDialog} onClose={handleCloseMedicineStock}>
            <DialogTitle>Add medicine to stock</DialogTitle>
            <DialogContent>
                <DialogContentText>
                You can add a medicine to stock by selecting the name and selecting an amount.
            </DialogContentText>
            <TextField
				autoFocus
				margin="dense"
                id="medicinename"
                select
                label="Name"
				value={med_id}
				onChange={handleMedChange}
                fullWidth
                SelectProps={{
                    native: true,
                  }}
                helperText="Please select medication name"
                variant="standard"
            >
            {medicinenames.map((medicine,index) => (
            <option key={medicine.name} value={medicine.med_id}>
              {medicine.name}
            </option>
            ))}
            </TextField>
      
            <TextField
                autoFocus
                margin="dense"
                id="amount"
				inputRef={amountRef}
                label="Amount"
                type='number'
                fullWidth
                variant="standard"
            />
            </DialogContent>
                <DialogActions>
                <Button onClick={handleCloseMedicineStock}>Cancel</Button>
                <Button onClick={handleStockUpdate}>Submit</Button>
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
								<TableCell align="center">Medicine Name</TableCell>
								<TableCell align="right">Requirement</TableCell>
								<TableCell align="right">Usage Purpose</TableCell>
								<TableCell align="right">Side Effects</TableCell>
								<TableCell align="right">Price</TableCell>
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
									
									<TableCell>{medicine.name}</TableCell>
									<TableCell align="right">
										<SeverityPill color={`${medicine.prescription_type}`}>
											{medicine.prescription_type}
										</SeverityPill>
									</TableCell>
									<TableCell align="right">
										{medicine.used_for}
									</TableCell>
									<TableCell align="right">{medicine.side_effects}</TableCell>
									<TableCell align="right">
										{medicine.price}
									</TableCell>
									<TableCell align="right">
										<TextField
											type='number'
											inputRef={lineRefs.current[index]}
											InputProps={{
												inputProps: { 
													max: 1000, min: 0 
												}
											}}
											onChange={setUpdateClickable}
											defaultValue={medicine.amount}
										/>
									</TableCell>
									<TableCell align="right">
										<>
											<Tooltip>
												<IconButton
													onClick={()=> handleUpdateClick(index, medicine.med_id)}
													disabled= {!updateClickable}
												>
													<CheckIcon />
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
