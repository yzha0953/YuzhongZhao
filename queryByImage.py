import json
import boto3
from io import BytesIO
import numpy as np
import base64
import cv2
import object_detection

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('images')

def lambda_handler(event, context):
    data = json.loads(event['body'])
    image = data['image']
    image_bytes = base64.b64decode(image)

    tags = object_detection.detect_img(image_bytes)
    print('tags:{}'.format(tags))
    
    # Scan DynamoDB to match tags
    response = table.scan()
    items = response['Items']
    result = []
    s3_base_url = "https://a3-group5-bucket.s3.amazonaws.com/"

    for item in items:
        item_tags = item.get('tags', [])
        if all(tag in item_tags for tag in tags):
            thumbnail_path = item['key'].replace("images/", "thumbnail/", 1)
            s3_url = s3_base_url + thumbnail_path
            result.append(s3_url)

    if result:
        message = "The related images are below:"
    else:
        message = "There are no related images like you uploaded."

    # Return both the list of links and a user-friendly message
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': message,
            'links': result
        }),
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*'
        }
    }
