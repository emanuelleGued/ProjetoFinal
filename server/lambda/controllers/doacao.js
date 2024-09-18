import { handleResponse } from '../utils/response-builder.js';

export const handleDoacaoIntent = async (event) => {
    return handleResponse(event, 'Fulfilled', null, 'Ok, esta é a chave pix para tranferência: pix@gmail.com. Por favor, envie o comprovante após a tranferência para que seja possível registrar sua doação.');
};
