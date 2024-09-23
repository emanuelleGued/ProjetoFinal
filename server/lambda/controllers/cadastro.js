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
            return handleResponse(event, 'Failed', null, 'Nenhum slot encontrado.');
        }

        const {
            Nome, cpf, DataNascimento, Email, Endereco,
            Escolaridade, EstadoCivil, Genero, Naturalidade, Profissao,
            telefone, dataExpedicao, orgaoExpedidor, rg, uf, CondicaoMedica, Acompanhamento
        } = slots;

        // Verificação do nome
        if (Nome && Nome.value) {
            let nomeSlot = Nome.value.originalValue.trim();
            responseMessage += `Nome: ${nomeSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'Nome', 'Por favor, me informe o nome completo?');
        }

        // Verificação da data de nascimento
        if (DataNascimento && DataNascimento.value) {
            let dataNascimentoSlot = DataNascimento.value.originalValue.trim();
            responseMessage += `Data de Nascimento: ${dataNascimentoSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'DataNascimento', 'Qual a data de nascimento?');
        }

        // Verificação do gênero
        if (Genero && Genero.value) {
            let generoSlot = Genero.value.originalValue.trim();
            responseMessage += `Gênero: ${generoSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'Genero', 'Me informe o gênero: feminino ou masculino?');
        }

        // Verificação do estado civil
        if (EstadoCivil && EstadoCivil.value) {
            let estadoCivilSlot = EstadoCivil.value.originalValue.trim();
            responseMessage += `Estado Civil: ${estadoCivilSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'EstadoCivil', 'Qual é o seu estado civil?');
        }

        // Verificação da naturalidade
        if (Naturalidade && Naturalidade.value) {
            let naturalidadeSlot = Naturalidade.value.originalValue.trim();
            responseMessage += `Naturalidade: ${naturalidadeSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'Naturalidade', 'Qual é a cidade de nascimento?');
        }

        // Verificação da escolaridade
        if (Escolaridade && Escolaridade.value) {
            let escolaridadeSlot = Escolaridade.value.originalValue.trim();
            responseMessage += `Escolaridade: ${escolaridadeSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'Escolaridade', 'Me informe a escolaridade? (Ex: Ensino Médio Completo)');
        }

        // Verificação da profissão
        if (Profissao && Profissao.value) {
            let profissaoSlot = Profissao.value.originalValue.trim();
            responseMessage += `Profissão: ${profissaoSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'Profissao', 'Me informe a profissão?');
        }

        // Verificação do CPF
        if (cpf && cpf.value) {
            let cpfSlot = cpf.value.originalValue.trim();
            responseMessage += `CPF: ${cpfSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'cpf', 'Digite o CPF:');
        }

        // Verificação do RG
        if (rg && rg.value) {
            let rgSlot = rg.value.originalValue.trim();
            responseMessage += `RG: ${rgSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'rg', 'Digite o RG:');
        }

        // Verificação do órgão expedidor
        if (orgaoExpedidor && orgaoExpedidor.value) {
            let orgaoExpedidorSlot = orgaoExpedidor.value.originalValue.trim();
            responseMessage += `Órgão Expedidor: ${orgaoExpedidorSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'orgaoExpedidor', 'Qual é o órgão expedidor do seu documento?');
        }

        // Verificação da UF
        if (uf && uf.value) {
            let ufSlot = uf.value.originalValue.trim();
            responseMessage += `UF: ${ufSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'uf', 'Digite a UF:');
        }

        // Verificação da data de expedição
        if (dataExpedicao && dataExpedicao.value) {
            let dataExpedicaoSlot = dataExpedicao.value.originalValue.trim();
            responseMessage += `Data de Expedição: ${dataExpedicaoSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'dataExpedicao', 'Qual é a data de expedição do seu documento?');
        }

        // Verificação do endereço
        if (Endereco && Endereco.value) {
            let enderecoSlot = Endereco.value.originalValue.trim();
            responseMessage += `Endereço: ${enderecoSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'Endereco', 'Qual é o seu endereço?');
        }

        // Verificação do telefone
        if (telefone && telefone.value) {
            let telefoneSlot = telefone.value.originalValue.trim();
            responseMessage += `Telefone: ${telefoneSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'telefone', 'Me informe um telefone para contato?');
        }

        // Verificação do email
        if (Email && Email.value) {
            let emailSlot = Email.value.originalValue.trim();
            responseMessage += `Email: ${emailSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'Email', 'Me informe um email para contato?');
        }

        // Verificação da condição médica
        if (CondicaoMedica && CondicaoMedica.value) {
            let condicaoMedicaSlot = CondicaoMedica.value.originalValue.trim();
            responseMessage += `Condição Médica: ${condicaoMedicaSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'CondicaoMedica', 'Possui alguma condição médica? (Ex: Diabetes)');
        }

        // Verificação do acompanhamento
        if (Acompanhamento && Acompanhamento.value) {
            let acompanhamentoSlot = Acompanhamento.value.originalValue.trim();
            responseMessage += `Acompanhamento: ${acompanhamentoSlot}. `;
        } else {
            return handleResponse(event, 'ElicitSlot', 'Acompanhamento', 'Tem algum acompanhamento?');
        }

        // Criar objeto de dados do idoso
        const idosoData = {
            PK: `idoso#${cpf.value.originalValue.trim()}`, // Definindo a chave primária
            Nome: Nome.value.originalValue.trim(),
            DataNascimento: DataNascimento.value.originalValue.trim(),
            Email: Email.value.originalValue.trim(),
            Endereco: Endereco.value.originalValue.trim(),
            Escolaridade: Escolaridade.value.originalValue.trim(),
            EstadoCivil: EstadoCivil.value.originalValue.trim(),
            Genero: Genero.value.originalValue.trim(),
            Naturalidade: Naturalidade.value.originalValue.trim(),
            Profissao: Profissao.value.originalValue.trim(),
            Telefone: telefone.value.originalValue.trim(),
            DataExpedicao: dataExpedicao.value.originalValue.trim(),
            OrgaoExpedidor: orgaoExpedidor.value.originalValue.trim(),
            RG: rg.value.originalValue.trim(),
            UF: uf.value.originalValue.trim(),
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
