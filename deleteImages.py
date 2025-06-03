import json
import boto3

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('images')

def lambda_handler(event, context):
    data = json.loads(event['body'])
    urls = data['url']
    log = []
    deleted_items = []

    for url in urls:
        parts = url.split('/')
        if len(parts) >= 6 and parts[2] == 'a3-group5-bucket.s3.amazonaws.com' and parts[3] == 'thumbnail':
            bucket_dir = "a3-group5-bucket"
            username = parts[4]
            file_name = parts[5]
            key = f"images/{username}/{file_name}"
        else:
            log.append(f"Invalid URL format: {url}")
            continue

        log.append(f"Processing URL: {url}, bucket_dir: {bucket_dir}, username: {username}, key: {key}, file_name: {file_name}")

        # Delete item from DynamoDB
        try:
            delete_response = table.delete_item(
                Key={'username': username, 'key': key},
                ReturnValues='ALL_OLD'
            )
            log.append(f"DeleteItem response: {delete_response}")

            if 'Attributes' in delete_response:
                deleted_items.append(url)
            else:
                log.append(f"No such item in DynamoDB: {url}")
                continue  # Skip S3 deletion if DynamoDB item doesn't exist
        except Exception as e:
            log.append(f"Error deleting item from DynamoDB: {e}")
            continue

        # Delete objects from S3
        try:
            bucket_name = 'a3-group5-bucket'
            image_path = f'images/{username}/{file_name}'
            thumbnail_path = f'thumbnail/{username}/{file_name}'
            s3.delete_object(Bucket=bucket_name, Key=image_path)
            log.append(f"Deleted S3 image object: {image_path}")
            s3.delete_object(Bucket=bucket_name, Key=thumbnail_path)
            log.append(f"Deleted S3 thumbnail object: {thumbnail_path}")
        except Exception as e:
            log.append(f"Error deleting object from S3: {e}")

    if deleted_items:
        message = 'Images deleted successfully'
    else:
        message = 'No such image'

    return {
        'statusCode': 200,
        'body': json.dumps({'message': message, 'deleted_items': deleted_items, 'log': log}),
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*'
        }
    }
