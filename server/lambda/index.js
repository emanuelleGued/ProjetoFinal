import { handleResponse } from './utils/response-builder.js';
import { handleFallbackIntent } from './controllers/fallback.js'
import { handleSaudacaoIntent } from './controllers/saudacao.js';
import { handleInformacoesIntent } from './controllers/informacoes.js';
import { handleDoacaoIntent } from './controllers/doacao.js';


export const handler = async (event) => {
    // Verifica se `interpretations` existe e é um array
    if (!event.interpretations || !Array.isArray(event.interpretations)) {
        return await handleFallbackIntent(event);
    }

    // Encontra a interpretação com a maior confiança acima do mínimo de 0.85
    const highConfidenceInterpretation = event.interpretations.find(
        interpretation => interpretation.nluConfidence && interpretation.nluConfidence >= 0.80
    );

    if (!highConfidenceInterpretation) {
        return handleFallbackIntent(event);
    }

    // Processa a intenção correspondente à interpretação de alta confiança
    const intentName = highConfidenceInterpretation.intent.name;

    switch (intentName) {
        case 'Saudacao':
            return await handleSaudacaoIntent(event);
        case 'Informacoes':
            return await handleInformacoesIntent(event);
        case 'FazerDoacao':
            return await handleDoacaoIntent(event);
        default:
            return handleResponse(event, 'Close', null, 'Desculpe, não consegui processar a sua solicitação.');
    }
};
