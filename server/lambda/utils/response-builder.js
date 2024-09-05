export const handleResponse = (event, type, slotToElicit, messages) => {
    return {
        sessionState: {
            sessionAttributes: event.sessionState.sessionAttributes,
            intent: event.sessionState.intent,
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
