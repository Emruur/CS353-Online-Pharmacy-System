import {
	Alert,
	AlertTitle,
	Box,
	Button,
	Container,
	Grid,
	TextField,
	Typography,
} from '@mui/material';
import axios from 'axios_config';
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode"
import { FormCreatePrescription } from 'components/PrescriptionForms/form-create-prescription';
import * as Yup from 'yup';

/*const medicineList = [
	{
		name: 'Parol',
		type: 'Paracetamol',
		requiredProspectus: 'white',
		sideEffect: 'Dryness in mouth, Dizziness, Tremors, Insomnia',
		prescriptionStatus: 'Over the Counter',
        count: 0,
		price: 10
	},
	{
		name: 'Augmentin',
		type: 'Antibiotic',
		requiredProspectus: 'white',
		sideEffect: 'Nausea, Vomiting, Headache, Diarrhea',
		prescriptionStatus: 'Not Prescribed',
		price: 30
	},
	{
		name: 'Minoset Plus',
		type: 'Paracetamol',
		requiredProspectus: 'white',
		sideEffect: 'Severe nausea, Vomiting, Stomach pain',
		prescriptionStatus: 'Over the Counter',
		price: 15
	},
	{
		name: 'Arveles',
		type: 'Anti-inflammatory',
		requiredProspectus: 'white',
		sideEffect: 'Heartburn, Nausea and vomiting, Diarrhea',
		prescriptionStatus: 'Over the Counter',
		price: 40
	},
	{
		name: 'Concerta',
		type: 'Nervous System Stimulant',
		requiredProspectus: 'red',
		sideEffect: 'Nervousness, Trouble sleeping, Loss of appetite, Weight loss',
		prescriptionStatus: 'Not Prescribed',
		price: 100
	},
	{
		name: 'Codeine Phosphate',
		type: 'Pain Killer',
		requiredProspectus: 'red',
		sideEffect: 'Constipation, Nausea and Stomach cramps, Mood changes, Dizziness',
		prescriptionStatus: 'Prescribed',
		price: 1000
	},
];*/


const CreatePrescription = () => {

	const token = "Bearer " + sessionStorage.getItem("token");

	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

	const [medicineList, setMedicineList] = useState([]);
    const [medicines, setMedicines] = useState([]);

    const formik = useFormik({
		initialValues: {
			prescribed_to: '',
			type: '',
            notes: '',
            medicine: []
		},
		validationSchema: Yup.object({
            prescribed_to: Yup.number('TCKN should only consist of digits')
                .max(100000000000, 'TCKN cannot exceed 11 digits')
                .required('TCKN is required'),
			type: Yup.string()
				.required('Type is required'),
            notes: Yup.string()
                .required('Notes are required'),
		}),
		onSubmit: async (values) => {
            const newValues = {
                prescribed_to: values.prescribed_to,
                type: values.type,
                notes: values.notes,
                medicine: medicines.filter((medicine) => medicine.type !== 0)
            }
			console.log(newValues)
			await axios
				.post('/prescription/', newValues, {
					headers: {
						"Authorization": token
					}
				})
				.then((res) => {
					if (res && res.data) {
                        console.log(res.data)
                        setSuccessMessage(res.data.msg);
					}
				})
				.catch((err) => {
					if (err && err.response) {
						if (err.response.status === 401) {
							setErrorMessage(err.response.data.msg);
						} else {
							setErrorMessage('Invalid request');
							console.log("Error", err.response);
						}
					} else {
						setErrorMessage('Connection error');
					}
				});
		},
	});

    useEffect(() => {
		const getAllMedicine = async () => {
			await axios.get('/medicine/', {
				headers: {
					"Authorization": token
				}
			})
				.then((res) => {
					if (res && res.data) {
						let arr = []
						let arr1 = []
						console.log(res.data)
						for (let i = 0; i < res.data.length; i++) {
							arr.push({medicine: res.data[i], quantity: 0, id: res.data[i].med_id})
							arr1.push(res.data[i]);
						}
						setMedicines(arr);
						setMedicineList(arr1)
					}
				})
				.catch((err) => {
					if (err && err.response) {
						console.log(err.response.data)
					}
				})
		};
		getAllMedicine();
	}, [])

	const prescribe = (medicine) => {
        let copy = [...medicines]
		for (let i = 0; i < copy.length; i++) {
			if (copy[i].medicine.name === medicine.name) {
				copy[i].quantity++;
				setSuccessMessage(`${medicine.name} added to the cart`);
			}
		}
        setMedicines(copy);
        console.log(medicines);
	}

    const unprescribe = (medicine) => {
        let copy = [...medicines]
		for (let i = 0; i < copy.length; i++) {
			if (copy[i].medicine.name === medicine.name) {
				copy[i].quantity--;
				setSuccessMessage(`${medicine.name} removed from the cart`);
			}
		}
        setMedicines(copy);
        console.log(medicines);
	}

    return(
        <>
            <title>CreatePrescription</title>
			<Container maxWidth="md">
				{successMessage.trim().length !== 0 && (
					<Alert
						severity="success"
						onClose={() => {
							setSuccessMessage('');
						}}
					>
						<AlertTitle>Success</AlertTitle>
						{successMessage}
					</Alert>
				)}
                {errorMessage.trim().length !== 0 && (
					<Alert
						severity="error"
						onClose={() => {
							setErrorMessage('');
						}}
					>
						<AlertTitle>Error</AlertTitle>
						{errorMessage}
					</Alert>
				)}
				<form onSubmit={formik.handleSubmit}>
				<Grid container spacing={3}>
					<Grid item lg={12} md={12} xl={15} xs={12}>
                        <FormCreatePrescription 
                            formik={formik} 
                            medicines={medicines}
                            medicineList={medicineList}
                            prescribe={prescribe}
                            unprescribe={unprescribe}
                        />
					</Grid>
				</Grid>
				<Box sx={{ py: 2 }}>
					<Button
						color="primary"
						disabled={formik.isSubmitting}
						fullWidth
						size="large"
						type="submit"
						variant="contained"
					>
						Prescribe
					</Button>
				</Box>
				</form>
			</Container>
        </>
    );
}

export default CreatePrescription;