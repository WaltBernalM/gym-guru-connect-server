# gym-guru-connect-server

This project is an REST API where you can record and keep in track your exercise activity.
you can also review some of many exercises for different goals.
And if you're atrainer or nutritionist, you can see the nutritional information for  the foods to asign to your customers.
You can handle Appointments, Nutrition plans and Exercise Plans, all depends on the role of your user.
The concept divides in two kinds of users: Trainer and Trainee.
Trainer has full control on Appointments, and can assign Exercises and Nutrition plans to Trainees.
Trainee can choose his trainer, book appointments of Trainer, and can also assign Exercises and Nutrition Plan but to himself only.

## INSTALL

Dependencies:
- node >=20
- npm 9.x
- mongod 6.x

```sh
$ npm i
```


## Dev
```sh
$ npm run dev
```


## Release
You can deploy on any host that accepts a full backend application.
Original deployment was made on cyclic.sh which is serverless


## AUTH

### `POST /signup` -- CREATE

Create a new user (trainer or trainee)

```json
POST /signup
{
    "email": "test@hotmail.com",
    "password": "#Password1",
    "firstName": "John", 
    "lastName": "Doe",
    "isTrainer": true
}
```

response:

```
201 Created 
{
    "trainer": {
        "savedEmail": "test@hotmail.com",
        "savedName": {
            "firstName": "John",
            "lastName": "Doe"
        },
        "trainerId": "6503666cd9cf7e6bc7ae27dd"
    }
}
```

if already exists:
```
400 Bad Request
{
    "message": "Email already registered"
}
```

or if no secure password:
```
400 Bad Request
{
    "message": "The password is as weak as Yamcha.\n      Must have at least 6 chars, must use uppercased, \n      and lowercased letters and have at least a number"
}
```

### `POST /login`

Login to user (trainer or trainee)

```json
POST /login
{
    "email": "email@outlook.com",
    "password": "#Password",
    "isTrainer": false
}
```

response:

```
200 OK
{
    "message": "Trainer account login successfully"
}
Cookies:
- authToken=<YOUR_AUTH_TOKEN>; Path=/; HttpOnly; Secure; SameSite=None
```

if incorrect password:
```
400 Bad Request
{
    "message": "Password not valid"
}
```

or mail not registered:

```
401 Unauthorized
{
    "message": "Trainer account not found"
}
```

### `GET /verify`

Verify if user token is still valid

response:
```
200 OK
{
    "_id": "64e492f7c734571e74e357a2",
    "email": "waltr_7@hotmail.com",
    "name": {
        "lastName": "Bernal",
        "firstName": "Walter"
    },
    "isTrainer": true,
    "version": 75,
    "iat": 1694722291,
    "exp": 1694725891
}
```

if authToken is invalid:
```
401  Unauthorized
{
    "message": "Unauthorized: Missing authToken cookie"
}
```

### `POST /logout`

response: 
```
200 OK
{
    "message": "successful logout"
}
```

if missing authToken given at login:
```
401 Unauthorized
{
    "message": "Unauthorized: Missing authToken cookie"
}
```
