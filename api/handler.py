import json
import boto3
from botocore.exceptions import ClientError
from utils.generate_dynamic_question import generate_dynamic_question

# Inicializa o cliente DynamoDB
dynamodb = boto3.resource('dynamodb')
cadastro_idosos_table = dynamodb.Table('CadastroIdosos')
cadastro_voluntarios_table = dynamodb.Table('CadastroVoluntarios')

def health(event, context):
    body = {
        "message": "Go Serverless v4.1! Your function executed successfully!",
        "input": event,
    }

    response = {"statusCode": 200, "body": json.dumps(body)}

    return response


def v1_description(event, context):
    body = {"message": "TTS api version 1."}

    response = {"statusCode": 200, "body": json.dumps(body)}

    return response

def persist_idoso(event, context):
    try:
        data = json.loads(event['body'])
        response = cadastro_idosos_table.put_item(Item=data)
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Cadastro de Idoso salvo com sucesso!', 'response': response})
        }
    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

def persist_voluntario(event, context):
    try:
        data = json.loads(event['body'])
        response = cadastro_voluntarios_table.put_item(Item=data)
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Cadastro de Voluntário salvo com sucesso!', 'response': response})
        }
    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
    
def generate_dynamic_question_handler(event, context):
    try:
        body = json.loads(event['body'])
        text = body.get('context', None)
        if not text:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Context is required."})
            }
        
        # Gera a pergunta
        return generate_dynamic_question(text)
    except (json.JSONDecodeError, KeyError):
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Invalid input format."})
        }

