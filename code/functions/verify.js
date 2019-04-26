const AWS = require('aws-sdk')
const jwt = require('jsonwebtoken')
const dynamo = new AWS.DynamoDB.DocumentClient()

module.exports = async (inputs) => {
  const { number, code } = inputs

  if (typeof number !== 'string') {
    throw Error(`${number} is not a valid number`)
  }

  const getParams = {
    TableName: process.env.USERS_TABLE,
    Key: {
      id: number
    }
  }

  const res = await dynamo.get(getParams).promise()

  if (Object.keys(res).length !== 0) {
    // user/number exists
    // check if the code matches
    if (res.Item.code !== code) {
      throw Error(`Invalid login code for ${number}`)
    }

    // reset the code for future login
    res.Item.code = null
    const putParams = {
      TableName: process.env.USERS_TABLE,
      Item: res.Item
    }

    await dynamo.put(putParams).promise()

    // return token
    const token = jwt.sign(res.Item, process.env.JWT_SECRET)
    return { token }
  }

  throw Error(`${number} not found`)
}
