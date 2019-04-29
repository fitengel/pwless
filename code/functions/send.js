const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB.DocumentClient()
const SNS = new AWS.SNS()
const uuidv4 = require('uuid/v4')
// expiresAt 1556544933
// current time 1556544943
module.exports = async (inputs) => {
  const { number } = inputs

  if (typeof number !== 'string') {
    throw Error(`${number} is not a valid number`)
  }

  const id = uuidv4()

  // generate 6-digit code to send
  const code = Math.floor(100000 + Math.random() * 900000)

  // calculate expiration date in epoch seconds based on the time to live setting
  const expiresAt = Math.floor(Date.now() / 1000 + Number(process.env.TTL))

  const putParams = {
    TableName: process.env.CODES_TABLE,
    Item: {
      id, // string
      number, // string
      code, // number
      expiresAt // number
    }
  }

  await dynamo.put(putParams).promise()

  // send sms
  const message = `${code} is your login code`
  const publishParams = {
    Message: message,
    PhoneNumber: number
  }

  await SNS.publish(publishParams).promise()

  return { id, number, expiresAt }
}
