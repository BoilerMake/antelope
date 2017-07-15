import cookie from 'react-cookie';
import { API_BASE_URL } from '../config';


export default function apiFetch(endpoint, options = {}) {
    options.headers = {
        "Authorization": "Bearer "+cookie.load('token')
    };
    return fetch(`${API_BASE_URL}/${endpoint}`,options);
}