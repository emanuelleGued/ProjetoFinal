export const validateSlots = (slots) => {
    const requiredFields = [
        { key: 'NomeVoluntario', message: 'Por favor, me informe seu nome completo.' },
        { key: 'RG1', message: 'Por favor, me informe seu RG.' },
        { key: 'CPF1', message: 'Digite seu CPF:' },
        { key: 'EmissaoRG', message: 'Qual é a data de emissão do seu RG?' },
        { key: 'DataNascimento', message: 'Qual a sua data de nascimento?' },
        { key: 'Endereco', message: 'Qual é o seu endereço?' },
        { key: 'Bairro', message: 'Qual é o seu bairro?' },
        { key: 'TelefoneCelular', message: 'Qual é o seu telefone celular?' },
        { key: 'Email', message: 'Me informe um e-mail para contato.' },
        { key: 'Profissao1', message: 'Me informe sua profissão.' },
        { key: 'Formacao', message: 'Qual é a sua formação?' },
        { key: 'AreaPretendida', message: 'Em qual área você gostaria de atuar?' },
        { key: 'DiaPretendido', message: 'Quais dias você está disponível para atuar?' },
        { key: 'HorarioPretendido', message: 'Quais horários você prefere?' },
        { key: 'IndicacaoAtividade', message: 'Você tem alguma atividade específica em mente?' },
    ];

    for (const field of requiredFields) {
        if (!slots[field.key] || !slots[field.key].value) {
            return { valid: false, message: field.message, slot: field.key };
        }
    }

    return { valid: true };
};
