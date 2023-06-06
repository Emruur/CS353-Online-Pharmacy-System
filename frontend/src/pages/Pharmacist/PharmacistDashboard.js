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

	const reportType1= useRef();
	const reportType2= useRef();

	const year1= useRef(null);


	const token =  "Bearer " +sessionStorage.getItem("token");

	const [soldMeds, setSoldMeds] = useState(null);
	const [displaySoldMeds, setDisplaySoldMeds] = useState(false);

	const [ageRange, setAgeRange] = useState(null);
	const [displayAgeRange, setDisplayAgeRange] = useState(false);

	const [drugRevenue, setDrugRevenue] = useState(null);
	const [displayDrugRevenue, setDisplayDrugRevenue] = useState(false);

	const [drugVolume, setDrugVolume] = useState(null);
	const [displayDrugVolume, setDisplayDrugVolume] = useState(false);

	const [monthlyRevenue, setMonthlyRevenue] = useState(null);
	const [displayMonthlyRevenue, setDisplayMonthlyRevenue] = useState(false);

	const filtertypes=[{
		"name": 'Use Purpose',
		"value": 'used_for'

		},
		{
		"name": 'Producing firm',
		"value": 'prod_firm'
		}
	];
	const allMonths = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	  ];
	
	async function getSoldMeds()  {
		const dates= {start_date: datestart1.current.value,
			end_date: dateend1.current.value};
			
		await axios.post('/reports/sold-medicine', dates, {
			headers: {
				"Authorization": token
			}
		})
			.then((res) => {
				if (res && res.data) {
					let arr = []
							arr.push(res.data.result);
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

	async function getAgeRange()  {
		const dates= {start_date: datestart2.current.value,
			end_date: dateend2.current.value};
			
		await axios.post('/reports/min-max-age', dates, {
			headers: {
				"Authorization": token
			}
		})
			.then((res) => {
				if (res && res.data) {
					let arr = []
							arr.push(res.data.result);
					setAgeRange(arr)
				}
			})
			.catch((err) => {
				if (err && err.response) {
					console.log("Error:",err.response)
				}
			})
		setDisplayAgeRange(true);
	}

	async function getDrugRevenue()  {
		const reportType= {type: reportType1.current.value};
			
		await axios.post('/reports/avg-revenue', reportType, {
			headers: {
				"Authorization": token
			}
		})
			.then((res) => {
				if (res && res.data) {
					let arr = []
							arr.push(res.data.result);
					setDrugRevenue(arr)
				}
			})
			.catch((err) => {
				if (err && err.response) {
					console.log("Error:",err.response)
				}
			})
		setDisplayDrugRevenue(true);
	}

	async function getDrugVolume()  {
		const reportType= {type: reportType2.current.value};
			
		await axios.post('/reports/max-purchased', reportType, {
			headers: {
				"Authorization": token
			}
		})
			.then((res) => {
				if (res && res.data) {
					let arr = []
							arr.push(res.data.result);
					setDrugVolume(arr)
				}
			})
			.catch((err) => {
				if (err && err.response) {
					console.log("Error:",err.response)
				}
			})
		setDisplayDrugVolume(true);
	}
	async function getMonthlyRevenue()  {
		const yearmsg = {year: year1.current.value};
			
		await axios.post('/reports/monthly-revenue', yearmsg, {
			headers: {
				"Authorization": token
			}
		})
			.then((res) => {
				if (res && res.data) {
					let arr = []
							arr.push(res.data.result);
					setMonthlyRevenue(arr)
				}
			})
			.catch((err) => {
				if (err && err.response) {
					console.log("Error:",err.response)
				}
			})
		setDisplayMonthlyRevenue(true);
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
							inputRef={datestart2}
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
							inputRef={dateend2}
							name="enddate"
							type="date"
							variant="outlined"
							required
							/>

						</TableCell>
						<TableCell align="right">
							<Button onClick={() =>getAgeRange()}>Generate</Button>

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
					{ageRange&& displayAgeRange ? (
						ageRange[0].map((medicine, index) => (
						<TableRow
						key={index}
						sx={{
							border: 0,
						}}
						>
						<TableCell align="center">{medicine.name}</TableCell>
						<TableCell align="center">{medicine.min}</TableCell>
						<TableCell align="center">{medicine.max}</TableCell>

						</TableRow>
					))):
					<TableRow>
							<TableCell align="center">-</TableCell>
							<TableCell align="center">-</TableCell>
							<TableCell align="center">-</TableCell>
						</TableRow>
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
				></Box>
				</AccordionDetails>
			</Accordion>

			<Accordion>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1a-content"
				id="panel1a-header"
        >
			<Typography>Monthly Average Revenue of a Drug Type</Typography>
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
				inputRef={reportType1}
                defaultValue="Use purpose"
                SelectProps={{
                    native: true,
                  }}
                helperText="Please select drug group"
                fullWidth
                variant="standard"
            >
            {filtertypes.map((option) => (
            <option key={option.name} value={option.value}>
              {option.name}
            </option>
            ))}
            </TextField>

					</TableCell>
					<TableCell align="right">
						<Button onClick={() =>getDrugRevenue()}>Generate</Button>

					</TableCell>
				</TableRow>
				</Box>
				<Box>
					<Table title='1-)Purchased medicine between time frame'>
						<TableHead sx={{ display: 'table-header-group' }}>
						<TableRow>
							<TableCell align="center">{reportType1.current ? reportType1.current.value: 'Used For' }</TableCell>
							<TableCell align="center">Revenue</TableCell>
						</TableRow>
						</TableHead>
						<TableBody>
						{drugRevenue && displayDrugRevenue ? (
						drugRevenue[0].map((company, index) => (
							<TableRow
							key={index}
							sx={{
								border: 0,
							}}
							>
							<TableCell align="center">{company.prod_firm? company.prod_firm: company.used_for}</TableCell>
							<TableCell align="center">{company.avg_revenue}</TableCell>
							</TableRow>
						))):<TableRow>
						<TableCell align="center">-</TableCell>
						<TableCell align="center">-</TableCell>
					</TableRow>
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
							inputRef={reportType2}
							defaultValue="Use purpose"
							SelectProps={{
								native: true,
							}}
							helperText="Please select drug group"
							fullWidth
							variant="standard"
						>
							{filtertypes.map((option) => (
							<option key={option.name} value={option.value}>
							{option.name}
							</option>
							))}
						</TextField>

					</TableCell>
					<TableCell align="right">
						<Button onClick={()=>getDrugVolume()}>Generate</Button>

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
					{drugVolume && displayDrugVolume ? (
					drugVolume[0].map((medicine, index) => (
						<TableRow
						key={index}
						sx={{
							border: 0,
						}}
						>
						<TableCell align="center">{medicine.name}</TableCell>
						<TableCell align="center">{medicine.count}</TableCell>
						<TableCell align="center">{medicine.used_for?medicine.used_for: medicine.prod_firm}</TableCell>
						</TableRow>
					))):
					<TableRow>
						<TableCell align="center">-</TableCell>
						<TableCell align="center">-</TableCell>
					</TableRow>
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
					<TextField type="number" min="1980" max="2023" step="1" defaultValue="2023" inputRef={year1} />
					</TableCell>
					<TableCell align="right">
						<Button onClick={() => getMonthlyRevenue()}>Generate</Button>

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
					{monthlyRevenue && displayMonthlyRevenue ? (
					monthlyRevenue[0].map((month, index) => (
						<TableRow
						key={index}
						sx={{
							border: 0,
						}}
						>
						<TableCell align="center">{allMonths[month.month-1]}</TableCell>
						<TableCell align="center">{month.revenue}</TableCell>
						</TableRow>
					))):
					<TableRow>
					<TableCell align="center">-</TableCell>
					<TableCell align="center">-</TableCell>
					</TableRow>
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
