import { handleResponse } from "../utils/response-builder.js";

export const handleAtividadesDiaIntent = async (event) => {
  let responseMessage = "";

  try {
    // Verifica se a intenção é 'AtividadesDia'
    if (event.sessionState?.intent?.name === "AtividadesDia") {
      const today = new Date();
      const dayOfWeek = today.getDay(); // Retorna 0 (Domingo) a 6 (Sábado)

      let responseMessage = "";

      // Define a mensagem conforme o dia da semana
      switch (dayOfWeek) {
        case 0: // Domingo
          responseMessage =
            "Não temos atividades marcadas para hoje por ser fim de semana.";
          break;
        case 1: // Segunda-feira
          responseMessage =
            "Hoje teremos arrumação das 9:00 às 12:00 e curso de bordado das 14:00 às 17:00.";
          break;
        case 2: // Terça-feira
          responseMessage =
            "Hoje teremos um período de visitas das 9:00 às 12:00, curso de crochê das 14:00 às 17:00 e sessão de pilates das 17:00 às 19:00.";
          break;
        case 3: // Quarta-feira
          responseMessage =
            "Hoje teremos um período de visitas das 9:00 às 12:00 e curso de artesanato das 14:00 às 17:00.";
          break;
        case 4: // Quinta-feira
          responseMessage =
            "Hoje terá o dia da convivência das 9:00 às 17:00 e sessão de pilates das 17:00 às 19:00.";
          break;
        case 5: // Sexta-feira
          responseMessage =
            "Hoje teremos um período de visitas das 9:00 às 12:00 e curso de pintura das 14:00 às 17:00.";
          break;
        case 6: // Sábado
          responseMessage =
            "Não temos atividades marcadas para hoje por ser fim de semana.";
          break;
        default:
          responseMessage = "Nenhuma atividade agendada para hoje.";
      }

      // Retorna a resposta final
      return handleResponse(event, "Close", null, responseMessage);
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
