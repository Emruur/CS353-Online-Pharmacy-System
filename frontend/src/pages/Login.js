import {
	Alert,
	AlertTitle,
	Box,
	Button,
	Container,
	Link,
	TextField,
	Typography,
} from '@mui/material';
import axios from "../axios/index";
import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode"
import * as Yup from 'yup';

const Login = () => {
	const navigate = useNavigate();

	const [errorMessage, setErrorMessage] = useState('');

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validationSchema: Yup.object({
			email: Yup.string()
				.email('Invalid email')
				.max(255, 'Email cannot exceed 255 chars')
				.required('Email is required'),
			password: Yup.string()
				.max(16, 'Password can be maximum 16 characters long')
				.required('Password is required'),
		}),
		onSubmit: async (values) => {
			await axios
				.post('/auth/login', values)
				.then((res) => {
					if (res && res.data) {
						var token = res.data.access_token
						var decode = jwt_decode(token);
						console.log(decode);
						sessionStorage.setItem("token", token);
						sessionStorage.setItem("firstName", decode.first_name);
						sessionStorage.setItem("lastName", decode.last_name);
						navigate('/dashboard');
					}
				})
				.catch((err) => {
					if (err && err.response) {
						if (err.response.status === 401) {
							setErrorMessage('err.response.data.msg');
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
			<title>Login</title>
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
						<Box sx={{ my: 3 }}>
							<Typography color="textPrimary" variant="h4">
								Login
							</Typography>
							<Typography gutterBottom color="textSecondary" variant="body2">
								Sign in to your account
							</Typography>
						</Box>
						<Box>
							<TextField
								error={Boolean(formik.touched.email && formik.errors.email)}
								fullWidth
								helperText={formik.touched.email && formik.errors.email}
								label="Email"
								margin="normal"
								name="email"
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								type="text"
								value={formik.values.email}
								variant="outlined"
							/>
							<TextField
								error={Boolean(
									formik.touched.password && formik.errors.password
								)}
								fullWidth
								helperText={formik.touched.password && formik.errors.password}
								label="Password"
								margin="normal"
								name="password"
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								type="password"
								value={formik.values.password}
								variant="outlined"
							/>
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
								Sign In Now
							</Button>
						</Box>
						<Box sx={{ py: 1 }}>
							<Typography gutterBottom color="textSecondary" variant="body2">
								{" Don't you have an account? Click "}
								<Link href="/register">here</Link>
								{' to sign register.'}
							</Typography>
							<Link></Link>
						</Box>
					</form>
				</Container>
			</Box>
		</>
	);
};

export default Login;
