const functionNotFound = {
  statusCode: 404,
  body: { error: 'the requested function was not found' }
}

module.exports = async (event) => {
  let functionName = event.path

  if (event.httpMethod.toLowerCase() !== 'post') {
    return {
      statusCode: 400,
      body: { error: 'only POST requests are currently supported' }
    }
  }

  if (functionName === '/') {
    return functionNotFound
  }

  // extract the function name based on the route
  if (functionName.startsWith('/')) {
    functionName = functionName.substr(1)
  }
  if (functionName.endsWith('/')) {
    functionName = functionName.substring(0, functionName.length - 1)
  }

  // only top level /{functionName} routes are currently supported
  if (functionName.split('/').length > 1) {
    return functionNotFound
  }

  // load the requested function
  let fn
  try {
    fn = require(`./functions/${functionName}.js`)
  } catch (e) {
    return functionNotFound
  }

  // run the requested function
  try {
    const data = await fn(JSON.parse(event.body))
    return data
  } catch (e) {
    return {
      statusCode: 500,
      body: { error: e.message }
    }
  }
}
