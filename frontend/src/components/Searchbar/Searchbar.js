import { Autocomplete, TextField, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '../../routes';

const SearchBar = (props) => {
	const [options, setOptions] = useState(routes);

	const navigate = useNavigate();
	return (
		<Tooltip title="Search">
			<Autocomplete
				disablePortal
				id="search-bar"
				options={options}
				sx={{ width: 300 }}
				onChange={(event, value) => {
					navigate(value['route']);
				}}
				renderInput={(params) => <TextField {...params} label="Search" />}
			/>
		</Tooltip>
	);
};
export default SearchBar;
