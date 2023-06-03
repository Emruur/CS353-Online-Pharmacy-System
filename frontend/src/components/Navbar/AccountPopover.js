import { Box, MenuItem, MenuList, Popover, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const AccountPopover = (props) => {
	const { anchorEl, onClose, open, ...other } = props;

	const navigate = useNavigate();

	const name =
		sessionStorage.getItem('firstName') +
		' ' +
		sessionStorage.getItem('lastName');
	const balance = sessionStorage.getItem('balance');

	const handleSignOut = async () => {
		sessionStorage.clear();
		navigate('/login');
	};

	return (
		<Popover
			anchorEl={anchorEl}
			anchorOrigin={{
				horizontal: 'left',
				vertical: 'bottom',
			}}
			onClose={onClose}
			open={open}
			PaperProps={{
				sx: { width: '300px' },
			}}
			{...other}
		>
			<Box
				sx={{
					py: 1.5,
					px: 2,
				}}
			>
				<Typography variant="overline">Account</Typography>
				<Typography color="text.secondary" variant="body2">
					{name}
				</Typography>
				<Typography color="text.secondary" variant="body2">
					{'Balance: ' + balance + ' TL'}
				</Typography>
			</Box>
			<MenuList
				disablePadding
				sx={{
					'& > *': {
						'&:first-of-type': {
							borderTopColor: 'divider',
							borderTopStyle: 'solid',
							borderTopWidth: '1px',
						},
						padding: '12px 16px',
					},
				}}
			>
				<MenuItem onClick={handleSignOut}>Sign out</MenuItem>
			</MenuList>
		</Popover>
	);
};

AccountPopover.propTypes = {
	anchorEl: PropTypes.any,
	onClose: PropTypes.func,
	open: PropTypes.bool.isRequired,
};
