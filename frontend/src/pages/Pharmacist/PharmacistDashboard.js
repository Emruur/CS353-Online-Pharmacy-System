import { Button,Box,
	 Container, Grid,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
    TextField,
	Tooltip,
	IconButton, 
	Card, 
	CardHeader} from "@mui/material";
import axios from 'axios_config';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useRef,createRef, useEffect, useState } from 'react';
import { SeverityPill } from 'components/SeverityPill/SeverityPill';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const PharmacistDashboard = () => {
	const datestart1= useRef();
	const dateend1= useRef();
	const datestart2= useRef();
	const dateend2= useRef();

	const token =  "Bearer " +sessionStorage.getItem("token");

	const [soldMeds, setSoldMeds] = useState(null);
	const [displaySoldMeds, setDisplaySoldMeds] = useState(false);

	
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
			"med_cnt": "150",
			"min_age": "18",
			"max_age": "65",						
			},
		
			{
				
				"name": 'Parol',
				"prescription_type": "white",
				"used_for": "Pain",
				"dosages": "1-2 tablets every 4-6 hours",
				"side_effects": "Stomach irritation",
				"risk_factors": "Bleeding disorders",
				"preserve_conditions": "Store at room temperature",
				"prod_firm": "ABC Pharmaceuticals",
				"price": 4.99,
				"med_type": "Tablet",
				"med_age": "18",
				"med_cnt": "100",
				"min_age": "18",
				"max_age": "45",	
			},
			
			
			{
				
				"name": 'Arveles',
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
				"med_cnt": "35",
				"min_age": "21",
				"max_age": "37",	
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
				"med_cnt": "3",
				"min_age": "31",
				"max_age": "67",
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
				"med_cnt": "2",
				"min_age": "22",
				"max_age": "22",
				},
			
	];

	const filtertypes=[{
		"name": 'Use Purpose'

		},
		{
		"name": 'Producing firm'
		}
	];

	const companyRevenues=[{
		"name": 'Pfizer',
		"revenue": '50000'
		},
		{
		"name": "Bayer",
		"revenue": '120000'
		},
		{
			"name": "Novartis",
			"revenue": '100000'
			},
		{
			"name": "AbbVie",
			"revenue": '75000'
		},

	];
	const monthlyRevenues=[{
		"name": 'January',
		"revenue": '25000'
		},
		{
		"name": "February",
		"revenue": '37000'
		},
		{
		"name": "March",
		"revenue": '35000'
		},
		{
			"name": "April",
			"revenue": '26500'
		},
		{
			"name": "May",
			"revenue": '294500'
		},
		{
			"name": "June",
			"revenue": '28780'
		},
		{
			"name": "July",
			"revenue": '25500'
		},
		{
			"name": "August",
			"revenue": '30500'
		},
		{
			"name": "September",
			"revenue": '31250'
		},
		{
			"name": "October",
			"revenue": '32500'
		},
		{
			"name": "November",
			"revenue": '36450'
		},
		{
			"name": "December",
			"revenue": '38000'
		},
	];
	/* useEffect(() => {	}, [getsoldMeds]) */
	async function getSoldMeds()  {
		const dates= {start_date: datestart1.current.value,
			end_date: dateend1.current.value};
			
			console.log(token);
		await axios.post('/reports/sold-medicine', dates, {
			headers: {
				"Authorization": token
			}
		})
			.then((res) => {
				if (res && res.data) {
					console.log(res.data)
					let arr = []
							arr.push(res.data.result);
					console.log("Bunlar:",arr)
					setSoldMeds(arr)
				}
			})
			.catch((err) => {
				if (err && err.response) {
					console.log("Error:",err.response)
				}
			})
		setDisplaySoldMeds(true);
	}
		


	return (
  <>
  <Container maxWidth="md">
    <Grid container spacing={3}>
      <Grid item lg={12} md={12} xl={15} xs={12}>
        <Card>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <CardHeader title="Create Reports" />
          </Box>
          <PerfectScrollbar>
			<Accordion>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1a-content"
				id="panel1a-header"
        >
			<Typography>Most Sold Drugs in a Time Frame</Typography>
        	</AccordionSummary>
			<AccordionDetails>
				<Box>
					<Table>
						<TableBody>
									<TableRow>
								<TableCell align="center">
									<TextField
									fullWidth
									label="Start Date"
									margin="normal"
									name="startdate"
									inputRef= {datestart1}
									type="date"
									variant="outlined"
									required
									/>
								</TableCell>
								<TableCell align="center">
									<TextField
									fullWidth
									label="End Date"
									margin="normal"
									name="enddate"
									inputRef= {dateend1}
									type="date"
									variant="outlined"
									required
									/>
								</TableCell>
								<TableCell align="right">
									<Button onClick={() =>getSoldMeds()}>Generate</Button>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				
				</Box>
				<Box>
				<Table>
					<TableHead>
						<TableRow>
						<TableCell align="center">Medicine Name</TableCell>
						<TableCell align="center">Amount</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{soldMeds&& displaySoldMeds ? (
						soldMeds[0].map((medicine, index) => (
							<TableRow key={index}>
							<TableCell align="center">{medicine.name}</TableCell>
							<TableCell align="center">{medicine.count}</TableCell>
							</TableRow>
						))
						) : (
						<TableRow>
							<TableCell align="center">-</TableCell>
							<TableCell align="center">-</TableCell>
						</TableRow>
						)}
					</TableBody>
					</Table>
				</Box>
				<Box
				sx={{
					display: 'flex',
					justifyContent: 'flex-end',
					p: 2,
				}}
				></Box>
				</AccordionDetails>
			</Accordion>


			<Accordion>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1a-content"
				id="panel1a-header"
        >
			<Typography>Age Range for a Drug in a Time Frame</Typography>
        	</AccordionSummary>
			<AccordionDetails>
				<Box>
					<Table>  
						<TableBody>
							<TableRow>
						<TableCell align="center">
							<TextField
							fullWidth
							label="Start Date"
							margin="normal"
							name="startdate"
							type="date"
							variant="outlined"
							required
							/>
						</TableCell>
						<TableCell align="center">
							<TextField
							fullWidth
							label="End Date"
							margin="normal"
							name="startdate"
							type="date"
							variant="outlined"
							required
							/>

						</TableCell>
						<TableCell align="right">
							<Button>Generate</Button>

						</TableCell>
					</TableRow>
						</TableBody>
					</Table>
				
				</Box>
				<Box>
				<Table title='1-)Purchased medicine between time frame'>
					<TableHead sx={{ display: 'table-header-group' }}>
					<TableRow>
						<TableCell align="center">Medicine Name</TableCell>
						<TableCell align="center">Minimum Age</TableCell>
						<TableCell align="center">Maximum Age</TableCell>

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
						<TableCell align="center">{medicine.name}</TableCell>
						<TableCell align="center">{medicine.min_age}</TableCell>
						<TableCell align="center">{medicine.max_age}</TableCell>

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
				></Box>
				</AccordionDetails>
			</Accordion>

			<Accordion>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1a-content"
				id="panel1a-header"
        >
			<Typography>Yearly Total Revenue of a Drug Type</Typography>
        	</AccordionSummary>
			<AccordionDetails>
				<Box>
				<TableRow>
					
					<TableCell align="center">
					<TextField
                id="grouptype"
				name='grouptype'
                select
                label="Group Type"
                defaultValue="Use purpose"
                SelectProps={{
                    native: true,
                  }}
                helperText="Please select drug group"
                fullWidth
                variant="standard"
            >
            {filtertypes.map((option) => (
            <option key={option.name} value={option.name}>
              {option.name}
            </option>
            ))}
            </TextField>

					</TableCell>
					<TableCell align="right">
						<Button>Generate</Button>

					</TableCell>
				</TableRow>
				</Box>
				<Box>
					<Table title='1-)Purchased medicine between time frame'>
						<TableHead sx={{ display: 'table-header-group' }}>
						<TableRow>
							<TableCell align="center">Company name</TableCell>
							<TableCell align="center">Revenue</TableCell>
						</TableRow>
						</TableHead>
						<TableBody>
						{companyRevenues.map((company, index) => (
							<TableRow
							key={index}
							sx={{
								border: 0,
							}}
							>
							<TableCell align="center">{company.name}</TableCell>
							<TableCell align="center">{company.revenue}</TableCell>
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
					></Box>
				</AccordionDetails>
			</Accordion>


			<Accordion>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1a-content"
				id="panel1a-header"
        >
			<Typography>Sales Volume of Drug Types</Typography>
        	</AccordionSummary>
			<AccordionDetails>
				<Box>
				<TableRow>
					<TableCell align="center">
					<TextField
							id="grouptype"
							name='grouptype'
							select
							label="Group Type"
							defaultValue="Use purpose"
							SelectProps={{
								native: true,
							}}
							helperText="Please select drug group"
							fullWidth
							variant="standard"
						>
							{filtertypes.map((option) => (
							<option key={option.name} value={option.name}>
							{option.name}
							</option>
							))}
						</TextField>

					</TableCell>
					<TableCell align="right">
						<Button>Generate</Button>

					</TableCell>
				</TableRow>
				</Box>
				<Box>
				<Table >
					<TableHead sx={{ display: 'table-header-group' }}>
					<TableRow>
						<TableCell align="center">Medicine Name</TableCell>
						<TableCell align="center">Sales Volume</TableCell>
						<TableCell align="center">Drug Type</TableCell>

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
						<TableCell align="center">{medicine.name}</TableCell>
						<TableCell align="center">{medicine.med_cnt}</TableCell>
						<TableCell align="center">{medicine.used_for}</TableCell>
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
				></Box>
				</AccordionDetails>
			</Accordion>



			<Accordion>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1a-content"
				id="panel1a-header"
        >
			<Typography>Monthly Revenue by Year </Typography>
        	</AccordionSummary>
			<AccordionDetails>
				<Box>
				<TableRow>
				
					<TableCell align="center">
					<input type="number" min="1980" max="2023" step="1" defaultValue="2023"/>
					</TableCell>
					<TableCell align="right">
						<Button>Generate</Button>

					</TableCell>
				</TableRow>
				</Box>
				<Box>
				<Table>
					<TableHead sx={{ display: 'table-header-group' }}>
					<TableRow>
						<TableCell align="center">Month</TableCell>
						<TableCell align="center">Revenue</TableCell>
					</TableRow>
					</TableHead>
					<TableBody>
					{monthlyRevenues.map((month, index) => (
						<TableRow
						key={index}
						sx={{
							border: 0,
						}}
						>
						<TableCell align="center">{month.name}</TableCell>
						<TableCell align="center">{month.revenue}</TableCell>
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
				></Box>
				</AccordionDetails>
			</Accordion>

          </PerfectScrollbar>
        </Card>
      </Grid>
    </Grid>
  </Container>
</>
	);
};

export default PharmacistDashboard;
