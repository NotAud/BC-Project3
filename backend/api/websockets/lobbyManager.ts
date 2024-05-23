type Lobby = {
  id: string;
};

const lobbies = new Map<string, Lobby>();

function createLobby(id: string) {
  lobbies.set(id, { id });
}

export { createLobby, lobbies };
