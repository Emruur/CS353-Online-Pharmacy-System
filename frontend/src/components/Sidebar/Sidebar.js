import { Box, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';
import { NavItem } from './NavItem';

export const Sidebar = (props) => {
	const { open, onClose, routes } = props;
	const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
		defaultMatches: true,
		noSsr: false,
	});

	const role = sessionStorage.getItem("role");

	const content = (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
			}}
		>
			<div>
				<Box sx={{ px: 2 }}>
					<Typography sx={{ m: 2 }} variant="h4">
						Online Pharmacy
					</Typography>
					<Typography sx={{ m: 2 }} variant="b1">
						{role==="pharmacist" ? 'Pharmacist' : (role==="doctor" ? 'Doctor' : 'Patient')}
					</Typography>
				</Box>
			</div>
			<Divider
				sx={{
					borderColor: '#088395',
					my: 3,
				}}
			/>
			<Box sx={{ flexGrow: 1 }}>
				{routes.map((item) => (
					<NavItem
						key={item.key}
						icon={item.icon}
						href={item.route}
						title={item.name}
					/>
				))}
			</Box>
		</Box>
	);
	if (lgUp) {
		return (
			<Drawer
				anchor="left"
				open
				PaperProps={{
					sx: {
						backgroundColor: '#0A4D68',
						color: '#FFFFFF',
						width: 280,
					},
				}}
				variant="permanent"
			>
				{content}
			</Drawer>
		);
	}
	return (
		<Drawer
			anchor="left"
			onClose={onClose}
			open={open}
			PaperProps={{
				sx: {
					backgroundColor: '#0A4D68',
					color: '#FFFFFF',
					width: 280,
				},
			}}
			sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
			variant="temporary"
		>
			{content}
		</Drawer>
	);
};

Sidebar.propTypes = {
	onClose: PropTypes.func,
	open: PropTypes.bool,
	routes: PropTypes.array,
};
