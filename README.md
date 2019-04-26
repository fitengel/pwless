# passwordless

A zero configuration passwordless users service powered by [Serverless Components](https://github.com/serverless/components). It extends your application by providing SMS login and a users management backend.

&nbsp;

1. [Install](#1-install)
2. [Create](#2-create)
3. [Configure](#3-configure)
4. [Deploy](#4-deploy)
5. [Consume](#5-consume)

&nbsp;


### 1. Install

```shell
$ npm install -g @serverless/components
```

### 2. Create

Just create a `serverless.yml` file

```shell
$ touch serverless.yml
$ touch .env      # your development AWS api keys
$ touch .env.prod # your production AWS api keys
```

the `.env` files are not required if you have the aws keys set globally and you want to use a single stage, but they should look like this.

```
AWS_ACCESS_KEY_ID=XXX
AWS_SECRET_ACCESS_KEY=XXX
```

### 3. Configure

```yml
# serverless.yml

name: my-app

usersService:
  component: "@serverless/passwordless"
  
# this zero configuration component doesn't need any inputs
```

### 4. Deploy

```shell
passwordless$ components

  users › outputs:
  login:  'POST https://aq7lmtvug9.execute-api.us-east-1.amazonaws.com/dev/login'
  verify:  'POST https://aq7lmtvug9.execute-api.us-east-1.amazonaws.com/dev/verify'
  auth:  'POST https://aq7lmtvug9.execute-api.us-east-1.amazonaws.com/dev/auth'
  update:  'POST https://aq7lmtvug9.execute-api.us-east-1.amazonaws.com/dev/update'


  38s › dev › passwordless › done

passwordless$

```

### 5. Consume
Once deployed, the service exposes the following 4 endpoints:

#### /login
Sends an sms with a login code to the provided phone number.

```
$ curl https://aq7lmtvug9.execute-api.us-east-1.amazonaws.com/dev/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d "{ "number": "+1234567890" }"
```

#### /verify
Verifies the 6-digit code that was sent by SMS to the provided phone number. It logs in and returns a `token` if successful, or returns an error if the code is invalid.

```
$ curl https://aq7lmtvug9.execute-api.us-east-1.amazonaws.com/dev/verify \
  -X POST \
  -H "Content-Type: application/json" \
  -d "{ "number": "+1234567890", "code": "123456" }"
```


#### /auth
Verifies the provided token and returns the user data if the token is valid.

```
$ curl https://aq7lmtvug9.execute-api.us-east-1.amazonaws.com/dev/auth \
  -X POST \
  -H "Content-Type: application/json" \
  -d "{ "token": "xxx" }"
```

#### /update
Updates the user data of the provided token. Returns an error if the token is invalid.

```
$ curl https://aq7lmtvug9.execute-api.us-east-1.amazonaws.com/dev/update \
  -X POST \
  -H "Content-Type: application/json" \
  -d "{ "token": "xxx", profile: { "username": "joesmith", "firstName": "joe", "lastName": "smith" } }"
```


&nbsp;

### New to Components?

Checkout the [Serverless Components](https://github.com/serverless/components) repo for more information.
