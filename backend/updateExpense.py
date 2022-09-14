import json
import boto3
import urllib3

http = urllib3.PoolManager()

dynamodb_table = boto3.resource('dynamodb').Table('user_expense')

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
    expense_id=event['body']['id']
    amount = event['body']['amount']
    # category_id=event['body']['category_id']
    date=event['body']['date']
    name= event['body']['name']
    
    try:
        
        dynamodb_table.update_item(
        Key={'id': expense_id},
            UpdateExpression="set amount=:val1,#d=:val3",
            ExpressionAttributeValues={
                ':val1': amount,':val3':date},
            ExpressionAttributeNames={
                "#d": "date"
            },
            ReturnValues="UPDATED_NEW")
        return {"success": True}
    
    except Exception as e:
        raise e
        return {"success":False}
    
    

   