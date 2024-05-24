import { gql } from "@apollo/client";

export const CREATE_LOBBY_MUTATION = gql`
  mutation createLobby($name: String!, $maxPlayers: Int!) {
    createLobby(name: $name, maxPlayers: $maxPlayers) {
      id
      name
      maxPlayers
      owner {
        id
        username
      }
    }
  }
`;

export const GET_ALL_LOBBIES_QUERY = gql`
  query getAllLobbies {
    lobbies {
      id
      name
      maxPlayers
      owner {
        id
        username
      }
    }
  }
`;
