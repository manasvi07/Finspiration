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

        
        updated_amount = event['body']['amount']
        
        response = dynamodb_table.scan()
        id = ''
        for row in response['Items']:
            if 'user_id' in row and 'type' in row:  
                if row['user_id'] == user_id and row['type'] == type:
                    id = row['id']
                curr_amount = 0
                if 'amount' in row:
                    curr_amount = int(row['amount'])

        if not id:
            return {'body': json.dumps('No such investment found. please add a investment ')}, 400
        else:
            if type == "TFSA" or type == "RRSP":
                dynamodb_table.update_item(
                    Key={'id': id},
                    UpdateExpression="set amount=:r",
                    ExpressionAttributeValues={
                        ':r': updated_amount},
                    ReturnValues="UPDATED_NEW"
                     
                )
                return {'statusCode': 201,'body': json.dumps('Investment Successfully updated')}
            else:
                return {'statusCode': 400,'body': json.dumps('Only RRSP and TFSA allowed')}
    except Exception as e:
        raise e
        return {'statusCode': 400,'body': json.dumps('Unable to add investment')}
        
    
   