import json
import boto3
import urllib3
import uuid
from boto3.dynamodb.conditions import Key

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
    
    user_attributes = json.loads(response.data)
    user_id = user_attributes['Username']
    print(user_attributes)

    try:
        response = dynamodb_table.scan()
        goals = [] 
        for row in response['Items']:
            if 'user_id' in row:  
                if row['user_id'] == user_id:
                    goals.append(row)

        if not goals:
            empty_res = {"Investments":[]}
            return {'statusCode': 201,'body': json.dumps(empty_res)}
        else:
            return {'statusCode': 201,'body': json.dumps({"Investments":goals})}
    except Exception as e:
        print(e)
        return {'statusCode': 400,'body': json.dumps("unable to fetch investments")}
        
    
   