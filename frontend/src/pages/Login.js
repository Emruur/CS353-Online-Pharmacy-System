import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {Alert, AlertTitle, Box, Button, Container, TextField, Typography} from '@mui/material';
import axios from "axios";

const Login = () => {
	const navigate = useNavigate();

	const [errorMessage, setErrorMessage] = useState("")

	const formik = useFormik({
		initialValues: {
			tckn: "",
			password: ""
		},
		validationSchema: Yup.object({
			tckn: Yup
				.number("TCKN should only consist of digits")
				.max(100000000000, "TCKN cannot exceed 11 digits")
				.required("TCKN is required"),
			password: Yup
				.string()
				.max(16, "Password can be maximum 16 characters long")
				.required("Password is required")
		}),
		onSubmit: async (values) => {
			await axios.post("/auth/login", values)
				.then((res) => {
					if (res && res.data) {
						console.log(res.data)
						navigate("/dashboard")
					}
				})
				.catch((err) => {
					if (err && err.response) {
						if (err.response.status === 401) {
							setErrorMessage("Invalid TCKN or password")
						} else {
							setErrorMessage("Invalid request")
						}
					} else {
						setErrorMessage("Connection error")
					}
				})
		}
	})

	return(
		<>
			<title>Login</title>
			<Box
				component="main"
				sx={{
					alignItems: "center",
					display: "flex",
					flexGrow: 1,
					minHeight: "100%"
				}}
			>
				<Container maxWidth="sm">
					<form onSubmit={formik.handleSubmit}> 
						<Box sx={{ my: 3 }}>
							<Typography
								color="textPrimary"
								variant='h4'
							>
								Login
							</Typography>
							<Typography
								gutterBottom
								color="textSecondary"
								variant='body2'
							>
								Sign in to your account
							</Typography>
						</Box>
						<Box>
							<TextField
								error={Boolean(formik.touched.tckn && formik.errors.tckn)}
								fullWidth
								helperText={formik.touched.tckn && formik.errors.tckn}
								label="TCKN"
								margin="normal"
								name="tckn"
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								type="text"
								value={formik.values.tckn}
								variant="outlined"
							/>
							<TextField
								error={Boolean(formik.touched.password && formik.errors.password)}
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
						{errorMessage.trim().length !== 0 &&
							<Alert
								severity="error"
								onClose={() => {
									setErrorMessage("")
								}}>
								<AlertTitle>Error</AlertTitle>
								{errorMessage}
							</Alert>
						}
					</form>
				</Container>	
			</Box>
		</>
	);
};

export default Login;
