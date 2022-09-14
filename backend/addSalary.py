import json
import boto3
import urllib3

http = urllib3.PoolManager()

dynamodb_table = boto3.resource('dynamodb').Table('users')

def lambda_handler(event, context):
    # TODO implement
    access_token = event['headers']['accesstoken']
    
    response = http.request('POST',
        "https://cognito-idp.us-east-1.amazonaws.com/",
        body = json.dumps({"AccessToken": access_token}),
        headers = {'Content-Type': 'application/x-amz-json-1.1',
                   'X-Amz-Target': 'AWSCognitoIdentityProviderService.GetUser'},
        retries = False)
    
    user_attributes = json.loads(response.data)
    user_id = user_attributes['Username']
    salary = event['body']['salary']
    
    try:
        salary = int(salary)
    except:
        return {"success":False}
    
    dynamodb_table.update_item(
        Key={'Id': user_id},
            UpdateExpression="set salary=:r",
            ExpressionAttributeValues={
                ':r': salary},
            ReturnValues="UPDATED_NEW")
    

    return {"success": True}