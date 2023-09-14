# gym-guru-connect-server

This project is an REST API where you can record and keep in track your exercise activity.
you can also review some of many exercises for different goals.
And if you're atrainer or nutritionist, you can see the nutritional information for  the foods to asign to your customers.
You can handle Appointments, Nutrition plans and Exercise Plans, all depends on the role of your user.
The concept divides in two kinds of users: Trainer and Trainee.
Trainer has full control on Appointments, and can assign Exercises and Nutrition plans to Trainees.
Trainee can choose his trainer, book appointments of Trainer, and can also assign Exercises and Nutrition Plan but to himself only.
In order to access to the API you need to an authenticated user.
All the Ids used must be _id from a MongoDB connection.

The application is divided in two main endpoints .
```
/auth
/api
```

## Install

Dependencies:
- node 20.x
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
Original deployment was made on cyclic.sh which is serverless.
You also need to have a MongoDB database available with an available MONGO_URI
And for the foods and exercises to work you also need to have an API-NINJAS account.


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

Response:

```json
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
```json
400 Bad Request
{
  "message": "Email already registered"
}
```

or if no secure password:
```json
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

Response:

```json
200 OK
{
  "message": "Trainer account login successfully"
}
Cookies:
- authToken=<YOUR_AUTH_TOKEN>; Path=/; HttpOnly; Secure; SameSite=None
```

if incorrect password:
```json
400 Bad Request
{
  "message": "Password not valid"
}
```

or mail not registered:

```json
401 Unauthorized
{
  "message": "Trainer account not found"
}
```

### `GET /verify`

Verify if user token is still valid

Response:
```json
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
```json
401  Unauthorized
{
  "message": "Unauthorized: Missing authToken cookie"
}
```

### `POST /logout`

Response: 
```json
200 OK
{
  "message": "successful logout"
}
```

if missing authToken given at login:
```json
401 Unauthorized
{
  "message": "Unauthorized: Missing authToken cookie"
}
```

## API

### `POST /appointments/trainer/:trainerId` -- Create appointment for trainer
Creates a new appointment for a specific trainer, it can only be made by a user whom account is Trainer and can only create appointment to himself and must be past to 48 from today.

```json
POST /appointments/trainer/:trainerId
{
    "dayInfo" : "2023/08/26",
    "hour": 10
}
```

Response:
```json
201 CREATED
{
    "message": "Appointment added to trainer",
    "updatedTrainer": {
        "_id": "64e492f7c734571e74e357a2",
        "email": "waltr_7@hotmail.com",
        "name": {
            "lastName": "Bernal",
            "firstName": "Walter"
        },
        "isTrainer": true,
        "personalInfo": {
            "bio": "I'm a self taught trainer, but I'm a pro",
            "expYears": 12,
            "phone": 1,
            "address": ""
        },
        "schedule": [
            {
              "_id": "65037d70d9cf7e6bc7ae2834",
                "dayInfo": "9/30/2023",
                "hour": 10,
                "traineeId": null,
                "isAvailable": true,
                "createdAt": "2023-09-14T21:38:56.504Z",
                "updatedAt": "2023-09-14T21:38:56.504Z",
                "__v": 0
            }
        ],
        "trainees": [
            "64e5949dff7dc450f391ab6b"
        ],
        "createdAt": "2023-08-22T10:50:31.795Z",
        "updatedAt": "2023-09-14T21:38:56.506Z",
        "__v": 0
    }
}
```

If the appointment is not past 48h from today:
```json
{
  400 BAD REQUEST
  "message": "Cannot create dates before the next 48 hours"
}
```

### `GET /appointments/trainer/:trainerId`
Retrieves all the appointments for a spcecific trainer, the only users that has access to this information are the self trainer and a trainee that is witihin the list of trainees of the same trainer.

Response if user is trainer:
```json
{
  "schedule": [
    {
      "_id": "64e82d6736f960828347048a",
      "dayInfo": "8/5/2023",
      "hour": 10,
      "traineeId": null,
      "isAvailable": true,
      "createdAt": "2023-08-25T04:26:15.144Z",
      "updatedAt": "2023-08-25T04:26:15.144Z",
      "__v": 0
    },
    {
      "_id": "64e859d6cfd253dff8a21f30",
      "dayInfo": "8/27/2023",
      "hour": 7,
      "traineeId": {
          "_id": "64e5949dff7dc450f391ab6b",
          "email": "wltrbm@gmail.com",
          "password": "$2a$12$pacsqW.La5Dz/bGpsq.pcuyUYCoFhj7YAXIv47o36TJxwtEDwlyte",
          "name": {
              "firstName": "Jane",
              "lastName": "d'Arc"
          },
          "isTrainer": false,
          "personalInfo": {
              "age": 32,
              "height": null,
              "weight": null,
              "goal": ""
          },
          "exercisePlan": [
              "64fac5de9ae352428f2ea1e2",
              "6502431e94044866ad68a15b",
              "6502433d94044866ad68a1bc",
              "65026e8f45d8d50e5a22f436",
              "650376c1d9cf7e6bc7ae2824"
          ],
          "createdAt": "2023-08-23T05:09:49.529Z",
          "updatedAt": "2023-09-14T21:10:25.252Z",
          "__v": 0,
          "nutritionPlan": [
              "64fcb573811efd17f3e32052",
              "6502430d94044866ad68a104",
              "6502431094044866ad68a127"
          ],
          "trainerId": "64e492f7c734571e74e357a2"
      },
      "isAvailable": false,
      "createdAt": "2023-08-25T07:35:50.003Z",
      "updatedAt": "2023-08-25T10:08:50.246Z",
      "__v": 0
  },
  ]
}
```

Response if user is trainee: 
```json
{
"schedule": [
  {
      "_id": "64e82d6736f960828347048a",
      "dayInfo": "8/5/2023",
      "hour": 10,
      "traineeId": null,
      "isAvailable": true,
      "createdAt": "2023-08-25T04:26:15.144Z",
      "updatedAt": "2023-08-25T04:26:15.144Z",
      "__v": 0
  },
  {
      "_id": "64e859d6cfd253dff8a21f30",
      "dayInfo": "8/27/2023",
      "hour": 7,
      "traineeId": "64e5949dff7dc450f391ab6b",
      "isAvailable": false,
      "createdAt": "2023-08-25T07:35:50.003Z",
      "updatedAt": "2023-08-25T10:08:50.246Z",
      "__v": 0
  }, ...
]
}
```

### `POST /exercise-routines/trainee/:traineeId` -- Creates routine to trainee
Creates a routine day for a specified trainee. It is  protected, so you'll be able only to add to trainee in your trianee list if you are a trainer. The days are limited to 6 only.

```json
POST /exercise-routines/trainee/:traineeId
{
  "day": 6,
}
```

Response:
```json
201 CREATED
{
  "updatedExercisePlan": [
    {
      "_id": "650376c1d9cf7e6bc7ae2824",
      "day": 6,
      "exerciseList": [],
      "createdAt": "2023-09-14T21:10:25.245Z",
      "updatedAt": "2023-09-14T21:10:25.245Z",
      "__v": 0
    }
  ]
}
```

### `GET /exercises` 

Get the list of all available exercises in database

Response:

```json
200 OK 
"allExercises": [
  {
      "_id": "64e57d23ae3e42433d7a7f9a",
      "name": "Rickshaw Carry",
      "type": "strongman",
      "muscle": "forearms",
      "equipment": "other",
      "instructions": "Position the frame at the starting point, and...",
      "__v": 0
  },
  {
      "_id": "64e57d23ae3e42433d7a7f9d",
      "name": "Single-Leg Press",
      "type": "strength",
      "muscle": "quadriceps",
      "equipment": "machine",
      "instructions": "Load the sled to an appropriate weight. Seat...",
      "__v": 0
  },...
]
```

### `GET /exercises` -- Query Exercises

Retrieve exercises by filtering them based on muscle group, exercise type, or exercise name.

#### Query Parameters

- `muscle` (optional): Filter exercises by muscle group.
- `type` (optional): Filter exercises by exercise type.
- `name` (optional): Filter exercises by exercise name.

#### Example

http:
```
GET /exercises?muscle=chest&type=strength&=bench press
```

Response:
```json
200 OK
{
  "allExercises": [
    {
      "_id": "64e57d23ae3e42433d7a817d",
      "name": "Dumbbell Bench Press",
      "type": "strength",
      "muscle": "chest",
      "equipment": "dumbbell",
      "instructions": "Lie down on a flat bench with a dumbbell in...",
      "__v": 0
    },...
  ]
}
```

### `POST /exercises/:exerciseId/trainee/:traineeId` -- Create custom exercise

Takes a base exercise from the database and assigns it to the specified trainee

```json
POST /exercises/:exerciseId/trainee/:traineeId
{
  "series": 3,
  "reps": 10,
  "intensity": 0.85,
  "exerciseRoutineId": "64e5a6aa642512896774c6db"
}
```

Response:
```json
201 CREATED
{
  "updatedExercisePlan": [
    {
      "_id": "6502433d94044866ad68a1bc",
      "day": 2,
      "exerciseList": [
        {
          "_id": "6502434394044866ad68a1d0",
          "intensity": 0.8,
          "series": 4,
          "reps": 12,
          "exerciseData": {
            "_id": "64e57d23ae3e42433d7a7fa0",
            "name": "Landmine twist",
            "type": "strength",
            "muscle": "abdominals",
            "equipment": "other",
            "instructions": "Position a bar into a landmine or...",
            "__v": 0
          },
          "createdAt": "2023-09-13T23:18:27.071Z",
          "updatedAt": "2023-09-13T23:18:27.071Z",
          "__v": 0
        }
      ],
      "createdAt": "2023-09-13T23:18:21.744Z",
      "updatedAt": "2023-09-14T20:54:43.119Z",
      "__v": 0
    }
  ]
}
```