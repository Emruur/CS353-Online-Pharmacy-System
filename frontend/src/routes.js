// Patient
import PatientDashboard from 'pages/Patient/PatientDashboard';

// Doctor
import DoctorDashboard from 'pages/Doctor/DoctorDashboard';

// Pharmacist
import PharmacistDashboard from 'pages/Pharmacist/PharmacistDashboard';

import Medicine from 'pages/Medicine/Medicine';
import Payment from 'pages/Payment/Payment';
import Cart from 'pages/ShoppingCart/Cart';
import Prescription from 'pages/Prescription/Prescription';
import Purchase from 'pages/PreviousPurchase/Purchase';

const role = sessionStorage.getItem("role");

const routes = [
	{
		type: 'collapse',
		name: 'Dashboard',
		key: role==="pharmacist" ? 'pharmacist_dashboard' : (role==="doctor" ? 'doctor_dashboard' : 'patient_dashboard'),
		route: role==="pharmacist" ? '/pharmacist-dashboard' : (role==="doctor" ? '/doctor-dashboard' : '/patient-dashboard'),
		label: role==="pharmacist" ? 'PharmacistDashboard' : (role==="doctor" ? 'DoctorDashboard' : 'PatientDashboard'),
		component: role==="pharmacist" ? <PharmacistDashboard/> : (role==="doctor" ? <DoctorDashboard/> : <PatientDashboard/>),
	},
	{
		type: 'collapse',
		name: 'Payment',
		key: 'payment',
		route: '/payment',
		label: 'Payment',
		component: <Payment />,
	},
	{
		type: 'collapse',
		name: 'Medication',
		key: 'medication',
		route: '/medication',
		label: 'Medication',
		component: <Medicine />,
	},
	{
		type: 'collapse',
		name: 'Shopping Cart',
		key: 'cart',
		route: '/cart',
		label: 'Shopping Cart',
		component: <Cart />,
	},
	{
		type: 'collapse',
		name: 'Prescription',
		key: 'prescription',
		route: '/prescription',
		label: 'Prescription',
		component: <Prescription />,
	},
	{
		type: 'collapse',
		name: 'Purchase',
		key: 'purchase',
		route: '/purchase',
		label: 'Purchase',
		component: <Purchase />,
	},
];

export default routes;
