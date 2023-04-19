import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
	Box,
	Card,
	CardHeader,
	Divider,
	FormControl,
	FormControlLabel,
	FormLabel,
	IconButton,
	Link,
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
import { SeverityPill } from '../../components/SeverityPill/SeverityPill';

const MedicineList = (props) => {
	const { medicines } = props;
	console.log(medicines);

	const [prescription, setPrescription] = useState('none');

	const [filteredMedinices, setFilteredMedinices] = useState(medicines);

	const handlePrescription = (event) => {
		setPrescription(event.target.value);
	};

	const [anchorEl, setAnchorEl] = useState(null);

	const handleOpenPopover = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClosePopover = () => {
		setAnchorEl(null);
	};

	const applyFilters = () => {
		if (prescription !== 'none') {
			setFilteredMedinices(
				medicines.filter(
					(medicine) => medicine.requiredProspectus === prescription
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
								value={prescription}
								onChange={handlePrescription}
							>
								<FormControlLabel
									value="white"
									control={<Radio />}
									label="White"
								/>
								<FormControlLabel value="red" control={<Radio />} label="Red" />
								<FormControlLabel
									value="purple"
									control={<Radio />}
									label="Purple"
								/>
								<FormControlLabel
									value="orange"
									control={<Radio />}
									label="Orange"
								/>
								<FormControlLabel
									value="green"
									control={<Radio />}
									label="Green"
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
								<TableCell>Medicine Name</TableCell>
								<TableCell align="right">Requirement</TableCell>
								<TableCell align="right">Side Effects</TableCell>
								<TableCell align="right">Prospectus</TableCell>
								<TableCell align="right">Operation</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredMedinices.map((medicine, index) => (
								<TableRow
									key={index}
									sx={{
										border: 0,
									}}
								>
									<TableCell>{medicine.name}</TableCell>
									<TableCell align="right">
										<SeverityPill color={`${medicine.requiredProspectus}`}>
											{medicine.requiredProspectus}
										</SeverityPill>
									</TableCell>
									<TableCell align="right">{medicine.sideEffect}</TableCell>
									<TableCell align="right">
										<Link href={medicine.prospectusLink}>Link</Link>
									</TableCell>
									<TableCell align="right">
										<>
											<Tooltip>
												<IconButton
													disabled={
														medicine.requiredProspectus === 'red' ||
														medicine.requiredProspectus === 'purple'
													}
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
			</PerfectScrollbar>
		</Card>
	);
};

export { MedicineList };
