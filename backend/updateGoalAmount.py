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
    
    user_id = user_attributes['Username']
    goal_name = event['body']['name']
    up_am = event['body']['amount']
    
    try:
        response = dynamodb_table.scan()
        id = ''
        for row in response['Items']:
            if 'user_id' in row and 'name' in row:  
                if row['user_id'] == user_id and row['name'] == goal_name:
                    id = row['id']
                curr_amount = 0
                if 'current_val' in row:
                    curr_amount = int(row['current_val'])

        if not id:
            return {'body': json.dumps('No such goal found. please add a goal ')}, 400
        else:
            final_amount = curr_amount + up_am
            dynamodb_table.update_item(
                Key={'id': id},
                UpdateExpression="set current_val=:val1",
                ExpressionAttributeValues={
                    ':val1': final_amount},
                ReturnValues="UPDATED_NEW")
            return {"success": True}, 
    except Exception as e:
        print(e)
        return {'statusCode': 400,'body': json.dumps('Error updating data')}