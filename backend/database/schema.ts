import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    getAllUsers: [User!]!
  }

  type User {
    id: ID!
    username: String!
    password: String!
  }

  type Mutation {
    createUser(username: String!, password: String!): User!
    login(username: String!, password: String!): AuthPayload!
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`;

export default typeDefs;
