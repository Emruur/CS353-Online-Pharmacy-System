import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
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
	Tooltip,
	Typography,
} from '@mui/material';
import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { SeverityPill } from 'components/SeverityPill/SeverityPill';

const MedicineList = (props) => {
	const { medicines, prescribedMedicines } = props;

	const [type, setType] = useState('none');

	const [filteredMedinices, setFilteredMedinices] = useState(medicines);

	const handlePrescription = (event) => {
		setType(event.target.value);
	};

	const [anchorEl, setAnchorEl] = useState(null);

	const handleOpenPopover = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClosePopover = () => {
		setAnchorEl(null);
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
                {medicines &&
				    <CardHeader title="All Medicines" />
                }
                {prescribedMedicines &&
				    <CardHeader title="Prescribed Medicine" />
                }
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
								<TableCell align="right">Operation</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{medicines && medicines.map((medicine, index) => (
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
									<TableCell align="right">
										<>
											<Tooltip>
												<IconButton
													onClick={() => {props.prescribe(medicine)}}
												>
													<AddIcon />
												</IconButton>
											</Tooltip>
										</>
									</TableCell>
								</TableRow>
							))}
							{prescribedMedicines && prescribedMedicines.map((medicine, index) => (
								medicine.quantity !== 0 && <TableRow
									key={index}
									sx={{
										border: 0,
									}}
								>
									<TableCell>{medicine.medicine.name}</TableCell>
									<TableCell align="right">
										<SeverityPill color={`${medicine.medicine.prescription_type}`}>
											{medicine.medicine.prescription_type}
										</SeverityPill>
									</TableCell>
									<TableCell align="right">
										{medicine.medicine.used_for}
									</TableCell>
									<TableCell align="right">
										<>
											<Tooltip>
												<IconButton
													onClick={() => {props.unprescribe(medicine.medicine)}}
												>
													<RemoveIcon />
												</IconButton>
											</Tooltip>
										</>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>
			</PerfectScrollbar>
		</Card>
	);
};

export { MedicineList };
