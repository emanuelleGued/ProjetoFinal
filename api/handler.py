import json


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
