import { handleResponse } from "../utils/response-builder.js";
import { generateTTS } from "../utils/generate-tts.js"; // Importando a função TTS
import { phrases } from "../utils/phrases.js";

export const handleSaudacaoIntent = async (event) => {
  try {
    // Verifica se a intenção é 'Saudacao'
    if (event.sessionState?.intent?.name === "Saudacao") {
      // Tenta gerar o áudio para a saudação
      let audioUrl;
      try {
        audioUrl = await generateTTS(phrases.Saudacao.success);
      } catch (error) {
        console.log("Erro ao gerar áudio:", error);
        audioUrl = null; // Caso haja falha no TTS, segue sem o áudio
      }

      // Construção da resposta com ou sem o link do áudio
      const responseCard = {
        sessionState: {
          ...event.sessionState,
          dialogAction: {
            type: "Close",
          },
        },
        messages: [
          {
            contentType: "ImageResponseCard",
            imageResponseCard: {
              title: phrases.Saudacao.success,
              imageUrl:
                "https://public-lacfas-bucket.s3.amazonaws.com/fachada-lacfas.png",
              buttons: phrases.Saudacao.buttons,
            },
          },
          ...(audioUrl
            ? [
                {
                  contentType: "PlainText",
                  content: `Link para resposta em áudio: ${audioUrl}`,
                },
              ]
            : []),
        ],
      };

      return responseCard;
    }

    // Se a intenção não for 'Saudacao', retorna fallback
    const fallbackAudioUrl = await generateTTS(phrases.fallbackResponse);
    return handleResponse(event, "Close", null, [
      phrases.fallbackResponse,
      fallbackAudioUrl,
    ]);
  } catch (error) {
    // Trata erros gerais no processamento
    console.log("Erro no processamento:", error);
    return handleResponse(event, "Fulfilled", null, phrases.Saudacao.fail);
  }
};
