import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand, DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (event) => {
  const domain = event.requestContext.domainName;
  const stage = event.requestContext.stage;
  const endpoint = `https://${domain}/${stage}`;

  const api = new ApiGatewayManagementApiClient({ endpoint });

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    console.error("❗ Invalid JSON from client");
    return { statusCode: 400 };
  }

  console.log("💬 Incoming message:", body);

  const messagePayload = {
    from: event.requestContext.connectionId,
    message: body.message || "",
    type: body.type || "chat",
    timestamp: new Date().toISOString(),
  };

  const data = await ddb.send(new ScanCommand({ TableName: process.env.TABLE_NAME }));

  const sendToAll = data.Items.map(async ({ connectionId }) => {
    try {
      await api.send(
        new PostToConnectionCommand({
          ConnectionId: connectionId,
          Data: Buffer.from(JSON.stringify(messagePayload)),
        })
      );
    } catch (err) {
      if (err.name === "GoneException") {
        console.log(⚠️ Stale connection removed:", connectionId);

        await ddb.send(
          new DeleteCommand({
            TableName: process.env.TABLE_NAME,
            Key: { connectionId },
          })
        );
      } else {
        console.error("❗ Failed sending message:", err);
      }
    }
  });

  await Promise.all(sendToAll);

  return { statusCode: 200 };
};
