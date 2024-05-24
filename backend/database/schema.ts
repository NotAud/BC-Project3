import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    password: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Lobby {
    id: ID!
    name: String!
    owner: User!
    players: [User!]!
    maxPlayers: Int!
    createdAt: String!
  }

  type Query {
    getAllUsers: [User!]!
    lobbies: [Lobby!]!
  }

  type Mutation {
    createUser(username: String!, password: String!): User!
    login(username: String!, password: String!): AuthPayload!
    createLobby(name: String!, maxPlayers: Int!): Lobby!
  }
`;

export default typeDefs;
