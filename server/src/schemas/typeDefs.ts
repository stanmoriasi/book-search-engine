const typeDefs = `#graphql
input AddUserInput {
  username: String!
  email: String!
  password: String!
}

input LoginInput {
  email: String!
  password: String!
}

input BookInput {
  bookId: String!
  title: String!
  authors: [String!]!
  description: String
  image: String
  link: String
}

input DeleteBookInput {
  bookId: String!
}

type User {
  _id: ID!
  username: String!
  password: String!
  email: String!
  bookCount: Int!
  savedBooks: [Book!]
}

type Book {
  bookId: String!
  title: String!
  authors: [String!]!
  description: String
  image: String
  link: String
}

type Auth {
  token: String!
  user: User!
}

type Query {
  me: User!
}

type Mutation {
  addUser(user: AddUserInput!): Auth!
  login(user: LoginInput!): Auth!
  saveBook(book: BookInput!): User!
  removeBook(book: DeleteBookInput!): User!
}
`;

export default typeDefs;
