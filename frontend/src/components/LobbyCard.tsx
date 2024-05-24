type Lobby = {
    title: string;
    // playerCount: number;
    maxPlayers: number;
}

export default function LobbyCard(data: Lobby) {
  return (
    <div className="flex flex-col gap-y-6 bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col flex-grow">
        <span className="text-lg font-semibold">{ data.title }</span>
        <span className="text-sm text-gray-500">0 / { data.maxPlayers }</span>
      </div>
      <button className="bg-zinc-900 rounded-lg py-1 text-white">Join</button>
    </div>
  );
}