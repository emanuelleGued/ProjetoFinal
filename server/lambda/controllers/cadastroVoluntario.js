import { handleResponse } from '../utils/response-builder.js';
import { generateTTS } from '../utils/generate-tts.js';
import { validateSlots } from '../utils/validations.js';


export const handleCadastroVoluntarioIntent = async (event) => {
    let responseMessage = "";

    try {
        const slots = event.sessionState.intent.slots;

        // Validação dos slots
        const validation = validateSlots(slots);
        if (!validation.valid) {
            return handleResponse(event, 'ElicitSlot', validation.slot, validation.message);
        }

        // Se todos os campos estiverem válidos, construa a mensagem de resposta
        for (const key in slots) {
            const slotValue = slots[key].value.originalValue.trim();
            responseMessage += `${key}: ${slotValue}. `;
        }

        // Gerar áudio da resposta final
        const audioUrl = await generateTTS(responseMessage);
        return handleResponse(event, 'Close', null, [responseMessage, audioUrl]);

    } catch (error) {
        console.log(error);
        return handleResponse(event, 'Failed', null, 'Ocorreu um erro ao processar seu cadastro. Por favor, tente novamente.');
    }
};
