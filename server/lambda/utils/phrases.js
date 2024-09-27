const bot_name = "Lara";

export const phrases = {
  Saudacao: {
    success: `Olá! Eu sou ${bot_name}, sua assistente virtual do LAcfas. Estou aqui para ajudar você com informações, cadastros e orientações. Como posso ajudá-lo(a) hoje?`
,
    fail: "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.",

    buttons: [
      {
        text: "Atividades do dia",
        value: "Gostaria de saber sobre as atividades do dia",
      },
      {
        text: "Doar",
        value: "Gostaria de fazer uma doação",
      },
      {
        text: "Agendar visita",
        value: "Gostaria de agendar uma visita",
      },
      {
        text: "Cadastrar voluntário",
        value: "Gostaria de cadastrar um voluntário",
      },
      {
        text: "Cadastrar idoso",
        value: "Gostaria de cadastrar um idoso",
      },
    ],
  },

  AudioFail: "Desculpe, ocorreu um erro na geração do audio.",

  fallbackResponse:
    "Desculpe, não consegui entender. Poderia repetir com outras palavras?",
};
