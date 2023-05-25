import { Box, Container, Typography } from '@mui/material';
import { Collapsable } from './Collapsable';
import Minoset from 'assets/images/minoset.png'
import Parol from 'assets/images/parol.png'
import Arveles from 'assets/images/arveles.png'
import Codeine from 'assets/images/codeine.png'
import Augmentin from 'assets/images/augmentin.png'
import Concerta from 'assets/images/concerta.png'

const prescriptions = [
    {
        id: 0,
        prescribedBy: "Ahmet Tuğrul Sağlam",
        date: "04/02/2021",
        medication: [
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
                name: 'Concerta',
                type: 'Nervous System Stimulant',
                requiredProspectus: 'red',
                sideEffect: 'Nervousness, Trouble sleeping, Loss of appetite, Weight loss',
                prescriptionStatus: 'Not Prescribed',
                image: Concerta,
            }
        ]
    },
    {
        id: 1,
        prescribedBy: "Nisa Yılmaz",
        date: "18/06/2021",
        medication: [
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
                name: 'Codeine Phosphate',
                type: 'Pain Killer',
                requiredProspectus: 'red',
                sideEffect: 'Constipation, Nausea and Stomach cramps, Mood changes, Dizziness',
                prescriptionStatus: 'Prescribed',
                image: Codeine,
            }
        ]
    },
];

const Prescription = () => {
    return(
        <>
            <title>Prescriptions</title>
            <Container maxWidth="md">
				<Box sx={{ my: 3 }}>
					<Typography color="textPrimary" variant="h4">
						Previous Prescriptions
					</Typography>
				</Box>
                
                {prescriptions.map((prescription, index) => (
                    <Box key={index}>
                        <Collapsable prescription={prescription}/>
                    </Box>
                ))}
			</Container>
        </>
    );
};

export default Prescription;