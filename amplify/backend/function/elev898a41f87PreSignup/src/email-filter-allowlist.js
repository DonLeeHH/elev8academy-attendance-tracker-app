/**
 * @type {import('@types/aws-lambda').PreSignUpTriggerHandler}
 */
const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  const email = event.request.userAttributes.email;

  // DynamoDB key — just the email as the PK
  const params = {
    TableName: process.env.STORAGE_DYNAMODBELEV8ACADEMY_NAME,
    Key: {
      email: { S: email }
    }
  };

  try {
    const data = await ddbClient.send(new GetItemCommand(params));
    if (!data.Item) {
      throw new Error("Access denied: user not found in whitelist");
    }
    const group = data.Item.group.S;

    if (!["admins", "tutors", "students"].includes(group)) {
      throw new Error("Access denied: invalid user group");
    }

    // Optionally add group info to user attributes for downstream use
    event.response.autoConfirmUser = true;
    console.log(`User ${email} is whitelisted and belongs to group ${group}`);
    return event;
  } catch (err) {
    console.error("Pre-auth error", err);
    throw err;
  }
};
