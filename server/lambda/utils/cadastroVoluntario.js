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
            NomeVoluntario, RG1, CPF1, Endereco1, TelefoneCelular, Email, Profissao1, AreaPretendida, DataNascimento, Formacao
        } = slots;


        // Verificação do NomeVoluntario
        if (NomeVoluntario && NomeVoluntario.value) {
            let nomeSlot = NomeVoluntario.value.originalValue.trim();
            responseMessage += `Nome do Voluntário: ${nomeSlot}. `;
        } else {
            const question = await axios.post(`${process.env.ENDPOINT}/generate-question`, { 
                context: "Elabore uma pergunta direta na segunda pessoa para saber o nome completo do voluntário, como: 'Qual é o seu nome completo?'"+
                "Para começarmos o seu cadastro, por favor, poderia me informar seu nome completo?"+
                "Não gere perguntas muito curtas como: Nome:"+
                "Me retorne apenas a pergunta."
            });
            const generatedQuestion = question.data.question;
            return handleResponse(event, 'ElicitSlot', 'NomeVoluntario', generatedQuestion);
        }


        // Verificação da Formacao
        if (Formacao && Formacao.value) {
            let formacaoSlot = Formacao.value.originalValue.trim();
            responseMessage += `Formação: ${formacaoSlot}. `;
        } else {
            const question = await axios.post(`${process.env.ENDPOINT}/generate-question`, { 
                context: "Elabore uma pergunta direta na segunda pessoa para saber a formação do voluntário, como: 'Qual é a sua formação?'"+
                "Você pode me informar sua formação, por favor?"+
                "Não gere perguntas muito curtas como: Formação:"+
                "Me retorne apenas a pergunta."
            });
            const generatedQuestion = question.data.question;
            return handleResponse(event, 'ElicitSlot', 'Formacao', generatedQuestion);
        }
        
        
        // Verificação da Profissao
        if (Profissao1 && Profissao1.value) {
            let profissaoSlot = Profissao1.value.originalValue.trim();
            responseMessage += `Profissão: ${profissaoSlot}. `;
        } else {
            const question = await axios.post(`${process.env.ENDPOINT}/generate-question`, { 
                context: "Elabore uma pergunta direta na segunda pessoa para saber a profissão do voluntário, como: 'Qual é a sua profissão?'"+
                "Você pode me informar sua profissão, por favor?"+
                "Não gere perguntas muito curtas como: Profissão:"+
                "Me retorne apenas a pergunta."
            });
            const generatedQuestion = question.data.question;
            return handleResponse(event, 'ElicitSlot', 'Profissao1', generatedQuestion);
        }

        // Verificação da AreaPretendida
        if (AreaPretendida && AreaPretendida.value) {
            let areaPretendidaSlot = AreaPretendida.value.originalValue.trim();
            responseMessage += `Área Pretendida: ${areaPretendidaSlot}. `;
        } else {
            const question = await axios.post(`${process.env.ENDPOINT}/generate-question`, { 
                context: "Elabore uma pergunta direta na segunda pessoa para saber a área pretendida do voluntário, como: 'Qual é a sua área pretendida?'"+
                "Para finalizar, qual área você gostaria de atuar como voluntário?"+
                "Não gere perguntas muito curtas como: Área Pretendida:"+
                "Me retorne apenas a pergunta."
            });
            const generatedQuestion = question.data.question;
            return handleResponse(event, 'ElicitSlot', 'AreaPretendida', generatedQuestion);
        }


        // Verificação do Endereco
        if (Endereco1 && Endereco1.value) {
            let enderecoSlot = Endereco1.value.originalValue.trim();
            responseMessage += `Endereço: ${enderecoSlot}. `;
        } else {
            const question = await axios.post(`${process.env.ENDPOINT}/generate-question`, { 
                context: "Elabore uma pergunta direta na segunda pessoa para saber o endereço completo do voluntário, como: 'Qual é o seu endereço completo?'"+
                "Agora, poderia me informar seu endereço completo para o cadastro?"+
                "Não gere perguntas muito curtas como: Endereço:"+
                "Me retorne apenas a pergunta."
            });
            const generatedQuestion = question.data.question;
            return handleResponse(event, 'ElicitSlot', 'Endereco1', generatedQuestion);
        } 
        
        
        // Verificação do Email
        if (Email && Email.value) {
            let emailSlot = Email.value.originalValue.trim();
            responseMessage += `Email: ${emailSlot}. `;
        } else {
            const question = await axios.post(`${process.env.ENDPOINT}/generate-question`, { 
                context: "Elabore uma pergunta direta na segunda pessoa para saber o email do voluntário, como: 'Qual é o seu email?'"+
                "Para finalizar, poderia me informar seu email, por favor?"+
                "Não gere perguntas muito curtas como: Email:"+
                "Me retorne apenas a pergunta."
            });
            const generatedQuestion = question.data.question;
            return handleResponse(event, 'ElicitSlot', 'Email', generatedQuestion);
        }   
        

        // Verificação do TelefoneCelular
        if (TelefoneCelular && TelefoneCelular.value) {
            let telefoneSlot = TelefoneCelular.value.originalValue.trim();
            responseMessage += `Telefone: ${telefoneSlot}. `;
        } else {
            const question = await axios.post(`${process.env.ENDPOINT}/generate-question`, { 
                context: "Elabore uma pergunta direta na segunda pessoa para saber o número de telefone do voluntário, como: 'Qual é o seu número de telefone para contato?'" +
                " 'Qual é o seu número para contato?'."
            });
            const generatedQuestion = question.data.question;
            return handleResponse(event, 'ElicitSlot', 'TelefoneCelular', generatedQuestion);
        }


        // Verificação do RG
        if (RG1 && RG1.value) {
            let rgSlot = RG1.value.originalValue.trim();
            responseMessage += `RG: ${rgSlot}. `;
        } else {
            const question = await axios.post(`${process.env.ENDPOINT}/generate-question`, { 
                context: "Elabore uma pergunta direta na segunda pessoa para saber o RG do voluntário, como: 'Qual é o seu RG?'"+
                "Ótimo! Agora, por favor, me diga qual é o número do seu RG?"+
                "Não gere perguntas muito curtas como: RG:"+
                "Me retorne apenas a pergunta."
            });
            const generatedQuestion = question.data.question;
            return handleResponse(event, 'ElicitSlot', 'RG1', generatedQuestion);
        }


        // Verificação do CPF
        if (CPF1 && CPF1.value) {
            let cpfSlot = CPF1.value.originalValue.trim();
            responseMessage += `CPF: ${cpfSlot}. `;
        } else {
            const question = await axios.post(`${process.env.ENDPOINT}/generate-question`, { 
                context: "Elabore uma pergunta direta na segunda pessoa para saber o CPF do voluntário, como: 'Qual é o seu CPF?'"+
                "Para continuar, você pode me informar o número do seu CPF, por favor?"+
                "Não gere perguntas muito curtas como: CPF:"+
                "Me retorne apenas a pergunta."
            });
            const generatedQuestion = question.data.question;
            return handleResponse(event, 'ElicitSlot', 'CPF1', generatedQuestion);
        }

        // Verificação da DataNascimento
        if (DataNascimento && DataNascimento.value) {
            let dataNascimentoSlot = DataNascimento.value.originalValue.trim();
            responseMessage += `Data de Nascimento: ${dataNascimentoSlot}. `;
        } else {
            const question = await axios.post(`${process.env.ENDPOINT}/generate-question`, { 
                context: "Elabore uma pergunta direta na segunda pessoa para saber a data de nascimento do voluntário, como: 'Qual é a sua data de nascimento?'"+
                "Para finalizar, você pode me informar sua data de nascimento, por favor?"+
                "Não gere perguntas muito curtas como: Data de Nascimento:"+
                "Me retorne apenas a pergunta."
            });
            const generatedQuestion = question.data.question;
            return handleResponse(event, 'ElicitSlot', 'DataNascimento', generatedQuestion);
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
            Profissao: Profissao1.value.originalValue.trim(),
            AreaPretendida: AreaPretendida.value.originalValue.trim(),
            DataNascimento: DataNascimento.value.originalValue.trim(),
            Formacao: Formacao.value.originalValue.trim()
        };


        // Persistir dados no DynamoDB
        await axios.post(`${process.env.ENDPOINT}/cadastrar_voluntario`, volunteerData);


        // Gerar áudio da resposta final
        const audioUrl = await generateTTS('Seu cadastro foi realizado com sucesso! ' + responseMessage);


        // Retornar a resposta final com o áudio
        return handleResponse(event, 'Close', null, [responseMessage, audioUrl]);


    } catch (error) {
        console.error(error);
        return handleResponse(event, 'Close', null, 'Ocorreu um erro ao processar seu cadastro. Por favor, tente novamente.');
    }
};
