import axios from 'axios';

const camundaApi = axios.create({
    baseURL: 'http://localhost:8080/engine-rest/',
    headers: { 
        "Content-Type": "text/plain"
    }
});

export default camundaApi;