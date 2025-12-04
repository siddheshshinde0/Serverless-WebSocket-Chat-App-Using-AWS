import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (event) => {
  const connectionId = event.requestContext.connectionId;

  console.log("❌ Client disconnected:", connectionId);

  await ddb.send(
    new DeleteCommand({
      TableName: process.env.TABLE_NAME,
      Key: { connectionId },
    })
  );

  return { statusCode: 200, body: "Disconnected Successfully" };
};
