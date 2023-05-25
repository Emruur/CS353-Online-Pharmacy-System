import {
    Card,
    CardHeader,
    CardContent,
    InputAdornment,
    Divider,
    Grid,
    MenuItem,
	TextField,
} from '@mui/material';
import { useState } from 'react';
import { MuiTelInput } from 'mui-tel-input';
export const FormDoctorRegister = (props) => {

	const [phone, setPhone] = useState('');

	const handleChange = (newPhone) => {
		setPhone(newPhone);
		props.formik.values.phone = newPhone;
	}

    return(
        <>
            <Card>
                <CardHeader title="Personal Information" subheader="Required fields are indicated as *" />
                <Divider />
                <CardContent>
                    <Grid container justifyContent="center" direction="row" spacing={3}>
                        <Grid item md={6} xs={12}>
                            <TextField
                                error={Boolean(
                                    props.formik.touched.firstName && props.formik.errors.firstName
                                )}
                                helperText={
                                    props.formik.touched.firstName && props.formik.errors.firstName
                                }
                                fullWidth
                                label="First Name"
                                margin="normal"
                                name="firstName"
                                onBlur={props.formik.handleBlur}
                                onChange={props.formik.handleChange}
                                type="text"
                                value={props.formik.values.firstName}
                                variant="outlined"
                                required
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                error={Boolean(
                                    props.formik.touched.middleName && props.formik.errors.middleName
                                )}
                                helperText={
                                    props.formik.touched.middleName && props.formik.errors.middleName
                                }
                                fullWidth
                                label="Middle Name"
                                margin="normal"
                                name="middleName"
                                onBlur={props.formik.handleBlur}
                                onChange={props.formik.handleChange}
                                type="text"
                                value={props.formik.values.middleName}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                error={Boolean(
                                    props.formik.touched.lastName && props.formik.errors.lastName
                                )}
                                helperText={
                                    props.formik.touched.lastName && props.formik.errors.lastName
                                }
                                fullWidth
                                label="Last Name"
                                margin="normal"
                                name="lastName"
                                onBlur={props.formik.handleBlur}
                                onChange={props.formik.handleChange}
                                type="text"
                                value={props.formik.values.lastName}
                                variant="outlined"
                                required
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                label="Birthday"
                                margin="normal"
                                name="typeSpecific.birthday"
                                onBlur={props.formik.handleBlur}
                                onChange={props.formik.handleChange}
                                type="date"
                                value={props.formik.values.typeSpecific.birthday}
                                variant="outlined"
                                required
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <TextField
                                error={Boolean(
                                    props.formik.touched.hospital && props.formik.errors.hospital
                                )}
                                helperText={
                                    props.formik.touched.hospital && props.formik.errors.hospital
                                }
                                select
                                fullWidth
                                defaultValue={""}
                                label="Hospital"
                                margin="normal"
                                name="hospital"
                                onBlur={props.formik.handleBlur}
                                onChange={props.formik.handleChange}
                                type="text"
                                variant="outlined"
                                required
                                value={props.formik.values.hospital}
                            >
                                {props.hospitalList.map((hospital, index) => (
                                    <MenuItem key={index} value={hospital.name} disabled={hospital.disabled}>
                                        {hospital.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider/>
                <CardHeader title="Contact Information" subheader="Required fields are indicated as *" />
                <Divider/>
                <CardContent>
                    <Grid container justifyContent="center" direction="row" spacing={3}>
                        <Grid item md={6} xs={12}>
                            <TextField
                                error={Boolean(props.formik.touched.email && props.formik.errors.email)}
                                helperText={props.formik.touched.email && props.formik.errors.email}
                                fullWidth
                                label="Email"
                                margin="normal"
                                name="email"
                                onBlur={props.formik.handleBlur}
                                onChange={props.formik.handleChange}
                                type="text"
                                value={props.formik.values.email}
                                variant="outlined"
                                required
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>     
                            <TextField
                                error={Boolean(props.formik.touched.tckn && props.formik.errors.tckn)}
                                helperText={props.formik.touched.tckn && props.formik.errors.tckn}
                                fullWidth
                                label="TCKN"
                                margin="normal"
                                name="tckn"
                                onBlur={props.formik.handleBlur}
                                onChange={props.formik.handleChange}
                                type="text"
                                value={props.formik.values.tckn}
                                variant="outlined"
                                required
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <MuiTelInput
                                error={Boolean(props.formik.touched.phone && props.formik.errors.phone)}
                                helperText={props.formik.touched.phone && props.formik.errors.phone}
                                fullWidth
                                label="Phone Number"
                                margin="normal"
                                name="phone"
                                onBlur={props.formik.handleBlur}
                                onChange={handleChange}
                                value={phone}
                                variant="outlined"
                                required
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                error={Boolean(
                                    props.formik.touched.password && props.formik.errors.password
                                )}
                                helperText={
                                    props.formik.touched.password && props.formik.errors.password
                                }
                                fullWidth
                                label="Password"
                                margin="normal"
                                name="password"
                                onBlur={props.formik.handleBlur}
                                onChange={props.formik.handleChange}
                                type="password"
                                value={props.formik.values.password}
                                variant="outlined"
                                required
                            /> 
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider/>
                <CardHeader title="Pyhsical Information" subheader="Required fields are indicated as *" />
                <Divider/>
                <CardContent>
                    <Grid container justifyContent="center" direction="row" spacing={3}>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                label="Height"
                                margin="normal"
                                name="typeSpecific.height"
                                onBlur={props.formik.handleBlur}
                                onChange={props.formik.handleChange}
                                type="number"
                                value={props.formik.values.typeSpecific.height}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">cm</InputAdornment>,
                                }}
                                required
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>     
                            <TextField
                                fullWidth
                                label="Weight"
                                margin="normal"
                                name="typeSpecific.weight"
                                onBlur={props.formik.handleBlur}
                                onChange={props.formik.handleChange}
                                type="number"
                                value={props.formik.values.typeSpecific.weight}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">kg</InputAdornment>,
                                }}
                                required
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}