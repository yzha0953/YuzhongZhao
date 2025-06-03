import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('images')


def lambda_handler(event, context):
    # 从 API Gateway 事件获取查询标签
    request_body = json.loads(event['body'])
    tags = request_body.get('tags', [])

    # 扫描DynamoDB并匹配标签
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

    return {
        'statusCode': 200,
        'body': json.dumps({
            'links': result
        }),
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*'
        }
    }
