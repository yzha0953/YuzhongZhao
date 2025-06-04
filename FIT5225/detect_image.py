import json
import os
import boto3
import base64
import cv2
import numpy as np
import object_detection
TOPIC_ARN = 'arn:aws:sns:us-east-1:685927166174:5225-A3'
sns_client = boto3.client('sns')

s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
TABLE_NAME = 'images'

def lambda_handler(event, context):
    for record in event["Records"]:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']
        username = key.split("/")[1]
        img_obj = s3_client.get_object(Bucket = bucket, Key = key)
        img = img_obj["Body"].read()
        tags = object_detection.detect_img(img)

        print('tags:{}'.format(tags))
        
        table = dynamodb.Table(TABLE_NAME)
        
        print(table.put_item(Item = {
            "username": username,
            "key": key,
            "tags": tags
        }))
        
        # Publish a message to SNS
        message = f'{username} has uploaded an image with tags: {", ".join(tags)}, image URL: {key}'
        
        for tag in tags:
            print('tag:',tag)
            sns_client.publish(
                TopicArn=TOPIC_ARN,
                Message=message,
                Subject='New Image Processed',
                MessageAttributes={
                    'tag':{
                        'DataType': 'String',
                        'StringValue': tag
                    },
                    'username':{
                        'DataType': 'String',
                        'StringValue': username
                    }
                }
            )
            
