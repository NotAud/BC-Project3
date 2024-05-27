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

export const START_GAME_MUTATION = gql`
  mutation startGame($lobbyId: ID!) {
    startGame(lobbyId: $lobbyId) {
      id
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
      players {
        user {
          id
          username
        }
        score
      }
    }
  }
`;

export const JOIN_LOBBY_MUTATION = gql`
  mutation joinLobby($lobbyId: ID!) {
    joinLobby(lobbyId: $lobbyId) {
      id
      name
      maxPlayers
      owner {
        id
        username
      }
      players {
        user {
          id
          username
        }
        score
      }
    }
  }
`;

export const GET_LOBBY_QUERY = gql`
  query getLobby($lobbyId: ID!) {
    lobby(lobbyId: $lobbyId) {
      id
      name
      maxPlayers
      owner {
        id
        username
      }
      players {
        user {
          id
          username
        }
        score
      }
      gameStatus
    }
  }
`;

export const SUBMIT_ANSWER_MUTATION = gql`
  mutation submitAnswer($lobbyId: ID!, $score: Int!) {
    submitAnswer(lobbyId: $lobbyId, score: $score) {
      id
      name
      maxPlayers
      owner {
        id
        username
      }
      players {
        user {
          id
          username
        }
        score
      }
    }
  }
`;
