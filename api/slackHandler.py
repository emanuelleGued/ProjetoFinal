import json
import boto3
import os
import requests
from urllib.parse import unquote

s3_client = boto3.client('s3')

def lambda_handler(event, context):
    try:
        slack_event = json.loads(event['body'])

        # Verificação do evento para o tipo 'url_verification'
        if slack_event.get('type') == 'url_verification':
            return {
                'statusCode': 200,
                'body': json.dumps({'challenge': slack_event.get('challenge')})
            }

        # Verificar se o evento tem texto e não é uma mensagem enviada pelo bot
        if 'event' in slack_event:
            event_data = slack_event['event']
            
            # Verifica se a mensagem foi enviada por um bot (bot_id presente)
            if 'bot_id' in event_data:
                
                return {
                    'statusCode': 200,
                    'body': json.dumps({'message': "Mensagem do bot ignorada."})
                }

            # Se a mensagem foi enviada por um usuário (sem bot_id)
            if 'user' in event_data and 'text' in slack_event['event']:

                # Se o evento contém arquivos e o arquivo é uma imagem
                if 'files' in slack_event['event'] and len(slack_event['event']['files']) > 0:
                    file = slack_event['event']['files'][0]

                    if file['mimetype'].startswith("image/"):

                        # Download da imagem e upload para o S3
                        file_url = unquote(file['url_private_download'])  # URL privada para download
                        headers = {"Authorization": f"Bearer {os.environ['SLACK_TOKEN']}"}
                        img_data = requests.get(file_url, headers=headers).content

                        image_key = file['id']  # Apenas o ID da imagem para simplificação
                        s3_client.put_object(
                            Bucket=os.environ['S3_BUCKET_NAME'],
                            Key=f"comprovantes/{image_key}.png",  # Nome do arquivo como chave no S3
                            Body=img_data,
                            ContentType=file['mimetype']
                        )

                        # Modifica o texto do evento com a chave do comprovante
                        slack_event['event']['text'] = f"aqui está o comprovante {image_key}"

                try:
                    # Extrai mensagens do Slack
                    text = slack_event['event']['text']
                    user = slack_event['event']['user']
                    channel = slack_event['event']['channel']

                    # Envia para o Lex
                    lex_response = post_to_lex(text, user)

                    # Envia resposta do Lex para o Slack
                    send_to_slack(lex_response, channel)

                    return {
                        'statusCode': 200,
                        'body': json.dumps({
                            'message': "Evento processado e enviado ao backend.",
                            'lexResponse': lex_response
                        })
                    }
                except requests.RequestException as error:
                    print(f"Erro ao encaminhar a mensagem para o Lex: {error}")
                    return {
                        'statusCode': 500,
                        'body': json.dumps({'message': 'Erro ao encaminhar a mensagem ao Lex.'})
                    }

        return {
            'statusCode': 200,
            'body': json.dumps({'message': "Nenhum texto ou arquivo encontrado na mensagem."})
        }

    except KeyError as error:
        print(f"Erro de chave: {error}")
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Estrutura de evento inesperada.'})
        }
    except Exception as error:
        print(f"Erro inesperado: {error}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Erro interno no servidor.'})
        }
        
def post_to_lex(text, user_id):
    lex_client = boto3.client('lexv2-runtime')
    
    response = lex_client.recognize_text(
        botId=os.environ.get('LEX_BOT_ID'),          
        botAliasId=os.environ.get('LEX_BOT_ALIAS_ID'),
        localeId=os.environ.get('LEX_LOCALE_ID', 'pt_BR'), 
        sessionId=user_id,
        text=text
    )
    
    messages = response.get('messages', [])
    
    if messages:
        for message in messages:
            if message['contentType'] == 'ImageResponseCard':
                # Formatar o card para o Slack usando Block Kit
                card = {
                    "blocks": [
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": f"*{message['imageResponseCard']['title']}*"
                            }
                        },
                        {
                            "type": "actions",
                            "elements": [
                                {
                                    "type": "button",
                                    "text": {
                                        "type": "plain_text",
                                        "text": button['text']
                                    },
                                    "value": button['value'],
                                    "action_id": button['value'] 
                                } for button in message['imageResponseCard']['buttons']
                            ]
                        }
                    ]
                }
                return card

            if message['contentType'] == 'PlainText':
                return {"text": message.get('content')}

    return {"text": 'Desculpe, não entendi'}


def send_to_slack(message, channel):
    slack_token = os.environ['SLACK_TOKEN']
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {slack_token}'
    }
    payload = {
        'channel': channel,
        'blocks': message.get('blocks', []),
        'text': message.get('text', '')
    }
    response = requests.post(
        'https://slack.com/api/chat.postMessage',
        headers=headers,
        json=payload
    )
    return response.json()


