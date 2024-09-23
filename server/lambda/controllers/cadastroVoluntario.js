import { handleResponse } from '../utils/response-builder.js';
import { generateTTS } from '../utils/generate-tts.js';
import { validateSlots } from '../utils/validations.js';


export const handleCadastroVoluntarioIntent = async (event) => {
    let responseMessage = "";

    try {
        const slots = event.sessionState.intent.slots;

        // Validação dos slots
        const validation = validateSlots(slots);
        if (!validation.valid) {
            return handleResponse(event, 'ElicitSlot', validation.slot, validation.message);
        }


        // Criar objeto de dados do voluntário
        const volunteerData = {
            PK: `voluntario#${slots.CPF1.value.originalValue.trim()}`, // Chave primária
            NomeVoluntario: slots.NomeVoluntario.value.originalValue.trim(),
            RG: slots.RG1.value.originalValue.trim(),
            CPF: slots.CPF1.value.originalValue.trim(),
            EmissaoRG: slots.EmissaoRG.value.originalValue.trim(),
            DataNascimento: slots.DataNascimento.value.originalValue.trim(),
            Endereco: slots.Endereco1.value.originalValue.trim(),
            Bairro: slots.Bairro.value.originalValue.trim(),
            TelefoneCelular: slots.TelefoneCelular.value.originalValue.trim(),
            Email: slots.Email.value.originalValue.trim(),
            Profissao: slots.Profissao1.value.originalValue.trim(),
            Formacao: slots.Formacao.value.originalValue.trim(),
            AreaPretendida: slots.AreaPretendida.value.originalValue.trim(),
            DiaPretendido: slots.DiaPretendido.value.originalValue.trim(),
            HorarioPretendido: slots.HorarioPretendido.value.originalValue.trim(),
            IndicacaoAtividade: slots.IndicacaoAtividade.value.originalValue.trim(),
        };

        // Se todos os campos estiverem válidos, construa a mensagem de resposta
        for (const key in volunteerData) {
            const slotValue = volunteerData[key];
            responseMessage += `${key}: ${slotValue}. `;
        }

        // Persistir dados no DynamoDB
        await axios.post(`${process.env.ENDPOINT}/cadastrar_voluntario`, volunteerData);

        // Gerar áudio da resposta final
        const audioUrl = await generateTTS(responseMessage);
        return handleResponse(event, 'Close', null, [responseMessage, audioUrl]);

    } catch (error) {
        console.log(error);
        return handleResponse(event, 'Failed', null, 'Ocorreu um erro ao processar seu cadastro. Por favor, tente novamente.');
    }
};
