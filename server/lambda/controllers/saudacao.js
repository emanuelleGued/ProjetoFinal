import { handleResponse } from '../utils/response-builder.js';
import { generateTTS } from '../utils/generate-tts.js'; // Importando a função TTS

export const handleSaudacaoIntent = async (event) => {
    let responseMessage = "";

    try {
        // Verifica se a intenção é 'Saudacao'
        if (event.sessionState?.intent?.name === 'Saudacao') {
            responseMessage = 'Olá, como podemos lhe ajudar?';
        } else {
            responseMessage = 'Desculpe, não entendi sua solicitação. Pode repetir, por favor?';
        }

        // Tenta gerar o áudio da resposta
        try {
            const audioUrl = await generateTTS(responseMessage);

            return handleResponse(event, 'Close', null, [responseMessage, audioUrl]);
        } catch (error) {
            console.log(error);

            return handleResponse(event, 'Close', null, 'Ocorreu um problema ao gerar o áudio da resposta.');
        }

    } catch (error) {
        // Retorna a resposta final em caso de erro no processamento
        return handleResponse(event, 'Fulfilled', null, 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.');
    }
};
