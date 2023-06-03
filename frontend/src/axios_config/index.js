import axios from 'axios';

export default axios.create({
	baseURL: 'http://127.0.0.1:5000',
	//baseURL: 'http://139.179.226.99:5000'
});
