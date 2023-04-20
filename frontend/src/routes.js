import Dashboard from './pages/Dashboard';
import Medicine from './pages/Medicine/Medicine';
import Payment from './pages/Payment/Payment';
import Cart from './pages/ShoppingCart/Cart';
import Prescription from './pages/Prescription/Prescription';
import Purchase from './pages/PreviousPurchase/Purchase';

const routes = [
	{
		type: 'collapse',
		name: 'Dashboard',
		key: 'dashboard',
		route: '/dashboard',
		label: 'Dashboard',
		component: <Dashboard />,
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
		label: 'Prescription',
		component: <Purchase />,
	},
];

export default routes;
