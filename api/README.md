
# API Endpoints

| Método  | Endpoint                                                            | Função Lambda                      | Descrição                                                                                   |
|---------|----------------------------------------------------------------------|------------------------------------|---------------------------------------------------------------------------------------------|
| GET     | `https://2nnxhyeynf.execute-api.us-east-1.amazonaws.com/`            | `lacfas-health-function`           | Verifica o estado de saúde da API, retornando uma mensagem de sucesso.                      |
| GET     | `https://2nnxhyeynf.execute-api.us-east-1.amazonaws.com/v1`          | `lacfas-v1-description-function`   | Retorna a descrição da versão atual da API.                                                  |
| POST    | `https://2nnxhyeynf.execute-api.us-east-1.amazonaws.com/v1/tts`      | `lacfas-v1-tts-function`           | Converte uma frase em áudio utilizando o Amazon Polly e armazena no S3.                     |
| POST    | `https://2nnxhyeynf.execute-api.us-east-1.amazonaws.com/cadastrar_idoso` | `api-tts-dev-cadastrarIdoso`       | Cadastra os dados de um idoso no DynamoDB.                                                   |
| POST    | `https://2nnxhyeynf.execute-api.us-east-1.amazonaws.com/cadastrar_voluntario` | `api-tts-dev-cadastrarVoluntario` | Cadastra os dados de um voluntário no DynamoDB.                                              |
| POST    | `https://2nnxhyeynf.execute-api.us-east-1.amazonaws.com/generate-question` | `api-tts-dev-generateDynamicQuestion` | Gera uma pergunta dinâmica com base em um contexto fornecido.                                |
| POST    | `https://2nnxhyeynf.execute-api.us-east-1.amazonaws.com/slack/events` | `api-tts-dev-processSlackMessage`  | Processa eventos recebidos do Slack, incluindo verificação de URL e mensagens recebidas.      |
| POST    | `https://2nnxhyeynf.execute-api.us-east-1.amazonaws.com/v1/transcribe` | `lacfas-v1-transcribe-function`   | Transcreve um arquivo de áudio utilizando o Amazon Transcribe.                               |

# Uso da API

| Método  | Endpoint                                                            | Modelo de Requisição                                                                              |
|---------|----------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| GET     | `https://2nnxhyeynf.execute-api.us-east-1.amazonaws.com/`            | Sem corpo de requisição necessário.                                                               |
| GET     | `https://2nnxhyeynf.execute-api.us-east-1.amazonaws.com/v1`          | Sem corpo de requisição necessário.                                                               |
| POST    | `https://2nnxhyeynf.execute-api.us-east-1.amazonaws.com/v1/tts`      | { "phrase": "Exemplo de frase para conversão." }                                                  |
| POST    | `https://2nnxhyeynf.execute-api.us-east-1.amazonaws.com/cadastrar_idoso` | { "nome": "João", "idade": 80, "endereco": "Rua X, 123" }                                         |
| POST    | `https://2nnxhyeynf.execute-api.us-east-1.amazonaws.com/cadastrar_voluntario` | { "nome": "Maria", "idade": 25, "area_atuacao": "Saúde" }                                         |
| POST    | `https://2nnxhyeynf.execute-api.us-east-1.amazonaws.com/generate-question` | { "context": "Exemplo de contexto." }                                                             |
| POST    | `https://2nnxhyeynf.execute-api.us-east-1.amazonaws.com/slack/events` | { "type": "url_verification", "challenge": "slack-challenge" }                                     |
| POST    | `https://2nnxhyeynf.execute-api.us-east-1.amazonaws.com/v1/transcribe` | { "transcribe_audio": true, "audio_url": "https://bucket-url/audio.mp3" }                         |


# Cartilha de Segurança

A API foi desenvolvida com diversas camadas de segurança para garantir a proteção dos dados sensíveis e o armazenamento seguro dos arquivos de áudio gerados. Abaixo estão as medidas de segurança implementadas em cada etapa:

## 1. Armazenamento de Áudio (Bucket S3: `lacfas-audio-bucket`)
Os áudios gerados pela API são armazenados no Amazon S3, que possui as seguintes medidas de segurança:
- **Criptografia no lado do servidor (SSE-S3)**: Todos os arquivos são criptografados automaticamente pelo Amazon S3 com chaves gerenciadas pela AWS, garantindo que os dados estejam protegidos contra acessos não autorizados.
- **Chave do Bucket**: O bucket está configurado com uma chave de bucket, o que reduz os custos de solicitação para criptografar e descriptografar objetos, além de melhorar a segurança.
- **Acesso Público Controlado**: Embora o bucket seja público para permitir o acesso aos áudios, medidas adequadas de segurança estão em vigor para proteger os dados.

## 2. Banco de Dados de Áudio (DynamoDB: `lacfas-audio-database`)
Os metadados dos áudios são armazenados em uma tabela DynamoDB configurada com:
- **Proteção contra exclusão**: Impede a exclusão acidental ou mal-intencionada dos registros armazenados.
- **Criptografia gerenciada pelo DynamoDB**: Todos os dados armazenados na tabela são criptografados automaticamente pelo DynamoDB usando chaves gerenciadas pela AWS, garantindo a segurança dos dados.

## 3. Tabelas de Cadastro (DynamoDB: `CadastroIdosos` e `CadastroVoluntarios`)
Essas tabelas armazenam dados sensíveis dos voluntários e idosos cadastrados, e as seguintes medidas de segurança estão implementadas:
- **Proteção contra exclusão**: Evita a remoção não intencional dos dados sensíveis.
- **Criptografia gerenciada pelo DynamoDB**: Assim como a tabela de áudios, as tabelas de cadastro utilizam criptografia automática, protegendo as informações pessoais dos usuários.

## 4. Comunicação Segura (HTTPS)
Todas as chamadas feitas pela API utilizam **protocolo HTTPS** para garantir que os dados em trânsito entre o cliente e o servidor sejam criptografados, protegendo-os contra interceptações e ataques man-in-the-middle.

## 5. Backups

Para garantir a disponibilidade e a integridade dos dados sensíveis armazenados, foram implementadas as seguintes medidas de backup nas tabelas e no bucket S3 utilizados pela API:

### 5.1. Backups das Tabelas DynamoDB

As tabelas **CadastroIdosos**, **CadastroVoluntarios** e **lacfas-audio-database** possuem as seguintes estratégias de backup:

- **PITR (Point-in-Time Recovery)**: Está ativado para permitir a recuperação de dados a qualquer momento nos últimos 35 dias, fornecendo uma proteção robusta contra alterações ou exclusões acidentais.
  
- **Backups Automatizados com AWS Backup**: Um plano de backup automatizado foi criado utilizando o **AWS Backup**, cobrindo as 3 tabelas DynamoDB. Os backups são realizados de forma:
  - **Diária**: Backups automáticos diários garantem que os dados mais recentes estejam sempre protegidos.
  - **Mensal**: Um backup mensal é mantido para garantir a retenção de longo prazo.

### 5.2. Backup do Bucket S3

O bucket **lacfas-audio-bucket**, que armazena os arquivos de áudio, também está incluído no plano de backup automatizado utilizando **AWS Backup**. 

- **Backups Diários e Mensais**: O bucket é incluído no mesmo plano de backup das tabelas DynamoDB, garantindo que os áudios armazenados estejam protegidos contra perda ou falhas.

### 5.3. Monitoramento e Testes de Backup

- **Monitoramento**: O status dos backups é monitorado por meio do **Amazon CloudWatch** e relatórios são gerados para garantir que os backups sejam concluídos com sucesso.
- **Teste de Restauração**: Realizamos testes periódicos de restauração para garantir a integridade e disponibilidade dos backups em caso de necessidade de recuperação de dados.

Essas medidas garantem uma proteção completa dos dados e arquivos, oferecendo segurança adicional contra falhas ou incidentes.

## 6. Logs e Monitoramento

A API conta com um robusto sistema de logs e monitoramento utilizando o **Amazon CloudWatch**, garantindo a visibilidade das operações e facilitando a detecção de anomalias e incidentes de segurança.

### 6.1. Logs das Funções Lambda

Cada função Lambda da API possui um **Log Group** dedicado no **CloudWatch Logs**, onde todas as atividades e eventos relacionados às funções são registrados. Isso permite:
- Monitoramento em tempo real das execuções.
- Armazenamento de logs históricos para auditoria.
- Detecção rápida de falhas ou erros operacionais.

### 6.2. CloudWatch Contributor Insights para DynamoDB

Para otimizar o monitoramento das tabelas DynamoDB, o **CloudWatch Contributor Insights for DynamoDB** está ativado para todas as tabelas. Ele permite:
- Identificação dos padrões de uso e principais contribuidores para picos de acesso e latência.
- Detecção de anomalias e comportamento incomum nas operações das tabelas.
- Monitoramento contínuo de métricas críticas, como taxa de solicitação e uso de capacidade.

### 6.3. Access Logging da API

O **Access Logging** da API está ativado, e os logs são registrados no grupo de logs **api-logging**. Esses logs contêm as seguintes informações:
- **Request ID**: `"requestId":"$context.requestId"`
- **Endereço IP do Cliente**: `"ip": "$context.identity.sourceIp"`
- **Data e Hora da Solicitação**: `"requestTime":"$context.requestTime"`
- **Método HTTP**: `"httpMethod":"$context.httpMethod"`
- **Rota da Solicitação**: `"routeKey":"$context.routeKey"`
- **Status da Resposta**: `"status":"$context.status"`
- **Protocolo HTTP**: `"protocol":"$context.protocol"`
- **Tamanho da Resposta**: `"responseLength":"$context.responseLength"`

Esses logs são fundamentais para:
- Monitorar o tráfego de solicitações para a API.
- Realizar auditorias de segurança e conformidade.
- Detectar padrões de acesso suspeitos ou anomalias.

### 6.4. Detecção de Anomalias

A API utiliza o **CloudWatch Anomaly Detection** nos logs de acesso para identificar padrões incomuns e detectar anomalias. Isso ajuda a garantir:
- Detecção proativa de comportamentos anormais, como picos de tráfego ou tentativas de acessos maliciosos.
- Alertas automáticos quando um padrão anômalo é detectado, permitindo ações rápidas para mitigar incidentes.

Com essas medidas de monitoramento e logs em vigor, a API está protegida contra incidentes inesperados e permite uma resposta rápida a qualquer evento anômalo ou falha operacional.
