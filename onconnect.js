import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (event) => {
  const connectionId = event.requestContext.connectionId;

  console.log("🔌 New client connected:", connectionId);

  const item = {
    connectionId,
    connectedAt: new Date().toISOString(),
  };

  await ddb.send(
    new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: item,
    })
  );

  return { statusCode: 200, body: "Connected Successfully" };
};
