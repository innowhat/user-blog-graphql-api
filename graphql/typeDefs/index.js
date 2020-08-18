const { buildSchema } = require("graphql");

// Construct a schema, using GraphQL schema language
module.exports = buildSchema(`

type User {
  _id: ID!
  firstName: String!
  lastName: String!
  email: String!
  createdAt: String!
  updatedAt: String!
  }
  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    confirmPassword :String!
  }
  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
    user: User!
  }



  type Post {
    _id: ID!
    author: User!
    title: String!
    body: String!
    published: Boolean!
    createdAt: String!
    updatedAt: String!
  }
  input PostInput {
    title: String!
    body: String!
    published: Boolean!
  }

type RootQuery {
  viewer: User
  getAllPosts: [Post!]!
  getMyPosts: [Post!]!
  getMyPostsById(postId: ID!): [Post!]!
}

type RootMutation {
  login(email: String!, password: String!) : AuthData!
  createAccount(input: UserInput): AuthData!
  updateAccount(userId: ID!, firstName: String!, lastName: String!): User
  updatePassword(userId: ID!, password: String!, confirmPassword :String!): User
  deleteAccount(userId: ID!): String!

  createPost(input: PostInput): Post
  updatePost(postId: ID!, input: PostInput): Post
  deletePost(postId: ID!): String!

}

schema {
  query: RootQuery
  mutation: RootMutation
}
`);
