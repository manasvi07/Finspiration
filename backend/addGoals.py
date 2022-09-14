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
    random = uuid.uuid4()
    random=str(random)
    try:
        dynamodb_table.put_item(
            Item={
                'id':random,
                'name':event['body']['name'],
                'target':event['body']['target'],
                'achieved': bool(0)
            }
             
        )
        return {'statusCode': 201,'body': json.dumps('Monthly Budget Successfully Added')}
    except:
        return {'statusCode': 400,'body': json.dumps('Monthly Budget Successfully Added')}
        
    
   