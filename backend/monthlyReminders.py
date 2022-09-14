import json
import boto3

def getUserEmails():
    goals_table = boto3.resource('dynamodb').Table('goals')
    
    response = goals_table.scan()
    
    users = set()
    for row in response['Items']:
        if 'user_id' in row:
            users.add(row['user_id'])    
            
            
    users_table =  boto3.resource('dynamodb').Table('users')
    
    emails = set()
    
    for id in users:
        response = users_table.get_item(
                Key = {'Id':id}
            )
        details = response["Item"]  
        if 'email' in details:
            emails.add(details['email'])
            
            
    return emails

def lambda_handler(event, context):
    ses_client = boto3.client("ses", region_name="us-east-1")
    CHARSET = "UTF-8"
    
    email_list = getUserEmails()
    

    response = ses_client.send_email(
        Destination={
            "ToAddresses": list(email_list),
        },
        Message={
            "Body": {
                "Text": {
                    "Charset": CHARSET,
                    "Data": "Hello, Please contibute money towards your goals",
                }
            },
            "Subject": {
                "Charset": CHARSET,
                "Data": "Reminder for ",
            },
        },
        Source="dp974154@dal.ca",
    )
