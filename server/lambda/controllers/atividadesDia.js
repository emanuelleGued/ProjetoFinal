import { handleResponse } from "../utils/response-builder.js";
import { generateTTS } from "../utils/generate-tts.js"; // Importando a função TTS

export const handleAtividadesDiaIntent = async (event) => {
  let responseMessage = "";
  const intentName = event.sessionState.intent.name;
  const slots = event.sessionState.intent.slots;

  try {
    // Verifica se a intenção é 'AtividadesDia'
    if (intentName === "AtividadesDia") {
      // Verificação da existência dos slots
      if (!slots) {
        return handleResponse(event, "Failed", null, "Nenhum slot encontrado.");
      }

      if (
        !slots.DiaSemana ||
        !slots.DiaSemana.value ||
        !slots.DiaSemana.value.interpretedValue
      ) {
        const requestMessage =
          "Por favor, informe o dia da semana que deseja consultar.";
        return handleResponse(event, "ElicitSlot", "DiaSemana", requestMessage);
      }

      const DiaDaSemana = slots.DiaSemana.value.interpretedValue;

      switch (DiaDaSemana.toUpperCase()) {
        case "DOMINGO":
          responseMessage = "Não temos atividades marcadas para Domingo.";
          break;
        case "SEGUNDA":
          responseMessage =
            "Segunda teremos arrumação das 9:00 às 12:00 e curso de bordado das 14:00 às 17:00.";
          break;
        case "TERÇA":
          responseMessage =
            "Terça teremos um período de visitas das 9:00 às 12:00, curso de crochê das 14:00 às 17:00 e sessão de pilates das 17:00 às 19:00.";
          break;
        case "QUARTA":
          responseMessage =
            "Quarta teremos um período de visitas das 9:00 às 12:00 e curso de artesanato das 14:00 às 17:00.";
          break;
        case "QUINTA":
          responseMessage =
            "Quinta terá o dia da convivência das 9:00 às 17:00 e sessão de pilates das 17:00 às 19:00.";
          break;
        case "SEXTA":
          responseMessage =
            "Sexta teremos um período de visitas das 9:00 às 12:00 e curso de pintura das 14:00 às 17:00.";
          break;
        case "SÁBADO":
          responseMessage = "Não temos atividades marcadas para Sábado.";
          break;
        default:
          responseMessage = "Não entendi.";
      }

      // Gera o áudio da resposta
      try {
        const audioUrl = await generateTTS(responseMessage);

        return handleResponse(event, "Close", null, [
          responseMessage,
          audioUrl,
        ]);
      } catch (error) {
        console.log(error);

        return handleResponse(
          event,
          "Close",
          null,
          "Ocorreu um problema ao gerar o áudio da resposta."
        );
      }
    }
  } catch (error) {
    // Retorna a resposta final em caso de erro no processamento
    return handleResponse(
      event,
      "Fulfilled",
      null,
      "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente."
    );
  }
};
