import { useMutation } from "@apollo/client";
import { JOIN_LOBBY_MUTATION } from "../api/mutations";
import { useNavigate } from "react-router-dom";

export default function LobbyCard(lobby) {
  const navigate = useNavigate();

  const [joinLobby] = useMutation(JOIN_LOBBY_MUTATION);

  async function handleJoinLobby() {
    const user = localStorage.getItem('user');
    if (!user) return;
    
    const { token } = JSON.parse(user);

    try {
      const { data } = await joinLobby({
        variables: { lobbyId: lobby.id },
        context: {
          headers: {
              authorization: token
          }
        }
      });

      const lobbyData = data?.joinLobby;
      if (lobbyData.id) {
        navigate(`/lobby/${lobbyData.id}`);
      }
    } catch (error) {
      console.error('Error joining lobby:', error);
    }
  }

  return (
    <div className="flex flex-col gap-y-6 bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col flex-grow">
        <span className="text-lg font-semibold">{ lobby.title }</span>
        <span className="text-sm text-gray-500">{ lobby.playerCount } / { lobby.maxPlayers }</span>
      </div>
      <button className="bg-zinc-900 rounded-lg py-1 text-white" onClick={handleJoinLobby}>Join</button>
    </div>
  );
}