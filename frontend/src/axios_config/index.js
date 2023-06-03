import axios from 'axios';

export default axios.create({
	baseURL: 'http://127.0.0.1:5000',
	//baseURL: 'http://139.179.233.78:5000'
});
