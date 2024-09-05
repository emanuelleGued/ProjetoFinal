import { handleResponse } from '../utils/response-builder.js';

export const handleFallbackIntent = async (event) => {
    return handleResponse(event, 'Close', null, 'Desculpe, não entendi sua solicitação. Pode repetir, por favor?');
};