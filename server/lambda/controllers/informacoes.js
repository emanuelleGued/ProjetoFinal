import { handleResponse } from '../utils/response-builder.js';

export const handleInformacoesIntent = async (event) => {
    let responseMessage = "";

    try {
        // Verifica se a intenção é 'Informacoes'
        if (event.sessionState?.intent?.name === 'Informacoes') {
            // Verifica se o slot 'atividades' foi preenchido
            const atividadesSlot = event.currentIntent?.slots?.atividades?.value?.originalValue?.toLowerCase().trim();

            if (atividadesSlot) {
                // Define uma resposta padrão para qualquer valor de slot
                responseMessage = 'Temos crochê, fisioterapia e atividade física.';
            } else {
                // Solicita ao usuário o tipo de atividade se o slot estiver vazio
                responseMessage = 'Qual atividade você gostaria de saber mais? Temos crochê, fisioterapia e atividade física.';
                return handleResponse(event, 'ElicitSlot', 'atividades', responseMessage);
            }
        } else {
            // Resposta para intenções não reconhecidas
            responseMessage = 'Desculpe, não entendi sua solicitação. Pode repetir, por favor?';
        }

        // Retorna a resposta final
        return handleResponse(event, 'Close', null, responseMessage);
    } catch (error) {
        // Retorna a resposta final em caso de erro no processamento
        return handleResponse(event, 'Fulfilled', null, 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.');
    }
};
