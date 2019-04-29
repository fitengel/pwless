const path = require('path')
const { Component } = require('@serverless/components')

class Passwordless extends Component {
  async default(inputs = {}) {
    this.cli.status('Deploying')

    const mono = await this.load('@serverless/mono')
    const codesTable = await this.load('@serverless/aws-dynamodb', 'codesTable')

    const name = inputs.name || 'passwordless'
    const tableName = `${name}-codes`

    const ttl = inputs.ttl ? String(inputs.ttl) : '300' // time to live in seconds

    if (Number.isNaN(Number(ttl))) {
      throw Error('TTL property must be a number')
    }

    // deploy table
    const codesTableInputs = {
      name: tableName
    }
    await codesTable(codesTableInputs)

    // deploy mono lambda
    const monoInputs = {
      name,
      code: path.join(__dirname, 'code'),
      env: {
        CODES_TABLE: codesTableInputs.name,
        TTL: ttl
      }
    }
    const monoOutputs = await mono(monoInputs)

    // return useful outputs
    const outputs = {
      send: `POST ${monoOutputs.url}send`,
      verify: `POST ${monoOutputs.url}verify`
    }

    this.cli.outputs(outputs)

    return outputs
  }

  async remove() {
    this.cli.status('Removing')
    const mono = await this.load('@serverless/mono')
    const codesTable = await this.load('@serverless/aws-dynamodb', 'codesTable')

    await codesTable.remove()
    await mono.remove()

    return {}
  }
}

module.exports = Passwordless
