import datetime
import os
import hashlib
import json
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
from utils.convert_text_to_speech import convert_text_to_speech_and_upload
import logging

# Configuração do logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

load_dotenv()

# Pegar variáveis do ambiente
table_name = os.getenv("DYNAMODB_TABLE")

# Configuração do boto3 para acessar o DynamoDB
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    logger.info("Lambda handler iniciado")
    logger.info(f"Evento recebido: {json.dumps(event)}")

    try:
        body = json.loads(event.get("body", "{}"))
        # Verifica se o evento é uma verificação de URL do Slack
        if body.get("type") == "url_verification":
            logger.info("Verificação de URL do Slack recebida")
            return {
                "statusCode": 200,
                "body": json.dumps({"response": body.get("challenge")}),
            }

        # Verifica se o evento é uma requisição para o TTS
        if body.get("phrase"):
            return v1_tts(event, context)
        else:
            raise ValueError("Phrase is required in the body of the request.")

    except ValueError as e:
        logger.error(f"Erro de validação: {str(e)}", exc_info=True)
        return {
            "statusCode": 400,
            "body": json.dumps({"message": str(e)}),
        }

    except Exception as e:
        logger.error(f"Erro inesperado: {str(e)}", exc_info=True)
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal server error", "error": str(e)}),
        }

def v1_tts(event, context):
    logger.info("Processando requisição TTS")

    try:
        # Extrair o corpo da requisição
        body = json.loads(event.get("body", "{}"))
        phrase = body.get("phrase")

        if not isinstance(phrase, str):
            raise ValueError("The 'phrase' must be a string.")

        # Gerar um hash único para a frase
        hash_id = hashlib.md5(phrase.encode("utf-8")).hexdigest()
        logger.info(f"Hash gerado: {hash_id}")

        # Verificar se o hash já existe no DynamoDB
        response = table.get_item(Key={"id": hash_id})
        if "Item" in response:
            logger.info("Hash encontrado no DynamoDB")
            # Se o hash já existir, retornar a URL do áudio
            audio_url = response["Item"]["audio_url"]
            body = {
                "received_phrase": phrase,
                "url_to_audio": audio_url,
                "created_audio": table.get_item(Key={"id": hash_id})["Item"][
                    "created_at"
                ],
                "unique_id": hash_id,
            }

        else:
            logger.info("Hash não encontrado, gerando novo áudio")
            # Se o hash não existir, converter a frase em áudio e salvar a referência no DynamoDB
            audio_url = convert_text_to_speech_and_upload(phrase, hash_id)

            # Salvar o novo item no DynamoDB
            table.put_item(
                Item={"id": hash_id, "phrase": phrase, "audio_url": audio_url, "created_at": str(datetime.datetime.now())}
            )

            body = {
                "received_phrase": phrase,
                "url_to_audio": audio_url,
                "created_audio": table.get_item(Key={"id": hash_id})["Item"][
                    "created_at"
                ],
                "unique_id": hash_id,
            }

        logger.info("Requisição TTS processada com sucesso")
        return {
            "statusCode": 200,
            "body": json.dumps(body)
        }

    except ClientError as e:
        logger.error(f"Erro do DynamoDB: {str(e)}", exc_info=True)
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "DynamoDB error", "error": str(e)}),
        }

    except Exception as e:
        logger.error(f"Erro ao gerar e fazer upload do áudio: {str(e)}", exc_info=True)
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Error generating and uploading audio", "error": str(e)}),
        }
