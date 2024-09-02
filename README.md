# Projeto de Chatbot para o Lar Cuidar

## Visão Geral

Este projeto tem como objetivo desenvolver uma aplicação acessível e útil para o lar de idosos "Lar Cuidar Família Santos" (LACFAS), localizado no Sítio Quebra-Pé, Esperança, PB. O LACFAS é uma organização sem fins lucrativos dedicada a acolher idosos a partir dos 60 anos, oferecendo assistência e cuidados adequados a essa faixa etária. A instituição segue as diretrizes da Política Nacional de Assistência Social, garantindo proteção integral, moradia, alimentação, e higiene para indivíduos que estão sem referência ou em situação de ameaça, violência, negligência ou abandono.

O foco principal deste projeto é criar um chatbot que servirá como um portal de comunicação e interação tanto para os idosos residentes quanto para seus cuidadores e familiares. Através do chatbot, os usuários poderão obter informações sobre as atividades do dia, como fisioterapia, palestras, atividades físicas, artes, crochê, bordado e outras atividades artesanais. Além disso, o chatbot permitirá solicitar ajuda e contribuir para a busca de idosos desaparecidos, enviando fotos que serão comparadas com uma base de dados interna.

## Objetivo do Projeto

O principal objetivo deste projeto é fornecer uma ferramenta de fácil acesso para o lar de idosos, melhorando a comunicação e ajudando em casos de desaparecimento de moradores da região. Com a integração de diversas tecnologias AWS, espera-se criar uma solução eficaz e prática, alinhada com as necessidades da instituição e da comunidade.

## Arquitetura

![alt text](assets/arquitetura.png)

A arquitetura do projeto faz uso de vários serviços da AWS para garantir uma experiência de usuário fluida e funcional:

- **Amazon Lex**: Usado como o motor principal do chatbot, responsável por processar as mensagens dos usuários e determinar as intenções.
- **AWS Lambda**: Função backend que processa as requisições do Lex e interage com outros serviços AWS para fornecer as respostas e ações necessárias.
- **Amazon Polly**: Proporciona acessibilidade ao converter respostas de texto em áudio, especialmente útil para idosos com dificuldades de leitura.
- **Amazon Rekognition**: Utilizado para comparar fotos de idosos desaparecidos com uma base de dados de imagens armazenadas, ajudando a identificar possíveis correspondências.
- **Amazon Bedrock**: Integração com modelos de linguagem avançados para personalizar e contextualizar as respostas do chatbot, melhorando a interação com os usuários.
- **Amazon S3**: Armazena as imagens dos idosos enviadas pelos usuários. As imagens são armazenadas com segurança e acessadas posteriormente para comparação.
- **Amazon DynamoDB**: Armazena os metadados das imagens, como data de upload, nome da pessoa na foto e uma referência para o arquivo armazenado no S3, facilitando a busca e a comparação de imagens enviadas pelos usuários.

## Fluxo de Interação

1. **Usuários (idosos, cuidadores, comunidade)**: Enviam mensagens, fotos ou áudios através do canal de comunicação Slack.
2. **Slack**: Recebe as mensagens dos usuários e as repassa para o Amazon Lex.
3. **Amazon Lex**: Processa a mensagem, identifica a intenção e encaminha a solicitação para a função Lambda apropriada.
4. **AWS Lambda**: Executa as ações necessárias, como chamar o Bedrock para personalizar respostas, ou o Rekognition para comparar imagens.
5. **Amazon Polly**: Converte as respostas textuais em áudio, retornando ao Slack para que o usuário final possa ouvir as informações.
6. **Amazon S3**: Armazena as imagens dos idosos enviadas pelos usuários, garantindo alta durabilidade e disponibilidade.
7. **Amazon DynamoDB**: Armazena os metadados das imagens e a referência (URL ou chave) da imagem armazenada no S3, integrando-se com o Rekognition para verificar correspondências.

## Uso dos Serviços AWS

- **Amazon Lex**: Interpretação de linguagem natural para o chatbot.
- **Amazon Polly**: Geração de áudio para respostas textuais.
- **Amazon Rekognition**: Análise e comparação de imagens para identificação de idosos desaparecidos.
- **Amazon Bedrock**: Personalização e contextualização de respostas do chatbot.
- **AWS Lambda**: Lógica de backend e orquestração das chamadas de serviços AWS.
- **Amazon S3**: Armazenamento seguro e escalável das imagens enviadas.
- **Amazon DynamoDB**: Armazenamento de metadados das imagens e referência para o S3.

## 👥 Contribuidores
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/estertrvs" title="GitHub">
        <img src="https://avatars.githubusercontent.com/u/127947850?v=4" width="100px;" alt="Foto de Ester"/><br>
        <sub>
          <b>Ester Traves</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/emanuelleGued" title="GitHub">
        <img src="https://avatars.githubusercontent.com/u/113402178?v=4" width="100px;" alt="Foto de Emanuelle"/><br>
        <sub>
          <b>Emanuelle Guedes</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/https-Luan-Fernandes" title="GitHub">
        <img src="https://avatars.githubusercontent.com/u/124894596?v=4" width="100px;" alt="Foto de Luan"/><br>
        <sub>
          <b>Luan Fernandes</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/LuizManoeldev" title="GitHub">
        <img src="https://avatars.githubusercontent.com/u/128108790?v=4" width="100px;" alt="Foto de Luiz"/><br>
        <sub>
          <b>Luiz Manoel</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/SilasLeao" title="GitHub">
        <img src="https://avatars.githubusercontent.com/u/134391110?v=4" width="100px;" alt="Foto de Silas"/><br>
        <sub>
          <b>Silas Leão</b>
        </sub>
      </a>
    </td>
  </tr>
</table>
