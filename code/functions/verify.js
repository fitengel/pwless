const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB.DocumentClient()

module.exports = async (inputs) => {
  const { id, number, code } = inputs

  if (typeof id !== 'string') {
    throw Error(`${id} is not a valid id`)
  }

  if (typeof number !== 'string') {
    throw Error(`${number} is not a valid number`)
  }

  if (Number.isNaN(Number(code)) || String(code).length !== 6) {
    throw Error(`${number} is not a valid code`)
  }

  // get code record from the database
  const getParams = {
    TableName: process.env.CODES_TABLE,
    Key: {
      id
    }
  }

  const res = await dynamo.get(getParams).promise()

  if (Object.keys(res).length !== 0) {
    // check if the provided code matches the record
    const invalidCode = res.Item.code !== Number(code)

    // check if the provided number matches the record
    const invalidNumber = res.Item.number !== number

    // check if the code expired
    const currentTime = Math.floor(Date.now() / 1000)
    const codeExpired = currentTime > res.Item.expiresAt

    if (invalidCode || invalidNumber || codeExpired) {
      return { valid: false }
    }

    // delete/clean up the record if it has been verified
    const deleteParams = {
      TableName: process.env.CODES_TABLE,
      Key: {
        id
      }
    }

    await dynamo.delete(deleteParams).promise()

    return { valid: true }
  }

  // if we reach this point, then the provided code id was not found
  // hence it's an invalid request
  return { valid: false }
}
