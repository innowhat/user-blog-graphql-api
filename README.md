# MULTI USER BLOG GRAPHQL API

This is a multi-user blogging application with a GraphQL API powered by express server.

## Features

- Single GraphQL endpoint
- Strong typed Models with proper relationships
- Clean type definition
- JWT Authentication
- Lightwight and mininal dependencies
- Error handling
- Easy to clone and reuse

## GraphQL query option:

### Users
`login`               Authentication
`viewer`              Currently logged in user
`createAccount`       Create a new account
`updateAccount`       Update user account
`login` 


| Feature             | Type                              | Action                                                  |
|---------------------|-----------------------------------|---------------------------------------------------------|
| `login`             | `Mutation`                           | `Authentication`                                       |
| `viewer`            | `Query`                           | `Get current logged in user`                            |
| `createAccount`     | `Mutation`                        | `Create a new account`                                  |
| `updateAccount`     | `Mutation`                        | `Update user account`                                  |
| `updatePassword`    | `Mutation`                        | `Change password`                                       |
| `deleteAccount`     | `Mutation`                        | `Delete account`                                       |

### Posts

| Feature          | Type                                  | Action                                                  |
|------------------|---------------------------------------|---------------------------------------------------------|
| `getAllPosts`    | `Query`                               | `Get all public/pushblished posts`                      |
| `getMyPosts`     | `Query`                               | `Get all posts by author`                            |
| `getMyPostsById` | `Query`                               | `Get post by author ID`                                  |
| `createPost`     | `Mutation`                            | `Create new post`                                  |
| `updatePost`     | `Mutation`                            | `Update post`                                       |
| `deletePost`     | `Mutation`                            | `Delete post`                                       |


## GraphQL query option:
[Live Demo](https://user-blog-graphql-api.herokuapp.com/playground)

## Installation:

- Download/clone project to your local directory
- Remember to create and add your environment variables to .env

```bash
npm install
npm run dev
# or
yarn
yarn dev
```

## Todo
- Add more mutation and query types
- Add server side validation
- Others..


