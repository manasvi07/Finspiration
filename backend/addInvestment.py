import json
import boto3
import urllib3
import uuid

http = urllib3.PoolManager()

dynamodb_table = boto3.resource('dynamodb').Table('investments')

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
        type = event['body']['name']
        
        if type == "TFSA" or type == "RRSP":
            dynamodb_table.put_item(
                Item={
                    'id':random,
                    'user_id':user_id,
                    'type':event['body']['name'],
                    'amount':event['body']['amount'],
                }
                 
            )
            return {'statusCode': 201,'body': json.dumps('Investment Successfully Added')}
        else:
            return {'statusCode': 400,'body': json.dumps('Only RRSP and TFSA allowed')}
    except:
        return {'statusCode': 400,'body': json.dumps('Unable to add investment')}
        
    
   