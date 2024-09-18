import boto3
import os
from dotenv import load_dotenv

load_dotenv()

BUCKET_NAME = os.getenv("S3_BUCKET_NAME")

polly = boto3.client("polly")
s3 = boto3.client("s3")
comprehend = boto3.client("comprehend")


def detect_language(text):
    response = comprehend.detect_dominant_language(Text=text)
    languages = response["Languages"]
    if not languages:
        raise Exception("Unable to detect language.")
    return languages[0]["LanguageCode"]


def convert_text_to_speech_and_upload(phrase, hash_id):
    try:
        # Certifique-se de que 'phrase' é uma string
        if not isinstance(phrase, str):
            raise ValueError("O parâmetro 'phrase' deve ser uma string.")

        # Detectar o idioma do texto
        language_code = detect_language(phrase)

        # Mapear código de idioma para voz do Polly
        voice_id_map = {
            "en": "Joanna",  # Inglês
            "pt": "Camila",  # Português
        }

        voice_id = voice_id_map.get(language_code, "Joanna")

        # Converter texto em áudio usando Amazon Polly com SSML
        ssml_text = f'<speak><lang xml:lang="{language_code}">{phrase}</lang></speak>'

        response = polly.synthesize_speech(
            TextType="ssml", Text=ssml_text, OutputFormat="mp3", VoiceId=voice_id
        )

        # Verifique se o campo 'AudioStream' está na resposta
        if 'AudioStream' not in response:
            raise Exception("Erro ao gerar áudio: 'AudioStream' não encontrado na resposta.")

        # Salvar o áudio no S3
        audio_file = f"{hash_id}.mp3"
        s3.put_object(Bucket=BUCKET_NAME, Key=audio_file, Body=response["AudioStream"].read())

        # Gerar a URL do áudio
        audio_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{audio_file}"

        return audio_url
    except Exception as e:
        raise Exception("Error generating and uploading audio: " + str(e))
