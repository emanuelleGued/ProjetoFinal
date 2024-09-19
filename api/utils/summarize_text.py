# Use the native inference API to send a text message to Amazon Titan Text G1 - Express.

import boto3
import json

from botocore.exceptions import ClientError

# Create an Amazon Bedrock Runtime client.
brt = boto3.client("bedrock-runtime")

def summarize_text(text):
    # Set the model ID, e.g., Amazon Titan Text G1 - Express.
    model_id = "amazon.titan-text-express-v1"

    prompt_instructions = (
        "Summarize this text in a concise and easy undertanding manner."
        " Separate the annex in paragraphs, example: Annex 1: summary of annex 1,"
        "Annex 2: summary of annex 2 and so on ..."
        "Generate the text in brasilian portuguese."
    )

    # Define the prompt for the model.
    prompt = f'{prompt_instructions} : {text}'

    # Format the request payload using the model's native structure.
    native_request = {
        "inputText": prompt,
        "textGenerationConfig": {
            "maxTokenCount": 512,
            "temperature": 0.5,
            "topP": 0.9
        },
    }

    # Convert the native request to JSON.
    request = json.dumps(native_request)
    try:
        # Invoke the model with the request.
        response = brt.invoke_model(modelId=model_id, body=request)
    except (ClientError, Exception) as e:
        print(f"ERROR: Can't invoke '{model_id}'. Reason: {e}")
        exit(1)
    # Decode the response body.
    model_response = json.loads(response["body"].read())
    
    # Extract and print the response text.
    response_text = model_response["results"][0]["outputText"]
    return response_text