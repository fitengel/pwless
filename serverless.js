const path = require('path')
const crypto = require('crypto')
const { Component } = require('@serverless/components')

class Passwordless extends Component {
  async default(inputs = {}) {
    this.cli.status('Deploying')

    const mono = await this.load('@serverless/mono')
    const usersTable = await this.load('@serverless/aws-dynamodb', 'usersTable')

    const name = inputs.name || 'passwordless'
    const tableName = `${name}-users`

    // generate a new Json Web Token secret if first deployment
    // otherwise use the same one stored in state
    const jwtSecret = this.state.jwtSecret || crypto.randomBytes(64).toString('hex')

    this.state = {
      jwtSecret
    }

    await this.save()

    // deploy table
    const usersTableInputs = {
      name: tableName
    }
    await usersTable(usersTableInputs)

    // deploy mono lambda
    const monoInputs = {
      name,
      code: path.join(__dirname, 'code'),
      env: {
        USERS_TABLE: usersTableInputs.name,
        JWT_SECRET: jwtSecret
      }
    }
    const monoOutputs = await mono(monoInputs)

    // return useful outputs
    const outputs = {
      login: `POST ${monoOutputs.url}login`,
      verify: `POST ${monoOutputs.url}verify`,
      auth: `POST ${monoOutputs.url}auth`
    }

    this.cli.outputs(outputs)

    return outputs
  }

  async remove() {
    this.cli.status('Removing')
    const mono = await this.load('@serverless/mono')
    const usersTable = await this.load('@serverless/aws-dynamodb', 'usersTable')

    await usersTable.remove()
    await mono.remove()

    return {}
  }
}

module.exports = Passwordless
