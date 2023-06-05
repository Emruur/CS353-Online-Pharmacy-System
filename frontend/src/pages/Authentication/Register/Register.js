import {
	Alert,
	AlertTitle,
	Box,
	Button,
	Container,
	Link,
	Typography,
} from '@mui/material';
import axios from 'axios_config/index';
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPatientRegister } from 'components/RegisterForms/form-patient-register';
import { FormDoctorRegister } from 'components/RegisterForms/form-doctor-register';
import { FormPharmacistRegister } from 'components/RegisterForms/form-pharmacist-register';
import { format } from 'date-fns';
import * as Yup from 'yup';

const specialityList = [
	{
		name : "Not chosen",
		disabled: true
	},
	{
		name: "Allergy and immunology"
	},
	{
		name: "Anesthesiology"
	},
	{
		name: "Dermatology"
	},
	{
		name: "Diagnostic radiology"
	},
	{
		name: "Emergency medicine"
	},
	{
		name: "Family medicine"
	},
	{
		name: "Internal medicine"
	},
	{
		name: "Medical genetics"
	},
	{
		name: "Neurology"
	},
	{
		name: "Nuclear medicine"
	},
	{
		name: "Obstetrics and gynecology"
	},
	{
		name: "Ophthalmology"
	},
	{
		name: "Pathology"
	},
	{
		name: "Pediatrics"
	},
	{
		name: "Physical medicine and rehabilitation"
	},
	{
		name: "Preventive medicine"
	},
	{
		name: "Psychiatry"
	},
	{
		name: "Radiation oncology"
	},
	{
		name: "Surgery"
	},
	{
		name: "Urology"
	}
]

const educationList = [
	{
		name: "Not chosen",
		disabled: true
	},
	{
		name: "Highschool"
	},
	{
		name: "Bachelor's Degree"
	},
	{
		name: "Master's Degree"
	},
	{
		name: "Doctoral Degree"
	},
];

const Register = () => {
	const navigate = useNavigate();

	const [errorMessage, setErrorMessage] = useState('');

	const [isCustomer, setIsCustomer] = useState(true);
	const [isDoctor, setIsDoctor] = useState(false);
	const [isPhar, setIsPhar] = useState(false);

	const [hospitalList, setHospitalList] = useState([{name: "Not chosen", id: -1, disabled: true}]);
	const [pharList, setPharList] = useState([{name: "Not chosen", id: -1, disabled: true}]);

	const today = format(new Date(), "yyyy-MM-dd");

	const formik = useFormik({
		initialValues: {
			firstName: '',
			middleName: '',
			lastName: '',
			email: '',
			tckn: '',
			phone: '',
			password: '',
			pharmacy: pharList[0].name,
			typeSpecific: {
				height: '180',
				weight: '80',
				birthday: today,
				hospital_id: hospitalList[0].id,
				pharmacy_id: pharList[0].id,
				speciality: specialityList[0].name,
				education: educationList[0].name
			},
		},
		validationSchema: Yup.object({
			firstName: Yup.string().max(50).required('First name is required'),
			middleName: Yup.string().max(50),
			lastName: Yup.string().max(50).required('Last name is required'),
			email: Yup.string().email().max(50).required('Email is required'),
			tckn: Yup.number('TCKN should only consist of digits')
				.max(100000000000, 'TCKN cannot exceed 11 digits')
				.required('TCKN is required'),
			phone: Yup.string().max(17, 'Phone number cannot exeed 10 digits').required('Phone number is required'),
			password: Yup.string()
				.max(16, 'Password can be maximum 16 characters long')
				.required('Password is required'),
			pharmacy: Yup.string(),//.required('Name of pharmacy is required'),
			typeSpecific: Yup.object().shape({
				height: Yup
					.number(),
				weight: Yup
					.number(),
				birthday: Yup
					.date(""),
				hospital_id: Yup.string(),
				pharmacy_id: Yup.string(),
				specialityList: Yup.string(),
				education: Yup.string()
			})
		}),
		onSubmit: async (values) => {
			const newValues = {
				user_id: values.tckn,
				email: values.email,
				password: values.password,
				first_name:  values.firstName,
				middle_name: values.middleName ? values.middleName : "",
				surname: values.lastName,
				phone_number: values.phone,
				user_type: isPhar ? "pharmacist" : (isDoctor ? "doctor" : "patient"),
				type_specific: values.typeSpecific
			}
			console.log(newValues);
			await axios
				.post('/auth/signup', newValues)
				.then((res) => {
					if (res && res.data) {
						console.log(res.data);
						navigate('/login');
					}
				})
				.catch((err) => {
					if (err && err.response) {
						console.log("Error:", err.response.data);
						if (err.response.status === 401) {
							setErrorMessage('Invalid TCKN or password');
						} else if (err.response.status === 400) {
							setErrorMessage(err.response.data.msg);
						}
					} else {
						setErrorMessage('Connection error');
					}
				});
		},
	});

	useEffect(() => {
		const getHospitals = async () => {
			await axios.get('/hospital/')
				.then((res) => {
					if (res && res.data) {
						console.log(res.data)
						let arr = [{name: "Not chosen", id: -1}]
						for (let i = 0; i < res.data.length; i++) {
							arr.push(
								{
									name: res.data[i].name,
									id: res.data[i].hospital_id
								}
							);
						}
						setHospitalList(arr);
					}
				})
				.catch((err) => {
					if (err && err.response) {
						console.log(err.response)
					}
				})
		}
		const getPharmacies = async () => {
			await axios.get('/pharmacy/allPharmacies')
				.then((res) => {
					if (res && res.data) {
						console.log(res.data)
						let arr = [{name: "Not chosen", id: -1}]
						for (let i = 0; i < res.data.length; i++) {
							arr.push(
								{
									name: res.data[i].name,
									id: res.data[i].pharmacy_id
								}
							);
						}
						setPharList(arr);
					}
				})
				.catch((err) => {
					if (err && err.response) {
						console.log(err.response)
					}
				})
		}
		getHospitals();
		getPharmacies();
	}, [])

	return (
		<>
			<title>Register</title>
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
			<Box
				component="main"
				sx={{
					alignItems: 'center',
					display: 'flex',
					flexGrow: 1,
					minHeight: '100%',
				}}
			>
				<Container maxWidth="sm">
					<form onSubmit={formik.handleSubmit}>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								my: 3,
							}}
						>
							<Button
								variant="contained"
								color="primary"
								disabled={isCustomer}
								onClick={() => {
									setIsCustomer(true);
									setIsDoctor(false);
									setIsPhar(false);
								}}
							>
								Customer
							</Button>
							<Button
								variant="contained"
								color="primary"
								disabled={isDoctor}
								onClick={() => {
									setIsCustomer(false);
									setIsDoctor(true);
									setIsPhar(false);
								}}
							>
								Doctor
							</Button>
							<Button
								variant="contained"
								color="primary"
								disabled={isPhar}
								onClick={() => {
									setIsCustomer(false);
									setIsDoctor(false);
									setIsPhar(true);
								}}
							>
								Pharmacist
							</Button>
						</Box>
						<Box>
						{isCustomer && (
							<FormPatientRegister
								formik={formik}
							/>	
						)}
						{isDoctor && (
							<FormDoctorRegister
								formik={formik}
								hospitalList={hospitalList}
								specialityList={specialityList}
							/>
						)}
						{isPhar && (
							<FormPharmacistRegister
								formik={formik}
								pharList={pharList}
								educationList={educationList}
							/>
						)}
						</Box>
						<Box sx={{ py: 2 }}>
							<Button
								color="primary"
								disabled={formik.isSubmitting}
								fullWidth
								size="large"
								type="submit"
								variant="contained"
							>
								Register
							</Button>
						</Box>
						<Box sx={{ py: 1 }}>
							<Typography gutterBottom color="textSecondary" variant="body2">
								{' Already having an account? Click '}
								<Link href="/login">here</Link>
								{' to login.'}
							</Typography>
							<Link></Link>
						</Box>
					</form>
				</Container>
			</Box>
		</>
	);
};

export default Register;
