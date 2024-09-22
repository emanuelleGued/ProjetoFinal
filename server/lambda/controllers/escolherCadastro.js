export const handleEscolherCadastroIntent = async (event) => {
    const response = {
        sessionState: {
            ...event.sessionState,
            dialogAction: {
                type: 'Close',
            },
        },
        messages: [
            {
                contentType: 'PlainText',
                content: 'Olá, ficamos felizes em saber disso!'
            },
            {
                contentType: 'ImageResponseCard',
                imageResponseCard: {
                    title: 'Você gostaria de fazer qual tipo de cadastro',
                    buttons: [
                        {
                            text: 'Cadastrar um idoso no lar',
                            value: 'Gostaria de cadastrar um idoso',
                        },
                        {
                            text: 'Cadastrar Voluntário',
                            value: 'Gostaria de cadastrar um voluntário',
                        },
                    ],
                },
            }
        ]
    };

    return response;
};
