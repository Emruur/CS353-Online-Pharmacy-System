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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPatientRegister } from 'components/RegisterForms/form-patient-register';
import { FormDoctorRegister } from 'components/RegisterForms/form-doctor-register';
import { FormPharmacistRegister } from 'components/RegisterForms/form-pharmacist-register';
import { format } from 'date-fns';
import * as Yup from 'yup';

const hospitalList = [
	{
		name: "Not chosen",
		disabled: true
	},
	{
		name: 'Ankara Şehir Hastanesi',
		location: 'Çankaya',
	},
	{
		name: 'Ankara Etlik Şehir Hastanesi',
		location: 'Keçiören',
	},
	{
		name: 'Gülhane Eğitim ve Araştırma Hastanesi',
		location: 'Keçiören',
	},
	{
		name: 'Beytepe Murat Erdi Eker Devlet Hastanesi',
		location: 'Çankaya',
	},
	{
		name: 'Haymana Devlet Hastanesi',
		location: 'Haymana',
	},
	{
		name: 'Ankara Atatürk Sanatoryum Eğitim ve Araştırma Hastanesi',
		location: 'Keçiören',
	},
	{
		name: 'Gazi Üniversitesi Tıp Fakültesi Gazi Hastanesi',
		location: 'Yenimahalle',
	},
	{
		name: 'Hacettepe Üniversitesi İhsan Doğramacı Çocuk Hastanesi',
		location: 'Çankaya',
	},
];

const pharList = [
	{
		name: "Not chosen",
		disabled: true
	},
	{
		name: 'Beyazıt Eczanesi',
		location: 'Akyurt',
	},
	{
		name: 'Nur Eczanesi',
		location: 'Akyurt',
	},
	{
		name: 'Hayat Eczanesi',
		location: 'Akyurt',
	},
	{
		name: 'Bahar Eczanesi',
		location: 'Altındağ ',
	},
	{
		name: 'Kaçkar Eczanesi',
		location: 'Akyurt',
	},
	{
		name: 'Nimet Eczanesi',
		location: 'Keçiören ',
	},
	{
		name: 'Birsen Eczanesi',
		location: 'Keçiören',
	},
	{
		name: 'Hazar Eczanesi',
		location: 'Sincan',
	},
];

const Register = () => {
	const navigate = useNavigate();

	const [errorMessage, setErrorMessage] = useState('');

	const [isCustomer, setIsCustomer] = useState(true);
	const [isDoctor, setIsDoctor] = useState(false);
	const [isPhar, setIsPhar] = useState(false);

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
			hospital: hospitalList[0].name,
			pharmacy: pharList[0].name,
			typeSpecific: {
				height: '180',
				weight: '80',
				birthday: today,
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
			hospital: Yup.string(),//.required('Name of hospital required'),
			pharmacy: Yup.string(),//.required('Name of pharmacy is required'),
			typeSpecific: Yup.object().shape({
				height: Yup
					.number(),
				weight: Yup
					.number(),
				birthday: Yup
					.date("Must consist of numbers")
					.required("Birthday is required")
			}).required()
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
						if (err.response.status === 401) {
							setErrorMessage('Invalid TCKN or password');
						} else {
							setErrorMessage('Invalid request');
						}
					} else {
						setErrorMessage('Connection error');
					}
				});
		},
	});

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
							/>
						)}
						{isPhar && (
							<FormPharmacistRegister
								formik={formik}
								pharList={pharList}
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
