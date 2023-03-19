import { Box, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';
import { NavItem } from './NavItem';

export const Sidebar = (props) => {
	const { open, onClose, routes } = props;
	const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
		defaultMatches: true,
		noSsr: false,
	});

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
					<Typography sx={{ m: 1 }} variant="h4">
						Sidebar Title
					</Typography>
				</Box>
			</div>
			<Divider
				sx={{
					borderColor: '#2D3748',
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
			<Divider sx={{ borderColor: '#2D3748' }} />
		</Box>
	);
	if (lgUp) {
		return (
			<Drawer
				anchor="left"
				open
				PaperProps={{
					sx: {
						backgroundColor: 'neutral.900',
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
					backgroundColor: 'neutral.900',
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
