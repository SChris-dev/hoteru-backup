import axios from 'axios';

const token = localStorage.getItem('hoteru_login_token');

const Api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
})

export default Api;