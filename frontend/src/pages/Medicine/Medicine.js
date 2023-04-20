import { Container, Grid } from '@mui/material';
import { MedicineList } from './MedicineList';
import Minoset from '../../assets/images/minoset.png'
import Parol from '../../assets/images/parol.png'
import Arveles from '../../assets/images/arveles.png'
import Codeine from '../../assets/images/codeine.png'
import Augmentin from '../../assets/images/augmentin.png'
import Concerta from '../../assets/images/concerta.png'
const medicineList = [
	{
		name: 'Parol',
		type: 'Paracetamol',
		requiredProspectus: 'white',
		sideEffect: 'Dryness in mouth, Dizziness, Tremors, Insomnia',
		prescriptionStatus: 'Over the Counter',
		image: Parol,
	},
	{
		name: 'Augmentin',
		type: 'Antibiotic',
		requiredProspectus: 'white',
		sideEffect: 'Nausea, Vomiting, Headache, Diarrhea',
		prescriptionStatus: 'Not Prescribed',
		image: Augmentin,
	},
	{
		name: 'Minoset Plus',
		type: 'Paracetamol',
		requiredProspectus: 'white',
		sideEffect: 'Severe nausea, Vomiting, Stomach pain',
		prescriptionStatus: 'Over the Counter',
		image: Minoset,
	},
	{
		name: 'Arveles',
		type: 'Anti-inflammatory',
		requiredProspectus: 'white',
		sideEffect: 'Heartburn, Nausea and vomiting, Diarrhea',
		prescriptionStatus: 'Over the Counter',
		image: Arveles,
	},
	{
		name: 'Concerta',
		type: 'Nervous System Stimulant',
		requiredProspectus: 'red',
		sideEffect: 'Nervousness, Trouble sleeping, Loss of appetite, Weight loss',
		prescriptionStatus: 'Not Prescribed',
		image: Concerta,
	},
	{
		name: 'Codeine Phosphate',
		type: 'Pain Killer',
		requiredProspectus: 'red',
		sideEffect: 'Constipation, Nausea and Stomach cramps, Mood changes, Dizziness',
		prescriptionStatus: 'Prescribed',
		image: Codeine,
	},
];
const Medicine = () => {
	return (
		<>
			<title>Medicine</title>
			<Container maxWidth="md">
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
