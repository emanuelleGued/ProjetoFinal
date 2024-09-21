import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


export const api = axios.create({
    baseURL: process.env.ENDPOINT,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

console.log('URL:', api.defaults.baseURL);

// Adicionar um interceptor de request para ver o URL completo
api.interceptors.request.use(request => {
    console.log('Request URL:', request.url);
    return request;
});

api.interceptors.response.use(
    response => response,
    error => {
        console.error('Erro na requisição:', error.message);
        return Promise.reject(error);
    }
);
