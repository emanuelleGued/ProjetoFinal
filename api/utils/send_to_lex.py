import boto3
import os

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
    print(messages)
    
    if messages:
        combined_text = ""
        audio_urls = []

        for message in messages:
            if message['contentType'] == 'ImageResponseCard':
                card = format_response_card(message)
                return card

            if message['contentType'] == 'PlainText':
                if message.get('content').startswith('http'):
                    audio_urls.append(message.get('content'))
                else:
                    combined_text += message.get('content') + "\n"
        
        response_data = {'text': combined_text.strip()}

        if audio_urls:
            response_data['audio'] = "\n".join(audio_urls)

        return response_data

    return {"text": 'Desculpe, não entendi'}

def format_response_card(message):
    # Formatar o card para o Slack usando Block Kit
    return {
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    # Usar o método .get() para evitar KeyError caso 'subtitle' não exista
                    "text": f"{message['imageResponseCard']['title']}\n{message['imageResponseCard'].get('subtitle', '')}"
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
                        "action_id": button['value']  # Identifica o botão pelo valor de ação
                    } for button in message['imageResponseCard']['buttons']
                ]
            }
        ]
    }
