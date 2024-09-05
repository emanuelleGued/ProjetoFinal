import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.ENDPOINT,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Adicionar um interceptor de request para ver o URL completo
api.interceptors.request.use(request => {
    return request;
});

api.interceptors.response.use(
    response => response,
    error => {
        console.error('Erro na requisição:', error.message);
        return Promise.reject(error);
    }
);
