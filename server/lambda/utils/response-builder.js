export const handleResponse = (event, type, slotToElicit, messages) => {
    console.log('Event:', event); // Adicione esta linha para depuração
    return {
        sessionState: {
            sessionAttributes: event.sessionState ? event.sessionState.sessionAttributes : {}, // Use um objeto vazio se não estiver definido
            intent: event.sessionState ? event.sessionState.intent : {},
            dialogAction: {
                type: type,
                slotToElicit: slotToElicit,
            },
        },
        messages: Array.isArray(messages) ? messages.map(message => ({
            contentType: 'PlainText',
            content: message
        })) : messages ? [
            {
                contentType: 'PlainText',
                content: messages,
            },
        ] : [],
    };
};