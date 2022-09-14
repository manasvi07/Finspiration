import json
import boto3
import urllib3
import uuid

http = urllib3.PoolManager()

dynamodb_table = boto3.resource('dynamodb').Table('monthly_budget')

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
        budget = [] 
        for row in response['Items']:
            if 'user' in row:  
                if row['user'] == user_id:
                    budget.append(row)

        if not budget:
            empty_res = {"Category":[]}
            return {'statusCode': 201,'body': empty_res}
        else:
            return {'statusCode': 201,'body': {"Category":budget}}
    except Exception as e:
        return {'statusCode': 400,'body': e}