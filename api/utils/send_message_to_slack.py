import requests
import os

def send_to_slack(lex_response, channel):
    # Combinar texto e áudio (se houver) em uma única mensagem
    message_content = lex_response.get('text', '')

    if 'audio' in lex_response:
        message_content += f"\nÁudio(s) recebido(s): {lex_response['audio']}"

    # Se houver blocos (como cards interativos), incluir os blocos
    if 'blocks' in lex_response:
        slack_message = {
            "channel": channel,
            "text": "Aqui está o que encontrei para você:",  # Mensagem obrigatória
            "blocks": lex_response['blocks']
        }
    else:
        slack_message = {
            "channel": channel,
            "text": message_content if message_content else "Aqui está a resposta.",
        }

    # Envio da mensagem ao Slack
    response = requests.post(
        'https://slack.com/api/chat.postMessage',
        headers={'Authorization': f"Bearer {os.environ.get('SLACK_TOKEN')}"},
        json=slack_message
    )
    print(f"Slack response: {response.json()}")