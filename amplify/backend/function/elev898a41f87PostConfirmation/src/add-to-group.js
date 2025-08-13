const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { CognitoIdentityProviderClient, AdminAddUserToGroupCommand } = require("@aws-sdk/client-cognito-identity-provider");

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  try {
    const email = event.request.userAttributes.email
    const userPoolId = event.userPoolId;
    const username = event.userName;

    // Query DynamoDB to get group info
    const params = {
      TableName: process.env.STORAGE_DYNAMODBELEV8ACADEMY_NAME,
      Key: {
        email: { S: email }
      }
    };

    const data = await ddbClient.send(new GetItemCommand(params));

    if (!data.Item) {
      console.log(`User ${email} not found in whitelist table.`);
      // Optionally: throw error or just skip group assignment
      return event;
    }

    const group = data.Item.group.S;

    if (!["admins", "tutors", "students"].includes(group)) {
      console.log(`Invalid group ${group} for user ${email}. Skipping group assignment.`);
      return event;
    }

    // Add user to Cognito group
    const addGroupCommand = new AdminAddUserToGroupCommand({
      GroupName: group,
      UserPoolId: userPoolId,
      Username: username
    });

    await cognitoClient.send(addGroupCommand);

    console.log(`Added user ${email} to group ${group}`);

    return event;

  } catch (err) {
    console.error("Error in post confirmation trigger:", err);
    throw err;n
  }
};
