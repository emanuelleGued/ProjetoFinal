import { handleResponse } from '../utils/response-builder.js';
import { generateTTS } from '../utils/generate-tts.js';

export const handleVisitasIntent = async (event) => {
    let responseMessage = "";

    try {
        const { Nome, Data, EnderecoVisita, Motivo } = event.sessionState.intent.slots;

        // Verificação do nome
        if (Nome && Nome.value) {
            let nomeSlot = Nome.value.originalValue.trim();
            responseMessage = `Você agendou uma visita para ${nomeSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'Nome', 'Qual é o nome da pessoa para quem será agendada a visita?');
        }

        // Verificação da data (apenas terça-feira permitida)
        if (Data && Data.value) {
            let dataSlot = new Date(Data.value.originalValue.trim());
            responseMessage += `Data da visita: ${dataSlot}. `;

        } else {
            return handleResponse(event, 'ElicitSlot', 'Data', 'Para qual data você gostaria de agendar a visita?');
        }

        // Verificação do endereço
        if (EnderecoVisita && EnderecoVisita.value) {
            let enderecoSlot = EnderecoVisita.value.originalValue.trim();
            responseMessage += `Endereço de visita: ${enderecoSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'EnderecoVisita', 'Qual é o endereço para a visita?');
        }

        // Verificação do motivo
        if (Motivo && Motivo.value) {
            let motivoSlot = Motivo.value.originalValue.trim();
            responseMessage += `Motivo da visita: ${motivoSlot}.`;
        } else {
            return handleResponse(event, 'ElicitSlot', 'Motivo', 'Qual é o motivo da visita?');
        }

        try {
            // Gerar o áudio da resposta usando a função TTS (Texto para Fala)
            const audioUrl = await generateTTS(responseMessage);

            // Retornar a resposta final com o áudio
            return handleResponse(event, 'Close', null, [responseMessage, audioUrl]);
        } catch (error) {
            console.log(error);

            // Retornar a resposta final em caso de erro na geração do áudio
            return handleResponse(event, 'Close', null, 'Ocorreu um problema ao gerar o áudio da resposta.');
        }
    } catch (error) {
        console.log(error);
        // Retornar a resposta final em caso de erro no processamento
        return handleResponse(event, 'Failed', null, 'Ocorreu um erro ao processar seu agendamento. Por favor, tente novamente.');
    }
};
