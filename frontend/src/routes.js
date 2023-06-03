// Patient
import PatientDashboard from 'pages/Patient/PatientDashboard';
import Prescription from 'pages/Patient/Prescription/Prescription';

// Doctor
import DoctorDashboard from 'pages/Doctor/DoctorDashboard';
import CreatePrescription from 'pages/Doctor/Prescription/CreatePrescription';

// Pharmacist
import PharmacistDashboard from 'pages/Pharmacist/PharmacistDashboard';

import Medicine from 'pages/Patient/Medicine/Medicine';
import Payment from 'pages/Patient/Payment/Payment';
import Cart from 'pages/Patient/ShoppingCart/Cart';
import Purchase from 'pages/PreviousPurchase/Purchase';
import { PharmacistStock } from 'pages/Pharmacist/PharmacistStock';

const routes = [
	{
		type: 'collapse',
		name: 'Patient Dashboard',
		key: 'patient_dashboard',
		route: '/patient-dashboard',
		label: 'Patient Dashboard',
		user: "patient",
		component: <PatientDashboard/>,
	},
	{
		type: 'collapse',
		name: 'Doctor Dashboard',
		key: 'doctor_dashboard',
		route: '/doctor-dashboard',
		label: 'Doctor Dashboard',
		user: "doctor",
		component: <DoctorDashboard/>,
	},
	{
		type: 'collapse',
		name: 'Pharmacist Dashboard',
		key: 'pharmacist_dashboard',
		route: '/pharmacist-dashboard',
		label: 'Pharmacist Dashboard',
		user: "pharmacist",
		component: <PharmacistDashboard/>,
	},
	{
		type: 'collapse',
		name: 'Pharmacy Stock',
		key: 'stock',
		route: '/pharmacystock',
		label: 'Pharmacystock',
		component: <PharmacistStock />,
	},
	{
		type: 'collapse',
		name: 'Order Medicine',
		key: 'medication',
		route: '/medication',
		label: 'Medication',
		user: "patient",
		component: <Medicine />,
	},
	{
		type: 'collapse',
		name: 'Payment',
		key: 'payment',
		route: '/payment',
		label: 'Payment',
		user: "patient",
		component: <Payment />,
	},
	{
		type: 'collapse',
		name: 'Shopping Cart',
		key: 'cart',
		route: '/cart',
		label: 'Shopping Cart',
		user: "patient",
		component: <Cart />,
	},
	{
		type: 'collapse',
		name: 'Prescription',
		key: 'prescription',
		route: '/prescription',
		label: 'Prescription',
		user: "patient",
		component: <Prescription />,
	},
	{
		type: 'collapse',
		name: 'Purchase',
		key: 'purchase',
		route: '/purchase',
		label: 'Purchase',
		user: "patient",
		component: <Purchase />,
	},
	{
		type: 'collapse',
		name: 'Create Prescription',
		key: 'create_prescription',
		route: '/create-prescription',
		label: 'Create Prescription',
		user: "doctor",
		component: <CreatePrescription/>,
	},
];

export default routes;
