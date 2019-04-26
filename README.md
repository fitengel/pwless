# passwordless

A zero configuration passwordless users service powered by [Serverless Components](https://github.com/serverless/components). It extends your application by providing SMS login and a users management backend.

&nbsp;

1. [Install](#1-install)
2. [Create](#2-create)
3. [Configure](#3-configure)
4. [Deploy](#4-deploy)

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
  inputs:
    name: passwordless-users # optional name
```

### 4. Deploy

```shell
passwordless$ components

  users › outputs:
  login:  'POST https://aq7lmtvug9.execute-api.us-east-1.amazonaws.com/dev/login'
  verify:  'POST https://aq7lmtvug9.execute-api.us-east-1.amazonaws.com/dev/verify'
  auth:  'POST https://aq7lmtvug9.execute-api.us-east-1.amazonaws.com/dev/auth'


  38s › dev › passwordless › done

passwordless$

```

&nbsp;

### New to Components?

Checkout the [Serverless Components](https://github.com/serverless/components) repo for more information.
