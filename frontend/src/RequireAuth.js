import { Alert, AlertTitle } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { Navbar } from './components/Navbar/Navbar';
import { Sidebar } from './components/Sidebar/Sidebar';
import routes from './routes';

const PageLayoutRoot = styled('div')(({ theme }) => ({
	display: 'flex',
	flex: '1 1 auto',
	maxWidth: '100%',
	paddingTop: 64,
}));

const RequireAuth = ({ children }) => {
	const [isSidebarOpen, setSidebarOpen] = useState(true);
	let token = sessionStorage.getItem('token');
	const [errorMessage, setErrorMessage] = useState('You need to login first!');

	if (!token) {
		return (
			<>
				{errorMessage && (
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
			</>
		);
	}
	return (
		<>
			<PageLayoutRoot>
				{children}
				<Navbar onSidebarOpen={() => setSidebarOpen(true)} />
				<Sidebar
					routes={routes}
					open={isSidebarOpen}
					onClose={() => setSidebarOpen(false)}
				/>
			</PageLayoutRoot>
		</>
	);
};

export default RequireAuth;
