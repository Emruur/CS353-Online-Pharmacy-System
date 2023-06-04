import { Button,Box,
	 Container, Grid,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
    TextField,
	PerfectScrollbar,
SeverityPill,Tooltip,IconButton } from "@mui/material";


const PharmacistDashboard = () => {
	const medicines=[
			{
			"name": 'Aspirin',
			"prescription_type": "white",
			"used_for": "Pain, Fever",
			"dosages": "1-2 tablets every 4-6 hours",
			"side_effects": "Stomach irritation",
			"risk_factors": "Bleeding disorders",
			"preserve_conditions": "Store at room temperature",
			"prod_firm": "ABC Pharmaceuticals",
			"price": 4.99,
			"med_type": "Tablet",
			"med_age": "18",
			},
		{
			"name": 'Lisinopril',
			"prescription_type": "green",
			"used_for": "High blood pressure",
			"dosages": "1 tablet daily",
			"side_effects": "Stomach irritation",
			"risk_factors": "Pregnancy, Kidney problems",
			"preserve_conditions": "Keep in a dry place",
			"prod_firm": "XYZ Pharmaceuticals",
			"price": 9.99,
			"med_type": "Tablet",
			"med_age": "18",
			},
		
		{
			"name": 'Metformin',
			"prescription_type": "white",
			"used_for": "Type 2 Diabetes",
			"dosages": "1-2 tablets with meals",
			"side_effects": "Nausea, Diarrhea",
			"risk_factors": "Kidney disease",
			"preserve_conditions": "Store at room temperature",
			"prod_firm": "DEF Pharmaceuticals",
			"price": 7.50,
			"med_type": "Tablet",
			"med_age": "18",
			},
		
		{

			"name": 'Aspirin',
			"prescription_type": "white",
			"used_for": "Pain, Fever",
			"dosages": "1-2 tablets every 4-6 hours",
			"side_effects": "Stomach irritation",
			"risk_factors": "Bleeding disorders",
			"preserve_conditions": "Store at room temperature",
			"prod_firm": "ABC Pharmaceuticals",
			"price": 4.99,
			"med_type": "Tablet",
			"med_age": "18",
			},

		{

			"name": 'Aspirin',
			"prescription_type": "white",
			"used_for": "Pain, Fever",
			"dosages": "1-2 tablets every 4-6 hours",
			"side_effects": "Stomach irritation",
			"risk_factors": "Bleeding disorders",
			"preserve_conditions": "Store at room temperature",
			"prod_firm": "ABC Pharmaceuticals",
			"price": 4.99,
			"med_type": "Tablet",
			"med_age": "18",
			},
						
		

	]


	return (
		<>
			<title>Create Reports</title>

			{/* <PerfectScrollbar>
				<Box>
					<Table title='1-)Purchased medicine between time frame'>
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
			</PerfectScrollbar> */}
		</>
	);
};

export default PharmacistDashboard;
