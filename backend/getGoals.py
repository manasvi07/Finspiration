import json
import boto3
import urllib3
import uuid

http = urllib3.PoolManager()

dynamodb_table = boto3.resource('dynamodb').Table('goals')

def lambda_handler(event, context):
    # TODO implement
    print(event)
    access_token = event['headers']['accesstoken']
    
    response = http.request('POST',
        "https://cognito-idp.us-east-1.amazonaws.com/",
        body = json.dumps({"AccessToken": access_token}),
        headers = {'Content-Type': 'application/x-amz-json-1.1',
                   'X-Amz-Target': 'AWSCognitoIdentityProviderService.GetUser'},
        retries = False)
    user_attributes = json.loads(response.data)
    print(user_attributes)
    user_id = user_attributes['Username']
    try:
        response = dynamodb_table.scan()
        print(response)
        goals = [] 
        for row in response['Items']:
            if 'user_id' in row:  
                if row['user_id'] == user_id:
                    goals.append(row)

        if not goals:
            empty_res = {"Goals":[]}
            return {'statusCode': 201,'body': empty_res}
        else:
            return {'statusCode': 201,'body': {"Goals":goals}}
    except Exception as e:
        print(e)
        return {'statusCode': 400,'body': json.dumps('Error Fetching Data')}