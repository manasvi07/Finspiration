import json
import boto3
import urllib3
import uuid

http = urllib3.PoolManager()

dynamodb_table = boto3.resource('dynamodb').Table('goals')

def lambda_handler(event, context):
    # TODO implement
    access_token = event['headers']['accesstoken']
    
    response = http.request('POST',
        "https://cognito-idp.us-east-1.amazonaws.com/",
        body = json.dumps({"AccessToken": access_token}),
        headers = {'Content-Type': 'application/x-amz-json-1.1',
                   'X-Amz-Target': 'AWSCognitoIdentityProviderService.GetUser'},
        retries = False)
    
    print(event['body'])
    user_attributes = json.loads(response.data)
    user_id = user_attributes['Username']
    goal_name = event['body']['name']
    try:
        dynamodb_table.delete_item(Key={'user_id': user_id, 'name': goal_name})
        
        return {'statusCode': 201,'body': json.dumps('Goals Successfully Delete')}
    except:
        return {'statusCode': 400,'body': json.dumps('Unable to delete goal')}
        
    
   