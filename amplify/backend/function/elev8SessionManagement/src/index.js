/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_DYNAMOELEV8SESSIONS_ARN
	STORAGE_DYNAMOELEV8SESSIONS_NAME
	STORAGE_DYNAMOELEV8SESSIONS_STREAMARN
Amplify Params - DO NOT EDIT *//**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, QueryCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const TABLE_NAME = process.env.STORAGE_DYNAMOELEV8SESSIONS_NAME

exports.handler = async (event) => {
  try {
    const method = (event.httpMethod || "").toUpperCase();
    const path = event.path || "";
    const params = event.pathParameters || {};
    if (method === "POST") {
      try {
        const body = JSON.parse(event.body || "{}");
        const { level, subject, tutorEmail } = body;

        if (!level || !subject || !tutorEmail) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: "level, subject, and tutorEmail are required" }),
          };
        }

        const pk = `${level}-${subject}`;
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        // Check existing sessions for today to create unique SK
        const queryParams = {
          TableName: TABLE_NAME,
          KeyConditionExpression: "#pk = :pk AND begins_with(#sk, :skPrefix)",
          ExpressionAttributeNames: {
            "#pk": "class",
            "#sk": "classDate"
          },
          ExpressionAttributeValues: {
            ":pk": pk,
            ":skPrefix": today,
          },
        };

        const existing = await ddbDocClient.send(new QueryCommand(queryParams));
        const sequence = existing.Items?.length + 1 || 1;
        const sk = `${today}#${sequence}`;

        const sessionId = uuidv4(); // Unique session token
        const createdAt = new Date().toISOString();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 5).toISOString(); // 5 minutes expiry

        const putParams = {
          TableName: TABLE_NAME,
          Item: {
            class: pk,
            classDate: sk,
            sessionId,
            tutorEmail,
            createdAt,
            expiresAt,
          },
        };

        await ddbDocClient.send(new PutCommand(putParams));

        return {
          statusCode: 200,
          body: JSON.stringify({
            sessionId,
            pk,
            sk,
            createdAt,
            expiresAt,
          }),
        };
      } catch (err) {
        console.error("Error generating session:", err);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Error generating session", error: err.message }),
        };
      }
    }
    // ---------- DELETE /session-management/session/{combined}
// where combined = "<class>~<classDate>"
    if (method === "DELETE" && params.proxy) {
      try {
        const combinedRaw = decodeURIComponent(params.proxy);
        // e.g. "Sec3-Physics~2025-08-19#1"

        // Split safely on the last '~'
        const lastTilde = combinedRaw.lastIndexOf("~");
        if (lastTilde === -1) {
          return {
            statusCode: 400,
            body: JSON.stringify({
              message: "Invalid format. Expected <class>~<classDate>",
              received: combinedRaw,
            }),
          };
        }

        const classKey = combinedRaw.slice(0, lastTilde);       // "Sec3-Physics"
        const classDateKey = combinedRaw.slice(lastTilde + 1); // "2025-08-19#1"

        await ddbDocClient.send(
          new DeleteCommand({
            TableName: TABLE_NAME,
            Key: { class: classKey, classDate: classDateKey },
            ConditionExpression: "attribute_exists(#cls) AND attribute_exists(#cd)",
            ExpressionAttributeNames: {
              "#cls": "class",
              "#cd": "classDate",
            },
          })
        );

        return {
          statusCode: 204,
          body: "",
        };
      } catch (err) {
        console.error("Error deleting session:", err);
        return {
          statusCode: 500,
          body: JSON.stringify({
            message: "Error deleting session",
            error: err.message,
          }),
        };
      }
    }

  } catch (err) {
    console.error("Error in handler:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error", error: err.message }),
    };
  }
  
};