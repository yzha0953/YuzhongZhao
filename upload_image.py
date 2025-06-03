import json
import os
import boto3
import base64
import cv2
import numpy as np
import uuid

s3 = boto3.client('s3')
bucket = 'a3-group5-bucket'
width = 100
def lambda_handler(event, context):
    data = json.loads(event['body'])
    username = data['username']
    filename = data['filename']
    image = data['image']
    print(filename)
    _, suffix = os.path.splitext(filename)
    id = str(uuid.uuid4())
    
    key = f'images/{username}/{id}{suffix}'
    image_bytes = base64.b64decode(image) 
    thumbnail_bytes = to_thumbnail(image_bytes, suffix)
    thumbnail_key = f'thumbnail/{username}/{id}{suffix}'
    
    s3.put_object(Bucket=bucket, Key=key, Body=image_bytes, ContentType='mimetype', ContentDisposition = 'inline')
    s3.put_object(Bucket=bucket, Key=thumbnail_key, Body=thumbnail_bytes, ContentType='mimetype', ContentDisposition = 'inline')
    
    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps('Image has been uploaded'),
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*'
        }
    }
    
def to_thumbnail(image_bytes, suffix):
    #converts the binary image data into a NumPy array
    #image_npary = np.asarray(bytearray(image_bytes), np.uint8)
    image_npary = np.fromstring(image_bytes, np.uint8)
    #decodes the NumPy array 
    image_decoded = cv2.imdecode(image_npary, cv2.IMREAD_COLOR)
    height = int(image_decoded.shape[0] * (width / image_decoded.shape[1]))
    thumbnail = cv2.resize(image_decoded,(width,height),interpolation= cv2.INTER_AREA)
    _, buffer = cv2.imencode(suffix,thumbnail)
    thumbnail_bytes = buffer.tobytes()
    return thumbnail_bytes