import boto3
import json
from dotenv import load_dotenv
import os

# Carregar variáveis do arquivo .env
load_dotenv()

# Pegar variáveis do ambiente
bucket_name = os.getenv("S3_BUCKET_NAME")
profile_name = os.getenv("PROFILE_NAME")

boto_session = boto3.Session(profile_name=profile_name)


def create_s3_bucket():
    s3_client = boto_session.client("s3")

    # Cria o bucket
    s3_client.create_bucket(Bucket=bucket_name)

    # Configura o bloqueio de acesso público
    s3_client.put_public_access_block(
        Bucket=bucket_name,
        PublicAccessBlockConfiguration={
            "BlockPublicAcls": False,
            "IgnorePublicAcls": False,
            "BlockPublicPolicy": False,
            "RestrictPublicBuckets": False,
        },
    )

    # Define a política do bucket para acesso público
    bucket_policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": f"arn:aws:s3:::{bucket_name}/*",
            }
        ],
    }

    s3_client.put_bucket_policy(Bucket=bucket_name, Policy=json.dumps(bucket_policy))

    print(f"Bucket {bucket_name} created successfully and policy applied.")


# Exemplo de uso
create_s3_bucket()
