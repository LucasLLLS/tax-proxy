import { config, DynamoDB } from 'aws-sdk'

//Those credentials only grant access to the specific table

const dynamoCredentials = {
  region: 'HERE GOES AWS REGION',
  credentials: {
    accessKeyId: 'HERE GOES API KEY',
    secretAccessKey: 'HERE GOES API TOKEN',
  },
}

/* ================================================================================

                                DynamoDB Existing Tables

=================================================================================== */
export const orderformClient = 'orderform-client'

/**
 * Returns an instance of DynamoDB.DocumentClient()
*/
export const DynamoDBDocumentClient = () => {
    config.update(dynamoCredentials)
    return new DynamoDB.DocumentClient()
}