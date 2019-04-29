# passwordless

This [Serverless Component](https://github.com/serverless/components) enables your existing user system to identify users with just a phone number, then verify and authenticate the user with a 6-digit SMS code.  It runs on serverless infrastructure, so it can run with minimal overhead.

#### Features

- **Zero configuration:** You can spin up the entire service with just a single `components` command
- **Customizable time-to-live option:** Verification codes expire by default after 5 mins, which is completely customizable with component inputs.
- **Brute-force resilient:** Verification codes come with a unique `uuid`, making it practically impossible to brute-force within the expiration period.
- **Database cleanup:** All verified codes are automatically deleted from the database to minimize the costs.

&nbsp;

1. [Install](#1-install)
2. [Create](#2-create)
3. [Configure](#3-configure)
4. [Deploy](#4-deploy)
5. [Consume](#5-consume)
6. [Pricing](#6-pricing)

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

passwordless:
  component: "@serverless/passwordless"
  inputs:
  
    # set an optional name
    name: passwordless-service
    
    # set an optional time-to-live setting for verification codes in seconds.
    # 300 seconds is the default setting.
    ttl: 60
```

### 4. Deploy

```shell
passwordless$ components

  passwordless › outputs:
  send:  'POST https://aq7lmtvug9.execute-api.us-east-1.amazonaws.com/dev/send'
  verify:  'POST https://aq7lmtvug9.execute-api.us-east-1.amazonaws.com/dev/verify'


  38s › dev › passwordless › done

passwordless$

```

### 5. Consume
Once deployed, the service exposes the following 2 endpoints, which you could integrate with your existing users backend to authenticate a user (e.g. generate an JWT after verification):

#### /send
Sends an sms with a login code to the provided phone number.

```
$ curl https://aq7lmtvug9.execute-api.us-east-1.amazonaws.com/dev/send \
  -X POST \
  -H "Content-Type: application/json" \
  -d "{ "number": "+1234567890" }"
```

Returns an object with `id`, `number` and `expiresAt` properties that you could use during verification below.

#### /verify
Verifies the 6-digit code that was sent by SMS to the provided phone number. It requires the `number` and the `id` properties returned from the `/send` call above, along with the `code` that was sent to the user's phone number.

```
$ curl https://aq7lmtvug9.execute-api.us-east-1.amazonaws.com/dev/verify \
  -X POST \
  -H "Content-Type: application/json" \
  -d "{ "number": "+1234567890", "code": 123456, "id": "xxx-xxx-xxx-xxx" }"
```

If the `id`, `number` & `code` properties match, and the code hasn't expired, you'll get an object with `verified: true` property. Otherwise, `verified: false` is returned.

### 6. Pricing
The pricing of using this component is based on the pricing for AWS Lambda, AWS Api Gateway, AWS DynamoDB & AWS SNS/SMS services. However, the majority of the costs would likely come from the SMS feature. [Click here for more info on AWS SMS pricing](https://aws.amazon.com/sns/sms-pricing/)

&nbsp;

### New to Components?

Checkout the [Serverless Components](https://github.com/serverless/components) repo for more information.
