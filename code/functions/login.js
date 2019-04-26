const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB.DocumentClient()
const SNS = new AWS.SNS()

module.exports = async (inputs) => {
  const { number } = inputs

  if (typeof number !== 'string') {
    throw Error(`${number} is not a valid number`)
  }

  // generate random 6 digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString()

  const message = `${code} is your login code`

  // check if user/number already exists
  const getParams = {
    TableName: process.env.USERS_TABLE,
    Key: {
      id: number
    }
  }

  const res = await dynamo.get(getParams).promise()

  if (Object.keys(res).length !== 0) {
    // user/number already exists.
    // Set the code to be sent.
    res.Item.code = code
    const putParams = {
      TableName: process.env.USERS_TABLE,
      Item: res.Item
    }

    await dynamo.put(putParams).promise()
  } else {
    // user/number does not exist.
    // set new record
    const putParams = {
      TableName: process.env.USERS_TABLE,
      Item: {
        id: number,
        code
      }
    }

    await dynamo.put(putParams).promise()
  }

  // send sms
  const publishParams = {
    Message: message,
    PhoneNumber: number
  }

  await SNS.publish(publishParams).promise()

  return inputs
}
