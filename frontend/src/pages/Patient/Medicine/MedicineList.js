import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
	Box,
	Button,
	Card,
	CardHeader,
	Divider,
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

const MedicineList = (props) => {
	const { medicines, prescribedMeds, name, setName, usage, setUsage, risk, setRisk, firm, setFirm, minPrice, setMinPrice, maxPrice, setMaxPrice, pharmacy, setPharmacy } = props;
	//console.log(medicines);

	const handleName = (event) => {
		setName(event.target.value)
	};
	const handleUsage = (event) => {
		setUsage(event.target.value)
	};
	const handleRisk = (event) => {
		setRisk(event.target.value)
	};
	const handleFirm = (event) => {
		setFirm(event.target.value)
	};
	const handleMin = (event) => {
		setMinPrice(event.target.value)
	};
	const handleMax = (event) => {
		setMaxPrice(event.target.value)
	};
	const handlePharmacy = (event) => {
		setPharmacy(event.target.value)
	};

	const [anchorEl, setAnchorEl] = useState(null);

	const handleOpenPopover = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClosePopover = () => {
		setAnchorEl(null);
	};

	const applyFilters = () => {
		props.getAllMedicine(prescribedMeds);
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
				<Box
					sx={{
						py: 1.5,
						px: 2,
					}}
				>
					<TextField
						select
						value={pharmacy}
						onChange={handlePharmacy}
					>
						{props.pharmacies.map((pharmacy, index) => (
							<MenuItem key={index} value={pharmacy.pharmacy_id}>
								{pharmacy.name}
							</MenuItem>
						))}
					</TextField>
				</Box>
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
								Name
							</FormLabel>
							<Box
								sx={{
									pt: 2,
									pb: 2
								}}
							>
							<TextField 
								type='text' 
								label='Med Name'
								value={name}
								onChange={handleName}
							/>
							</Box>
						</FormControl>
						<Divider />
						<FormControl>
							<FormLabel id="demo-radio-buttons-group-label">
								Usage Purpose
							</FormLabel>
							<RadioGroup
								aria-labelledby="demo-radio-buttons-group-label"
								defaultValue="female"
								name="radio-buttons-group"
								value={usage}
								onChange={handleUsage}
							>
								<FormControlLabel
									value="Pain, Fever"
									control={<Radio />}
									label="Pain, Fever"
								/>
								<FormControlLabel
									value="High blood pressure"
									control={<Radio />}
									label="High blood pressure"
								/>
								<FormControlLabel
									value="Type 2 Diabetes"
									control={<Radio />}
									label="Type 2 Diabetes"
								/>
								<FormControlLabel
									value="High cholesterol"
									control={<Radio />}
									label="High cholesterol"
								/>
								<FormControlLabel
									value="Acid reflux"
									control={<Radio />}
									label="Acid reflux"
								/>
								<FormControlLabel
									value="Asthma"
									control={<Radio />}
									label="Asthma"
								/>
								<FormControlLabel
									value="Allergies"
									control={<Radio />}
									label="Allergies"
								/>
								<FormControlLabel
									value="Blood thinning"
									control={<Radio />}
									label="Blood thinning"
								/>
								<FormControlLabel
									value="Hypothyroidism"
									control={<Radio />}
									label="Hypothyroidism"
								/>
								<FormControlLabel
									value="none"
									control={<Radio />}
									label="None"
								/>
							</RadioGroup>
						</FormControl>
						<Divider />
						<FormControl>
							<FormLabel id="demo-radio-buttons-group-label">
								Risk Factor
							</FormLabel>
							<RadioGroup
								aria-labelledby="demo-radio-buttons-group-label"
								defaultValue="female"
								name="radio-buttons-group"
								value={risk}
								onChange={handleRisk}
							>
								<FormControlLabel
									value="Bleeding disorders"
									control={<Radio />}
									label="Bleeding disorders"
								/>
								<FormControlLabel
									value="Pregnancy"
									control={<Radio />}
									label="Pregnancy"
								/>
								<FormControlLabel
									value="Kidney disease"
									control={<Radio />}
									label="Kidney disease"
								/>
								<FormControlLabel
									value="Liver disease"
									control={<Radio />}
									label="Liver disease"
								/>
								<FormControlLabel
									value="Kidney disease"
									control={<Radio />}
									label="Kidney disease"
								/>
								<FormControlLabel
									value="Heart disease"
									control={<Radio />}
									label="Heart disease"
								/>
								<FormControlLabel
									value="Heart problems"
									control={<Radio />}
									label="Heart problems"
								/>
								<FormControlLabel
									value="none"
									control={<Radio />}
									label="None"
								/>
							</RadioGroup>
						</FormControl>
						<Divider />
						<FormControl>
							<FormLabel id="demo-radio-buttons-group-label">
								Side Effects
							</FormLabel>
							<RadioGroup
								aria-labelledby="demo-radio-buttons-group-label"
								defaultValue="female"
								name="radio-buttons-group"
								value={firm}
								onChange={handleFirm}
							>
								<FormControlLabel
									value="ABC"
									control={<Radio />}
									label="ABC"
								/>
								<FormControlLabel
									value="DEF"
									control={<Radio />}
									label="DEF"
								/>
								<FormControlLabel
									value="GHI"
									control={<Radio />}
									label="GHI"
								/>
								<FormControlLabel
									value="JKL"
									control={<Radio />}
									label="JKL"
								/>
								<FormControlLabel
									value="MNO"
									control={<Radio />}
									label="MNO"
								/>
								<FormControlLabel
									value="PQR"
									control={<Radio />}
									label="PQR"
								/>
								<FormControlLabel
									value="STU"
									control={<Radio />}
									label="STU"
								/>
								<FormControlLabel
									value="XYZ"
									control={<Radio />}
									label="XYZ"
								/>
								<FormControlLabel
									value="VWX"
									control={<Radio />}
									label="VWX"
								/>
								<FormControlLabel
									value="YZ"
									control={<Radio />}
									label="YZ"
								/>
								<FormControlLabel
									value="none"
									control={<Radio />}
									label="None"
								/>
							</RadioGroup>
						</FormControl>
						<Divider />
						<FormControl>
							<FormLabel id="demo-radio-buttons-group-label">
								Price
							</FormLabel>
							<Box
								sx={{
									pt: 2
								}}
							>
							<TextField 
								type='number' 
								label='Min Price'
								value={minPrice}
								onChange={handleMin}
							/>
							</Box>
							<Box
								sx={{
									pt: 2
								}}
							>
							<TextField
								type='number' 
								label='Max Price'
								value={maxPrice}
								onChange={handleMax}
							/>
							</Box>
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
								<TableCell>Medicine Name</TableCell>
								<TableCell align="right">Type</TableCell>
								<TableCell align="right">Requirement</TableCell>
								<TableCell align="right">Usage Purpose</TableCell>
								<TableCell align="right">Risk Factors</TableCell>
								<TableCell align="right">Side Effects</TableCell>
								<TableCell align="right">Producer</TableCell>
								<TableCell align="right">Price</TableCell>
								<TableCell align="right">Prescribed</TableCell>
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
									<TableCell align="right">{medicine.med_type}</TableCell>
									<TableCell align="right">
										<SeverityPill color={`${medicine.prescription_type}`}>
											{medicine.prescription_type}
										</SeverityPill>
									</TableCell>
									<TableCell align="right">
										{medicine.used_for}
									</TableCell>
									<TableCell align="right">{medicine.risk_factors}</TableCell>
									<TableCell align="right">{medicine.side_effects}</TableCell>
									<TableCell align="right">{medicine.prod_firm}</TableCell>
									<TableCell align="right">{medicine.price + "₺"}</TableCell>
									<TableCell align="right">{medicine.prescribed}</TableCell>
									<TableCell align="right">
										<>
											<Tooltip>
												<IconButton
													onClick={() => {props.addToShoppingCart(medicine)}}
													disabled={medicine.prescribed === "No"}
												>
													<AddShoppingCartIcon />
												</IconButton>
											</Tooltip>
										</>
									</TableCell>
								</TableRow>
							))}
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

export { MedicineList };
