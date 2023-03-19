import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, Button, Collapse, List, ListItem } from '@mui/material';
import PropTypes from 'prop-types';
import { React, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const NavItem = (props) => {
	const location = useLocation();
	const navigate = useNavigate();
	const { href, icon, title, sideItems, ...others } = props;
	const active = href ? location.pathname === href : false;
	const [open, setOpen] = useState(false);
	const [disp, setDisp] = useState('none');
	const [link, setLink] = useState('');

	const handleCollapse = () => {
		if (disp === 'none') {
			setDisp('flex');
			setOpen(!open);
		} else {
			setOpen(!open);
			setDisp('none');
		}
	};

	const goLink = () => {
		navigate(href);
	};

	const goLinkSide = () => {
		navigate(link);
	};

	if (sideItems != null) {
		return (
			<ListItem
				disableGutters
				sx={{
					display: 'flex',
					mb: 0.5,
					py: 0,
					px: 1,
				}}
				{...others}
			>
				<List>
					<ListItem
						disableGutters
						sx={{
							width: '100%',
							displax: 'flex',
							py: 0,
						}}
					>
						<Button
							href={href}
							component="a"
							startIcon={icon}
							disableRipple
							onClick={() => goLink}
							sx={{
								backgroundColor: active && 'rgba(255,255,255, 0.08)',
								borderRadius: 1,
								color: active ? 'secondary.main' : 'neutral.300',
								fontWeight: active && 'fontWeightBold',
								justifyContent: 'flex-start',
								px: 3,
								textAlign: 'left',
								textTransform: 'none',
								'& .MuiButton-startIcon': {
									color: active ? 'secondary.main' : 'neutral.400',
								},
								'&:hover': {
									backgroundColor: 'rgba(255,255,255, 0.08)',
								},
							}}
						>
							<Box sx={{ flexGrow: 1 }}>{title}</Box>
						</Button>
						<Button
							disableRipple
							onClick={handleCollapse}
							sx={{
								backgroundColor: active && 'rgba(255,255,255, 0.08)',
								borderRadius: 1,
								color: active ? 'secondary.main' : 'neutral.300',
								fontWeight: active && 'fontWeightBold',
								justifyContent: 'center',
								height: '100%',
								ml: 1.5,
								textAlign: 'left',
								textTransform: 'none',
								'& .MuiButton-startIcon': {
									color: active ? 'secondary.main' : 'neutral.400',
								},
								'&:hover': {
									backgroundColor: 'rgba(255,255,255, 0.08)',
								},
							}}
						>
							{open ? (
								<ExpandLess fontSize="small" />
							) : (
								<ExpandMore fontSize="small" />
							)}
						</Button>
					</ListItem>
					<ListItem
						disableGutters
						sx={{
							width: 278,
							displax: disp,
							py: 0,
						}}
					>
						<Collapse in={open} timeout="auto" unmountOnExit>
							<List>
								<ListItem
									sx={{
										py: 0,
										width: '100%',
										display: 'flex',
									}}
								>
									<Button
										href={sideItems[0].href}
										component="a"
										startIcon={sideItems[0].icon}
										disableRipple
										onClick={() => {
											setLink(sideItems[0].href);
											goLinkSide();
										}}
										sx={{
											backgroundColor:
												location.pathname === sideItems[0].href &&
												'rgba(255,255,255, 0.08)',
											borderRadius: 1,
											color:
												location.pathname === sideItems[0].href
													? 'secondary.main'
													: 'neutral.300',
											fontWeight:
												location.pathname === sideItems[0].href &&
												'fontWeightBold',
											justifyContent: 'flex-start',
											px: 3,
											textAlign: 'left',
											textTransform: 'none',
											'& .MuiButton-startIcon': {
												color:
													location.pathname === sideItems[0].href
														? 'secondary.main'
														: 'neutral.400',
											},
											'&:hover': {
												backgroundColor: 'rgba(255,255,255, 0.08)',
											},
										}}
									>
										{sideItems[0].title}
									</Button>
								</ListItem>
								<ListItem
									sx={{
										py: 0,
										width: '100%',
										display: 'flex',
									}}
								>
									<Button
										href={sideItems[1].href}
										component="a"
										startIcon={sideItems[1].icon}
										disableRipple
										onClick={() => {
											setLink(sideItems[1].href);
											goLinkSide();
										}}
										sx={{
											backgroundColor:
												location.pathname === sideItems[1].href &&
												'rgba(255,255,255, 0.08)',
											borderRadius: 1,
											color:
												location.pathname === sideItems[1].href
													? 'secondary.main'
													: 'neutral.300',
											fontWeight:
												location.pathname === sideItems[1].href &&
												'fontWeightBold',
											justifyContent: 'flex-start',
											px: 3,
											textAlign: 'left',
											textTransform: 'none',
											'& .MuiButton-startIcon': {
												color:
													location.pathname === sideItems[1].href
														? 'secondary.main'
														: 'neutral.400',
											},
											'&:hover': {
												backgroundColor: 'rgba(255,255,255, 0.08)',
											},
										}}
									>
										{sideItems[1].title}
									</Button>
								</ListItem>
								<ListItem
									sx={{
										py: 0,
										width: '100%',
										display: 'flex',
									}}
								>
									<Button
										href={sideItems[2].href}
										component="a"
										startIcon={sideItems[2].icon}
										disableRipple
										onClick={() => {
											setLink(sideItems[2].href);
											goLinkSide();
										}}
										sx={{
											backgroundColor:
												location.pathname === sideItems[2].href &&
												'rgba(255,255,255, 0.08)',
											borderRadius: 1,
											color:
												location.pathname === sideItems[2].href
													? 'secondary.main'
													: 'neutral.300',
											fontWeight:
												location.pathname === sideItems[2].href &&
												'fontWeightBold',
											justifyContent: 'flex-start',
											px: 3,
											textAlign: 'left',
											textTransform: 'none',
											'& .MuiButton-startIcon': {
												color:
													location.pathname === sideItems[2].href
														? 'secondary.main'
														: 'neutral.400',
											},
											'&:hover': {
												backgroundColor: 'rgba(255,255,255, 0.08)',
											},
										}}
									>
										{sideItems[2].title}
									</Button>
								</ListItem>
								<ListItem
									sx={{
										py: 0,
										width: '100%',
										display: 'flex',
									}}
								>
									<Button
										href={sideItems[3].href}
										component="a"
										startIcon={sideItems[3].icon}
										disableRipple
										onClick={() => {
											setLink(sideItems[3].href);
											goLinkSide();
										}}
										sx={{
											backgroundColor:
												location.pathname === sideItems[3].href &&
												'rgba(255,255,255, 0.08)',
											borderRadius: 1,
											color:
												location.pathname === sideItems[3].href
													? 'secondary.main'
													: 'neutral.300',
											fontWeight:
												location.pathname === sideItems[3].href &&
												'fontWeightBold',
											justifyContent: 'flex-start',
											px: 3,
											textAlign: 'left',
											textTransform: 'none',
											'& .MuiButton-startIcon': {
												color:
													location.pathname === sideItems[3].href
														? 'secondary.main'
														: 'neutral.400',
											},
											'&:hover': {
												backgroundColor: 'rgba(255,255,255, 0.08)',
											},
										}}
									>
										{sideItems[3].title}
									</Button>
								</ListItem>
								<ListItem
									sx={{
										py: 0,
										width: '100%',
										display: 'flex',
									}}
								>
									<Button
										href={sideItems[4].href}
										component="a"
										startIcon={sideItems[4].icon}
										disableRipple
										onClick={() => {
											setLink(sideItems[4].href);
											goLinkSide();
										}}
										sx={{
											backgroundColor:
												location.pathname === sideItems[4].href &&
												'rgba(255,255,255, 0.08)',
											borderRadius: 1,
											color:
												location.pathname === sideItems[4].href
													? 'secondary.main'
													: 'neutral.300',
											fontWeight:
												location.pathname === sideItems[4].href &&
												'fontWeightBold',
											justifyContent: 'flex-start',
											px: 3,
											textAlign: 'left',
											textTransform: 'none',
											'& .MuiButton-startIcon': {
												color:
													location.pathname === sideItems[4].href
														? 'secondary.main'
														: 'neutral.400',
											},
											'&:hover': {
												backgroundColor: 'rgba(255,255,255, 0.08)',
											},
										}}
									>
										{sideItems[4].title}
									</Button>
								</ListItem>
								<ListItem
									sx={{
										py: 0,
										width: '100%',
										display: 'flex',
									}}
								>
									<Button
										href={sideItems[5].href}
										component="a"
										startIcon={sideItems[5].icon}
										disableRipple
										onClick={() => {
											setLink(sideItems[5].href);
											goLinkSide();
										}}
										sx={{
											backgroundColor:
												location.pathname === sideItems[5].href &&
												'rgba(255,255,255, 0.08)',
											borderRadius: 1,
											color:
												location.pathname === sideItems[5].href
													? 'secondary.main'
													: 'neutral.300',
											fontWeight:
												location.pathname === sideItems[5].href &&
												'fontWeightBold',
											justifyContent: 'flex-start',
											px: 3,
											textAlign: 'left',
											textTransform: 'none',
											'& .MuiButton-startIcon': {
												color:
													location.pathname === sideItems[5].href
														? 'secondary.main'
														: 'neutral.400',
											},
											'&:hover': {
												backgroundColor: 'rgba(255,255,255, 0.08)',
											},
										}}
									>
										{sideItems[5].title}
									</Button>
								</ListItem>
							</List>
						</Collapse>
					</ListItem>
				</List>
			</ListItem>
		);
	}

	return (
		<ListItem
			disableGutters
			sx={{
				display: 'flex',
				mb: 0.5,
				py: 0,
				px: 1,
			}}
			{...others}
		>
			<Button
				href={href}
				component="a"
				startIcon={icon}
				disableRipple
				onClick={() => goLink}
				sx={{
					backgroundColor: active && 'rgba(255,255,255, 0.08)',
					borderRadius: 1,
					color: active ? 'secondary.main' : 'neutral.300',
					fontWeight: active && 'fontWeightBold',
					justifyContent: 'flex-start',
					px: 3,
					textAlign: 'left',
					textTransform: 'none',
					width: '100%',
					'& .MuiButton-startIcon': {
						color: active ? 'secondary.main' : 'neutral.400',
					},
					'&:hover': {
						backgroundColor: 'rgba(255,255,255, 0.08)',
					},
				}}
			>
				<Box sx={{ flexGrow: 1 }}>{title}</Box>
			</Button>
		</ListItem>
	);
};

NavItem.propTypes = {
	href: PropTypes.string,
	icon: PropTypes.node,
	title: PropTypes.string,
};
