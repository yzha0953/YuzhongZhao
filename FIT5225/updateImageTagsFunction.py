import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('images')


def lambda_handler(event, context):
    # get data from the event
    data = json.loads(event['body'])
    urls = data['url']
    tags = data['tags']
    update_type = data['type']  # 1 for add, 0 for remove

    # initialise log and updated_tags
    log = []
    updated_tags = {}

    # update tags for each URL
    for url in urls:
        # get username and key from the URL
        parts = url.split('/')
        if len(parts) >= 6 and parts[2] == 'a3-group5-bucket.s3.amazonaws.com' and parts[3] == 'thumbnail':
            username = parts[4]
            file_name = parts[5]
            key = f"images/{username}/{file_name}"
        else:
            log.append(f"Invalid URL format: {url}")
            continue  # if the URL is invalid, skip to the next URL

        log.append(f"Processing URL: {url}, username: {username}, key: {key}")

        # get the item from DynamoDB
        response = table.get_item(Key={'username': username, 'key': key})
        log.append(f"GetItem response: {response}")

        if 'Item' in response:
            item = response['Item']
            item_tags = item.get('tags', [])
            if update_type == 1:
                # add the new tags
                item_tags.extend(tags)
                item_tags = list(set(item_tags))  # 去重
            elif update_type == 0:
                # remove the tags
                item_tags = [tag for tag in item_tags if tag not in tags]
            log.append(f"Updated tags: {item_tags}")

            # update the item in DynamoDB
            update_response = table.update_item(
                Key={'username': username, 'key': key},
                UpdateExpression='SET tags = :val1',
                ExpressionAttributeValues={':val1': item_tags},
                ReturnValues="UPDATED_NEW"
            )
            log.append(f"UpdateItem response: {update_response}")
            updated_tags[url] = item_tags  # add the updated tags to the dictionary
        else:
            log.append(f"Item not found: {url}")

    # return the response
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': 'Tags updated successfully',
            'log': log,
            'updated_tags': updated_tags  # return the updated tags for each URL
        }),
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*'
        }
    }
