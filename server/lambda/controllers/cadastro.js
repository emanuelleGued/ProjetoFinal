import { handleResponse } from '../utils/response-builder.js';
import { generateTTS } from '../utils/generate-tts.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const handleCadastroIntent = async (event) => {
    let responseMessage = "";

    try {
        const slots = event.sessionState.intent.slots;

        // Verificação da existência dos slots
        if (!slots) {
            return handleResponse(event, 'Failed', null, 'Nenhum dado foi informado. Por favor, tente novamente.');
        }

        const {
            Nome, DataNascimento, Email, Endereco, EstadoCivil, Genero,
            telefone, CondicaoMedica, Acompanhamento
        } = slots;

        // Verificação do nome
        if (Nome && Nome.value) {
            let nomeSlot = Nome.value.originalValue.trim();
            responseMessage += `Nome: ${nomeSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'Nome', 'Poderia me informar nome completo, por favor?');
        }

        // Verificação da data de nascimento
        if (DataNascimento && DataNascimento.value) {
            let dataNascimentoSlot = DataNascimento.value.originalValue.trim();
            responseMessage += `Data de Nascimento: ${dataNascimentoSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'DataNascimento', 'Qual é a data de nascimento, por gentileza?');
        }

        // Verificação do gênero
        if (Genero && Genero.value) {
            let generoSlot = Genero.value.originalValue.trim();
            responseMessage += `Gênero: ${generoSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'Genero', 'Me informe o genero, por favor?');
        }

        // Verificação do estado civil
        if (EstadoCivil && EstadoCivil.value) {
            let estadoCivilSlot = EstadoCivil.value.originalValue.trim();
            responseMessage += `Estado Civil: ${estadoCivilSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'EstadoCivil', 'Você poderia me dizer o estado civil, por favor?');
        }

        // Verificação do endereço
        if (Endereco && Endereco.value) {
            let enderecoSlot = Endereco.value.originalValue.trim();
            responseMessage += `Endereço: ${enderecoSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'Endereco', 'Poderia me dizer o endereço, por favor?');
        }

        // Verificação do telefone
        if (telefone && telefone.value) {
            let telefoneSlot = telefone.value.originalValue.trim();
            responseMessage += `Telefone: ${telefoneSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'telefone', 'Você pode me passar um número de telefone para contato, por gentileza?');
        }

        // Verificação do email
        if (Email && Email.value) {
            let emailSlot = Email.value.originalValue.trim();
            responseMessage += `Email: ${emailSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'Email', 'Me informe um email para contato, por favor?');
        }

        // Verificação da condição médica
        if (CondicaoMedica && CondicaoMedica.value) {
            let condicaoMedicaSlot = CondicaoMedica.value.originalValue.trim();
            responseMessage += `Condição Médica: ${condicaoMedicaSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'CondicaoMedica', 'Possui alguma condição médica que gostaria de compartilhar? (Ex: Diabetes)');
        }

        // Verificação do acompanhamento
        if (Acompanhamento && Acompanhamento.value) {
            let acompanhamentoSlot = Acompanhamento.value.originalValue.trim();
            responseMessage += `Acompanhamento: ${acompanhamentoSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'Acompanhamento', 'Está em acompanhamento médico?');
        }

        // Criar objeto de dados
        const idosoData = {
            PK: `idoso#${Nome.value.originalValue.trim()}`, // Definindo a chave primária
            Nome: Nome.value.originalValue.trim(),
            DataNascimento: DataNascimento.value.originalValue.trim(),
            Email: Email.value.originalValue.trim(),
            Endereco: Endereco.value.originalValue.trim(),
            EstadoCivil: EstadoCivil.value.originalValue.trim(),
            Genero: Genero.value.originalValue.trim(),
            Telefone: telefone.value.originalValue.trim(),
            CondicaoMedica: CondicaoMedica.value.originalValue.trim(),
            Acompanhamento: Acompanhamento.value.originalValue.trim(),
        };

        // Persistir dados no DynamoDB
        await axios.post(`${process.env.ENDPOINT}/cadastrar_idoso`, idosoData);

        // Gerar áudio da resposta final
        const audioUrl = await generateTTS(responseMessage);

        // Retornar a resposta final com o áudio
        return handleResponse(event, 'Close', null, [responseMessage, audioUrl]);

    } catch (error) {
        console.log(error);
        return handleResponse(event, 'Failed', null, 'Ocorreu um erro ao processar seu cadastro. Por favor, tente novamente.');
    }
};
