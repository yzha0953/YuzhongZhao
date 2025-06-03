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

    # modify the code to print the length of the image bytes
    print('Length of image bytes:', len(image_bytes))

    # try to decode the image
    try:
        img_np = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
        print('Image shape:', img.shape)
    except Exception as e:
        print('Error decoding image:', e)
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Invalid image data'})
        }

    tags = object_detection.detect_img(image_bytes)
    print('tags:{}'.format(tags))

    # check if no tags detected
    if not tags:
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'No tags detected in the image',
                'links': []
            }),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*'
            }
        }

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
