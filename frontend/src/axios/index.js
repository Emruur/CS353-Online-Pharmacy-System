import axios from 'axios';

export default axios.create({
	baseURL: 'http://192.168.x.x:8001',
});
