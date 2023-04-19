import { Container, Grid } from '@mui/material';
import { MedicineList } from './MedicineList';
const medicineList = [
	{
		name: 'Parol',
		requiredProspectus: 'white',
		sideEffect: 'None',
		prospectusLink: 'sasasa',
	},
	{
		name: 'Augmentin',
		requiredProspectus: 'red',
		sideEffect: 'None',
		prospectusLink: 'sasasa',
	},
	{
		name: 'Sudafed',
		requiredProspectus: 'purple',
		sideEffect: 'None',
		prospectusLink: 'sasasa',
	},
	{
		name: 'Concerta',
		requiredProspectus: 'red',
		sideEffect: 'None',
		prospectusLink: 'sasasa',
	},
];
const Medicine = () => {
	return (
		<>
			<title>Medicine</title>
			<Container>
				<Grid container spacing={3}>
					<Grid item lg={12} md={12} xl={15} xs={12}>
						<MedicineList medicines={medicineList} />
					</Grid>
				</Grid>
			</Container>
		</>
	);
};

export default Medicine;
