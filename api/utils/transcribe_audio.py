import json
import boto3
import time
import logging
import requests
import os

# Inicializa o cliente do AWS Transcribe
transcribe = boto3.client('transcribe')
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Nome do bucket S3
BUCKET_NAME = os.environ['S3_BUCKET_NAME']

def transcribe_audio_handler(event, context):
    logger.info("Transcrição de áudio iniciada")
    logger.info(f"Evento recebido: {json.dumps(event)}")  

    try:
        # Analisa o corpo do evento
        body = json.loads(event.get("body", "{}"))
        audio_file_url = body["audio_file_path"]  
        print(audio_file_url)
        object_key = audio_file_url.split(f"https://{BUCKET_NAME}.s3.amazonaws.com/audios/")[1]
        print(object_key)
    except KeyError:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "audio_file_path is required"})
        }
    except IndexError:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Invalid audio_file_path format"})
        }

    # Iniciar o trabalho de transcrição
    job_name = "transcription-job-" + str(int(time.time())) 
    response = transcribe.start_transcription_job(
        TranscriptionJobName=job_name,
        MediaFormat= 'mp4',
        Media={'MediaFileUri': audio_file_url},
        OutputBucketName=BUCKET_NAME,
        LanguageCode='pt-BR'
    )

    logger.info(f"Transcrição iniciada: {response}")

    # Aguarda a conclusão do trabalho de transcrição
    while True:
        status_response = transcribe.get_transcription_job(TranscriptionJobName=job_name)
        status = status_response['TranscriptionJob']['TranscriptionJobStatus']
        logger.info(f"Status do trabalho de transcrição: {status}")

        if status in ['COMPLETED', 'FAILED']:
            break
        time.sleep(5)  # Espera 5 segundos antes de verificar novamente

    # Se a transcrição foi concluída com sucesso, recupera o texto
    if status == 'COMPLETED':
        transcription_url = status_response['TranscriptionJob']['Transcript']['TranscriptFileUri']
        transcript_response = requests.get(transcription_url)
        transcript = transcript_response.json()
        text_transcription = transcript['results']['transcripts'][0]['transcript']

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Transcrição concluída com sucesso!",
                "transcription": text_transcription
            }),
        }
    else:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Transcrição falhou"})
        }
