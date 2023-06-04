import axios from 'axios';

export default axios.create({
	baseURL: 'http://127.0.0.1:5000',
	/*baseURL: 'http://139.179.226.99:5000'
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type'
	}*/
});
