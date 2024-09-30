import { handleResponse } from "../utils/response-builder.js";
import { analyzeImage } from "../utils/analyze-image.js";

export const handleDoacaoIntent = async (event) => {
    const intentName = event.sessionState.intent.name;
    const slots = event.sessionState.intent.slots;
    const inputTranscript = event.inputTranscript;

    if(slots.TipoDeDoacao == null){
        return handleResponse(event, "ElicitSlot", "TipoDeDoacao", null);
    }
    
    // Verifica se a doação é por pix
    if (intentName === 'FazerDoacao' && slots.TipoDeDoacao.value.interpretedValue === 'pix') {
        // Verifica se o valor do Pix foi informado
        if (!slots.ValorPix || !slots.ValorPix.value || !slots.ValorPix.value.interpretedValue) {
            const requestMessage = "Por favor, informe o valor da doação via Pix.";
            return handleResponse(event, "ElicitSlot", "ValorPix", requestMessage);
        }

        // Se o valor do Pix foi informado, então processa a imagem (após o valor estar confirmado)
        if (!slots.ImagemComprovante || !slots.ImagemComprovante.value) {

            const message = "Esta é a chave pix para tranferência: 40.685.090/0001-16. Por favor, envie o comprovante após a tranferência para que seja possível registrar sua doação.";
            return handleResponse(event, "ElicitSlot", "ImagemComprovante", message);
        }

        // Análise da imagem via função externa
        try {
            const { isValorPixFound, isPixKeyFound } = await analyzeImage(slots.ImagemComprovante.value.interpretedValue, slots.ValorPix.value.interpretedValue);

            // Se ambos, o valor do Pix e a chave Pix forem encontrados na imagem
            if (isValorPixFound && isPixKeyFound) {
                const successMessage = "Obrigado por sua doação!";
                return handleResponse(event, "Close", null, successMessage);
            } else {
                const errorMessage = "O comprovante enviado não contém as informações necessárias.";
                return handleResponse(event, "ElicitSlot", "ImagemComprovante", errorMessage);
            }
        } catch (error) {
            const errorMessage = "Houve um erro ao processar a imagem. Tente novamente.";
            return handleResponse(event, "ElicitSlot", "ImagemComprovante", errorMessage);
        }
    } else {
        const successMessage = "Para tratar doação de alimentos ou itens entre contato no número de telefone: (83) 99174-6548 ou, se possível, vá até a nossa instituição: Sítio Quebra-Pé, Esperança, PB. Desde já, agradecemos o interesse em ajudar nossa instituição!";
        return handleResponse(event, "Close", null, successMessage);
    }
};
