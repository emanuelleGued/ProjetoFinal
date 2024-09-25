import { handleResponse } from '../utils/response-builder.js';
import { generateTTS } from '../utils/generate-tts.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const handleCadastroVoluntarioIntent = async (event) => {
    let responseMessage = "";

    try {
        const slots = event.sessionState.intent.slots;

        // Verificação da existência dos slots
        if (!slots) {
            return handleResponse(event, 'Close', null, 'Nenhum slot encontrado.');
        }

        const {
            NomeVoluntario, RG1, CPF1, Endereco1, TelefoneCelular, Email
        } = slots;

        // Verificação do NomeVoluntario
        if (NomeVoluntario && NomeVoluntario.value) {
            let nomeSlot = NomeVoluntario.value.originalValue.trim();
            responseMessage += `Nome do Voluntário: ${nomeSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'NomeVoluntario', 'Por favor, me informe o nome do voluntário.');
        }

        // Verificação do RG
        if (RG1 && RG1.value) {
            let rgSlot = RG1.value.originalValue.trim();
            responseMessage += `RG: ${rgSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'RG1', 'Por favor, informe o RG.');
        }

        // Verificação do CPF
        if (CPF1 && CPF1.value) {
            let cpfSlot = CPF1.value.originalValue.trim();
            responseMessage += `CPF: ${cpfSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'CPF1', 'Por favor, informe o CPF.');
        }

        // Verificação do Endereco
        if (Endereco1 && Endereco1.value) {
            let enderecoSlot = Endereco1.value.originalValue.trim();
            responseMessage += `Endereço: ${enderecoSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'Endereco1', 'Por favor, informe o endereço.');
        }

        // Verificação do TelefoneCelular
        if (TelefoneCelular && TelefoneCelular.value) {
            let telefoneSlot = TelefoneCelular.value.originalValue.trim();
            responseMessage += `Telefone Celular: ${telefoneSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'TelefoneCelular', 'Por favor, informe o telefone celular.');
        }

        // Verificação do Email
        if (Email && Email.value) {
            let emailSlot = Email.value.originalValue.trim();
            responseMessage += `Email: ${emailSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'Email', 'Por favor, informe o email.');
        }

        // Criar objeto de dados do voluntário
        const volunteerData = {
            PK: `voluntario#${CPF1.value.originalValue.trim()}`,
            NomeVoluntario: NomeVoluntario.value.originalValue.trim(),
            RG: RG1.value.originalValue.trim(),
            CPF: CPF1.value.originalValue.trim(),
            Endereco: Endereco1.value.originalValue.trim(),
            TelefoneCelular: TelefoneCelular.value.originalValue.trim(),
            Email: Email.value.originalValue.trim(),
        };

        // Persistir dados no DynamoDB
        await axios.post(`${process.env.ENDPOINT}/cadastrar_voluntario`, volunteerData);

        // Gerar áudio da resposta final
        const audioUrl = await generateTTS('Seu cadastro foi realizado com sucesso!'+ responseMessage);

        // Retornar a resposta final com o áudio
        return handleResponse(event, 'Close', null, [responseMessage, audioUrl]);

    } catch (error) {
        console.error(error);
        return handleResponse(event, 'Close', null, 'Ocorreu um erro ao processar seu cadastro. Por favor, tente novamente.');
    }
};
