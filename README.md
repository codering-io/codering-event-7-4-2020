# Code Ring Event

# Saturday, July 4th 9 AM EST - Friday, July 10th 6 PM EST

## Express.JS API

- This event requires users to collaborate with each other and build an API using Node.JS, Express, and MongoDB.
- The goal is to build a working CRUD application that meets all requirements listed below.
- The top contributor will win a $25 Amazon Gift Card

# Instructions

- There are a total of 16 tasks. You are only allowed to submit *one* task ***per*** pull request. You may submit a new Pull Request once yours is closed or merged. For example, you cannot submit 1 Pull Request with both tasks 1) and 2) together.

- Do not install any additional modules, the only npm packages needed are already listed in the package.json

- Fork this repository, and then clone your own fork either with HTTP or SSH

- Run `npm i`

- Run `npm run start` to start the app, or if you have nodemon, `npm run dev`. This will start up the express app on Port 3001.


# How to contribute

You must fork this repository, and then clone it and then make changes on your own fork. When you push, you will have your changes reflected on **your** fork only, not our repository. You must create a pull request *into* the master branch of this repository. Once you've successfully created a pull request, be sure to verify it was created on the repository. 

# Requirements:

- This project must have the following endpoints:
  - **/users**
  - **/posts**
  - **/friends**


# Explanation:

### Each route must have all CRUD operations, Create (POST), Read (GET), Update (PUT), Delete (DELETE).

**Route /users**

**Description:**

Database Models:

**1 - Create a Database Model for Users**

```
{
  username: string
  password: string
  email: string
}
```

**2 - Create a Database Model for Posts**
```
{
  title: string
  content: string
  author: string (username)
  createdOn: Date
  editedOn: Date
}
```

This route is for all users that are signed up with the application, every user must be unique.

**1 - GET /users**

- Returns all of the users in the database

**2 - GET /users/:username**

- Returns the user based on their username

**3 - POST /users**

- Creates a new user with the following parameters in the request body

```
{
  username: 'stuy',
  password: '123456',
  email: 'stuy@gmail.com'
}
```

**4 - PUT /users/:usernameOrEmail/username**

- Updates a user's username. Must check if the username is already used in the database. Request body contains the username parameter to update.

**5 - PUT /users/:usernameOrEmail/email**

- Updates a user's email address. Must check if email is already used by another user. Request body contains the email parameter to update.

**6 - DELETE /users/:usernameOrEmail**

- Deletes a user by username or email from the database

**Route: /posts**

**7 - GET /posts**

 - Get all posts from the database

**8 - GET /posts/:usernameOrEmail**

- Get all posts by username or email

**9 - POST /posts**

- Creates a new post for a user, the request body must have the following

```
{
   username: 'stuy',
   email: 'stuy@gmail.com',
   post: {
     title: 'title',
     content: 'this is a post!'
   }
}
```

Both username and email must be found in the database and MUST correspond to the same exact user.

**10 - PUT /posts/:id**

**id** - The MongoDB object id associated with this post

```
{
  title: 'this is the new title',
  content: 'this is a new content',
}
```

**11 - DELETE /posts/:id**

**id** - The mongoDB object id associated with this post


**Route: /friends**

**12 - GET /friends/:username**

- Returns all of the friends associated with the user

**13 - POST /friends/:username**

**username** - The user to add the friend to

e.g: POST /friends/anson

```
RequestBody {
  username: 'john'
}
```

This request will add "john" as a friend to "anson". Note: this relationship is not mutual, as "anson" added "john" but "john" did not add "anson".

**14 - DELETE /friends/:username**

- Deletes a friend. It takes a request body similar to POST /friends/:username.
e.g: DELETE /friends/anson

```
{
  username: 'john'
}
```

This will delete "john" as a friend from "anson"

# Rules

- Do not create multiple pull requests. You can only have 1 opened pull request at all times.
- You can only create a pull request with code that corresponds to only ONE feature. So, you cannot code the entire project and make a PR. Doing this will disqualify you from the event immediately.

