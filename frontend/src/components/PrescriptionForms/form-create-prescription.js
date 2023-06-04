import {
    Card,
    CardHeader,
    CardContent,
    MenuItem,
    Divider,
    Grid,
	TextField,
} from '@mui/material';
import { MedicineList } from 'pages/Doctor/Prescription/MedicineList';

export const FormCreatePrescription = (props) => {

    const {medicines, medicineList} = props

    return(
        <>
            <Card>
                <CardHeader title="Prescription Details" subheader="Required fields are indicated as *" />
                <Divider />
                <CardContent>
                    <Grid container justifyContent="center" direction="row" spacing={3}>
                        <Grid item md={6} xs={12}>
                            <TextField
                                error={Boolean(
                                    props.formik.touched.prescribed_to && props.formik.errors.prescribed_to
                                )}
                                helperText={
                                    props.formik.touched.prescribed_to && props.formik.errors.prescribed_to
                                }
                                fullWidth
                                label="Patient TCKN"
                                margin="normal"
                                name="prescribed_to"
                                onBlur={props.formik.handleBlur}
                                onChange={props.formik.handleChange}
                                type="text"
                                value={props.formik.values.prescribed_to}
                                variant="outlined"
                                required
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                select
                                error={Boolean(
                                    props.formik.touched.type && props.formik.errors.type
                                )}
                                helperText={
                                    props.formik.touched.type && props.formik.errors.type
                                }
                                fullWidth
                                label="Prescription Type"
                                margin="normal"
                                name="type"
                                onBlur={props.formik.handleBlur}
                                onChange={props.formik.handleChange}
                                type="text"
                                value={props.formik.values.type}
                                variant="outlined"
                                required
                            >
                                {props.pres_type.map((type, index) => (
                                    <MenuItem key={index} value={type.value}>
                                        {type.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                error={Boolean(
                                    props.formik.touched.notes && props.formik.errors.notes
                                )}
                                helperText={
                                    props.formik.touched.notes && props.formik.errors.notes
                                }
                                fullWidth
                                label="Prescription Notes"
                                margin="normal"
                                name="notes"
                                onBlur={props.formik.handleBlur}
                                onChange={props.formik.handleChange}
                                type="text"
                                value={props.formik.values.notes}
                                variant="outlined"
                                required
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider/>
                <CardHeader title="Medicine" />
                <Divider/>
                <CardContent>
                    <Grid container justifyContent="center" direction="row" spacing={3}>
                        <Grid item md={6} xs={12}>
                                <MedicineList 
							        medicines={medicineList}
                                    prescribe={props.prescribe}
                                />
                        </Grid>
                        <Grid item md={6} xs={12}>
                                <MedicineList 
                                    prescribedMedicines={medicines}
                                    unprescribe={props.unprescribe}
                                />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}