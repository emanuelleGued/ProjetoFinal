import { api } from '../lib/api.js';

// Função para gerar a resposta TTS e retornar o URL do áudio
export const generateTTS = async (phrase) => {
    try {
        const payload = { phrase };

        const ttsResponse = await api.post('/v1/tts', payload);
        return ttsResponse.data.url_to_audio;
    } catch (error) {
        console.error('Erro ao chamar a API de TTS:', error);
        throw new Error('Failed to generate TTS');
    }
};