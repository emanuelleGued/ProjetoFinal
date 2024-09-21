import { handleResponse } from "../utils/response-builder.js";

export const handleDoacaoIntent = async (event) => {
    const intentName = event.sessionState.intent.name;
    const slots = event.sessionState.intent.slots;
    const inputTranscript = event.inputTranscript;

    // Verifica se o tipo de doação é pix
    if (intentName === 'FazerDoacao' && slots.TipoDeDoacao.value.interpretedValue === 'pix') {
        
        // Verifica se o inputTranscript contém um link de imagem
        if (inputTranscript && inputTranscript.startsWith('<') && inputTranscript.endsWith('>')) {
            const potentialUrl = inputTranscript.slice(1, -1); // Remove os caracteres '<' e '>'
            
            if (isImageUrl(potentialUrl)) {
                const successMessage = "Obrigado por enviar o comprovante de imagem!";
                return handleResponse(event, "Close", null, successMessage); // Usando Close com Fulfilled
            } else {
                const retryMessage = "O link enviado não parece ser uma imagem. Por favor, envie um link válido de imagem.";
                return handleResponse(event, "ElicitSlot", "ImagemComprovante", retryMessage);
            }
        } else {
            const noLinkMessage = "Não foi detectado um link de imagem. Por favor, envie o comprovante de pagamento como um link de imagem.";
            return handleResponse(event, "ElicitSlot", "ImagemComprovante", noLinkMessage);
        }
    }
    
    // Caso seja outro tipo de doação
    return handleResponse(event, "Close", null, "Obrigado pela sua doação!"); // Usando Close com Fulfilled
};

// Função para verificar se o URL é uma imagem
const isImageUrl = (url) => {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
};
