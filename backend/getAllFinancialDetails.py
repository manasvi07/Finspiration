import json
import boto3
import urllib3
import uuid

http = urllib3.PoolManager()

goals_table = boto3.resource('dynamodb').Table('goals')
investment_table = boto3.resource('dynamodb').Table('investments')
budget_table = boto3.resource('dynamodb').Table('monthly_budget')
user_table = boto3.resource('dynamodb').Table('users')
expense_table = boto3.resource('dynamodb').Table('user_expense')


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
        response = goals_table.scan()
        print(response)
        goals = [] 
        for row in response['Items']:
            if 'user_id' in row:  
                if row['user_id'] == user_id:
                    goals.append(row)

        if not goals:
            goal_res = {"Goals":[]}
            
        else:
            goal_res = {"Goals":goals}
            
            
        response = investment_table.scan()
        print(response)
        invest = [] 
        for row in response['Items']:
            if 'user_id' in row:  
                if row['user_id'] == user_id:
                    invest.append(row)

        if not goals:
            invest_res = {"Investements":[]}
            
        else:
            invest_res = {"Investements":invest}
            
            
        response = budget_table.scan()
        print(response)
        budget = [] 
        for row in response['Items']:
            if 'user' in row:  
                if row['user'] == user_id:
                    budget.append(row)

        if not budget:
            budget_res = {"Budget":[]}
            
        else:
            budget_res = {"Budget":budget}
            
            
        sal_res = user_table.get_item(
                Key = {
                    "Id" : user_id
                }
            )
 
        row = sal_res['Item']

        salary = 0
        if 'Salary' in row:
            salary = row['Salary']
        

        
        response = expense_table.scan()
        expense = [] 
        for row in response['Items']:
            if 'user' in row:  
                if row['user'] == user_id:
                    expense.append(row)


        if not expense:
            expense_res = {"Expenses":[]}
            
        else:
            expense_res = {"Expenses":expense}
         
 
        fin_details = {"Goals":goal_res, "Investements":invest_res, "Budget":budget_res, "Monthly_Salary":salary, "Expenses":expense_res}
        
        return {'statusCode': 200,'body': fin_details}
    except Exception as e:
        print(e)
        return {'statusCode': 400,'body': e}