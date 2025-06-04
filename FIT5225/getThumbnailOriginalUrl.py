import json
import boto3

s3 = boto3.client('s3')
bucket_name = 'a3-group5-bucket'
thumbnail_dir = 'thumbnail/'
images_dir = 'images/'

def lambda_handler(event, context):
    # get URL
    thumbnail_url = json.loads(event['body']).get('thumbnail_url')

    # get user_name and thumbnail_name
    parts = thumbnail_url.split('/')
    user_name = parts[-2]
    thumbnail_name = parts[-1]

    print(f"Extracted user_name: {user_name}")
    print(f"Extracted thumbnail_name: {thumbnail_name}")

    # check if user folder exists
    try:
        response = s3.list_objects(Bucket=bucket_name, Prefix=f'{thumbnail_dir}{user_name}/', Delimiter='/')
        if 'Contents' not in response:
            return {
                'statusCode': 404,
                'body': json.dumps({'message': 'User not found'}),
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Headers': '*'
                }
            }
    except s3.exceptions.ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Error checking user folder'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*'
            }
        }

    # check if thumbnail exists
    try:
        s3.head_object(Bucket=bucket_name, Key=f'{thumbnail_dir}{user_name}/{thumbnail_name}')
    except s3.exceptions.ClientError as e:
        if e.response['Error']['Code'] == '404':
            return {
                'statusCode': 404,
                'body': json.dumps({'message': 'Thumbnail not found'}),
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Headers': '*'
                }
            }
        else:
            raise e

    # establish original URL
    original_url = f's3://{bucket_name}/{images_dir}{user_name}/{thumbnail_name}'
    print(f"Constructed original_url: {original_url}")

    return {
        'statusCode': 200,
        'body': json.dumps({'original_url': original_url}),
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*'
        }
    }