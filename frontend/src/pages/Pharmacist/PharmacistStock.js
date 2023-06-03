import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
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
import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { SeverityPill } from 'components/SeverityPill/SeverityPill';

const PharmacistStock = (props) => {
	const { medicines } = props;
	console.log(medicines);

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
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
            <Button onClick={handleOpenNewMedicine}>Add new medicine to database</Button>
            <Button onClick={handleOpenMedicineStock}>Add new medicine to stock</Button>
            <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Subscribe</Button>
            </DialogActions>
        //new medicine dialog
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
                id="name"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
            />
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
            />
            </DialogContent>
                <DialogActions>
                <Button onClick={handleCloseNewMedicine}>Cancel</Button>
                <Button>Submit</Button>
                </DialogActions>
            </Dialog>

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
								<TableCell align="right">Operation</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
                            
							{filteredMedinices?
                            filteredMedinices.map((medicine, index) => (
								<TableRow
									key={index}
									sx={{
										border: 0,
									}}
								>
									<TableCell>
										<img alt={medicine.name} src={medicine.image}/>
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
									<TableCell align="right">
										<>
											<Tooltip>
												<IconButton
													onClick={() => {props.addToShoppingCart(medicine)}}
													disabled={medicine.prescriptionStatus === 'Not Prescribed'}
												>
													<AddShoppingCartIcon />
												</IconButton>
											</Tooltip>
										</>
									</TableCell>
								</TableRow>
							)):null}
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
						<Button
							color="primary" 
							size="large" 
							variant="contained"
							onClick={props.confirmOrder}
						>
							Confirm Order
						</Button>
				</Box>
			</PerfectScrollbar>
		</Card>
	);
};

export { PharmacistStock };
