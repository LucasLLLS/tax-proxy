import { DynamoDBDocumentClient, orderformClient } from '../config'

/**
 * Gets a list of warehouses associated to a warehouse ID
 */
export const getOrderFormId = async (
  accountName: string,
  clientId: string
) => {
  return await DynamoDBDocumentClient()
    .query({
      TableName: orderformClient,
      KeyConditionExpression: 'PK = :partitionKey AND SK = :sortKey',
      ExpressionAttributeValues: {
        ':partitionKey': `accountName#${accountName}`,
        ':sortKey': `orderform#${clientId}`,
      },
      ReturnConsumedCapacity: 'TOTAL',
    })
    .promise()
}

export const updateOrderform = async (
  orderformId: string,
  accountName: string,
  clientId: string,
  timestamp: number
) => {
  const params = {
    TableName: orderformClient,
    Item: {
      PK: `accountName#${accountName}`,
      SK: `orderform#${clientId}`,
      orderformId,
      timestamp,
    },
    ReturnConsumedCapacity: 'TOTAL',
  }

  return await DynamoDBDocumentClient().put(params).promise()
}
