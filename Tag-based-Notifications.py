import json
import boto3

TOPIC_ARN = 'arn:aws:sns:us-east-1:685927166174:5225-A3'
sns_client = boto3.client('sns')

def lambda_handler(event, context):
    data = json.loads(event['body'])
    username = data['username']
    email = data['email']
    tags = data['tags']  # Expecting a list of tags

    # Retrieve the current subscriptions to the topic
    response = sns_client.list_subscriptions_by_topic(TopicArn=TOPIC_ARN)
    subscription_arn = None

    # Check if the email already has a subscription
    for subscription in response['Subscriptions']:
        if subscription['Endpoint'] == email:
            subscription_arn = subscription['SubscriptionArn']
            break

    if subscription_arn:
        # Update existing subscription if it exists
        attributes = sns_client.get_subscription_attributes(SubscriptionArn=subscription_arn)
        filter_policy = json.loads(attributes['Attributes'].get('FilterPolicy', '{}'))

        # Ensure the 'tag' attribute is in the filter policy and update it
        updated = False
        if 'tag' not in filter_policy:
            filter_policy['tag'] = []
        for tag in tags:
            if tag not in filter_policy['tag']:
                filter_policy['tag'].append(tag)
                updated = True

        if updated:
            sns_client.set_subscription_attributes(
                SubscriptionArn=subscription_arn,
                AttributeName='FilterPolicy',
                AttributeValue=json.dumps(filter_policy)
            )
            message = f'Successfully updated subscription for {email} to include new tags.'
        else:
            message = f'No new tags added; already subscribed to given tags for {email}.'
    else:
        # Create new subscription if no existing one is found
        sns_client.subscribe(
            TopicArn=TOPIC_ARN,
            Protocol='email',
            Endpoint=email,
            Attributes={
                'FilterPolicy': json.dumps({
                    'tag': tags,
                    'username': [username]
                })
            }
        )
        message = f'Created new subscription for {email} with tags: {", ".join(tags)}.'

    # Return a detailed response about the current subscription status
    return {
        'statusCode': 200,
        'body': json.dumps({'message': message, 'currentSubscriptionTags': filter_policy.get('tag', [])}),
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*'
        }
    }
