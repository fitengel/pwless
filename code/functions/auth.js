const jwt = require('jsonwebtoken')
const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB.DocumentClient()

module.exports = async (inputs) => {
  const { token } = inputs

  if (!token) {
    throw Error('Unauthorized')
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)

    // token is verified, but we make a database query
    // to get the most recent data in case the user
    // made updates without a new login
    const getParams = {
      TableName: process.env.USERS_TABLE,
      Key: {
        id: user.id
      }
    }

    const res = await dynamo.get(getParams).promise()
    return res.Item
  } catch (e) {
    throw Error('Unauthorized')
  }
}
