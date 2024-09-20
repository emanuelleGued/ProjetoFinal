# Importações necessárias
import boto3
import json
from botocore.exceptions import ClientError


# Cria um cliente do Bedrock Runtime
brt = boto3.client("bedrock-runtime")


# Função para resumir um texto usando o Bedrock Runtime.
def summarize_text(text):

    # Define o modelo que será usado para resumir o texto.
    model_id = "amazon.titan-text-express-v1"

    # Define as instruções do prompt para resumir o texto.
    prompt_instructions = (
        "Resuma este texto de forma clara e concisa. "
        "O resumo deve ser fácil de entender, evitando jargões e termos complexos, a menos que sejam essenciais."
        "Deve apresentar as ideias principais de forma direta, sem divagações ou detalhes excessivos."
        "Foque nas informações mais relevantes, eliminando opiniões pessoais e comentários desnecessários."
        "Organize as informações de maneira lógica, podendo usar subtítulos ou separação em parágrafos para diferentes partes (como anexos)."
        "O resumo deve refletir com precisão o conteúdo e a intenção do texto original, sem distorcer informações."
        "As ideias devem fluir de forma lógica, facilitando a compreensão do leitor."
        "O tom do resumo deve ser consistente com o do texto original, seja formal, informal, técnico, etc."
        "limite de 512 tokens."
        "Gere o texto em português brasileiro: "
    )

    # Constrói o prompt com o texto e as instruções.
    prompt = f'{prompt_instructions}: {text}'

    native_request = {
        "inputText": prompt,
        "textGenerationConfig": {
            "maxTokenCount": 512,  # Aumente para mais detalhes
            "temperature": 0.3,      # Reduza para maior coerência
            "topP": 0.8              # Mantenha o foco nos pontos relevantes
        },
    }

    # Converte o prompt para um JSON e envia a solicitação ao Bedrock Runtime.
    request = json.dumps(native_request)
    try:
        response = brt.invoke_model(modelId=model_id, body=request, contentType='application/json')
    except (ClientError, Exception) as e:
        print(f"ERROR: Can't invoke '{model_id}'. Reason: {e}")
        exit(1)

    # Extrai o texto resumido do resposta do Bedrock Runtime.
    model_response = json.loads(response["body"].read())

    # Retorna o texto resumido.
    response_text = model_response["results"][0]["outputText"]
    return response_text
