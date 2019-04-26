const AWS = require('aws-sdk')
const auth = require('./auth')
const dynamo = new AWS.DynamoDB.DocumentClient()

module.exports = async (inputs) => {
  // authenticate user
  const user = await auth(inputs)
  const profile = inputs.profile || {}

  const newUser = {
    ...user,
    ...profile, // merge new user data
    code: null, // users shouldn't update their SMS code
    id: user.id // users shouldn't update their number. Or maybe they should?!
  }

  const putParams = {
    TableName: process.env.USERS_TABLE,
    Item: newUser
  }

  // set new user data
  await dynamo.put(putParams).promise()

  return inputs
}
