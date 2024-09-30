import boto3
import json
from botocore.exceptions import ClientError

# Cria um cliente do Bedrock Runtime diretamente
brt = boto3.client("bedrock-runtime")

def generate_dynamic_question(context):
    model_id = "amazon.titan-text-express-v1"
    
    prompt_instructions = (
        "Elabore esta pergunta de forma correta, "
    )

    prompt = f'{prompt_instructions}: {context}'

    native_request = {
        "inputText": prompt,
        "textGenerationConfig": {
            "maxTokenCount": 70,
            "temperature": 0.3,
            "topP": 0.3
        },
    }

    request = json.dumps(native_request)
    try:
        response = brt.invoke_model(modelId=model_id, body=request, contentType='application/json')
    except (ClientError, Exception) as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Can't invoke '{model_id}'. Reason: {str(e)}"})
        }

    model_response = json.loads(response["body"].read())
    response_text = model_response["results"][0]["outputText"]
    return {
        "statusCode": 200,
        "body": json.dumps({"question": response_text})
    }
