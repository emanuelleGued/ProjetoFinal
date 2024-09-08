import { handleResponse } from '../utils/response-builder.js';

export const handleSaudacaoIntent = async (event) => {
    let responseMessage = "";

    try {
        // Verifica se a intenção é 'Saudacao'
        if (event.sessionState?.intent?.name === 'Saudacao') {
            responseMessage = 'Olá, como podemos lhe ajudar?';
        } else {
            responseMessage = 'Desculpe, não entendi sua solicitação. Pode repetir, por favor?';
        }
        

        // Retorna a resposta final
        return handleResponse(event, 'Close', null, responseMessage);
    } catch (error) {
        // Retorna a resposta final em caso de erro no processamento
        return handleResponse(event, 'Fulfilled', null, 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.');
    }
};
