import { useMutation  } from "@apollo/client";
import { CREATE_LOBBY_MUTATION } from "../../api/mutations";

import LobbyList from "../../components/LobbyList";
import { useSocket } from "../../composables/socket/useSocket";

export default function Home() {
    const [createLobby] = useMutation(CREATE_LOBBY_MUTATION);

    const socket = useSocket();

    async function handleCreateLobby() {
        const user = localStorage.getItem('user');
        if (!user) return;
        const { token } = JSON.parse(user);

        try {
            const response = await createLobby({ 
                variables: { name: "Test", maxPlayers: 4 },
                context: {
                    headers: {
                        authorization: token
                    }
                }
            });
            socket.emit("createLobby", response)
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flex w-full h-full">
            <div className="flex flex-col gap-y-4 flex-grow px-8 pt-12">
                <div className="flex justify-between items-center text-[18px] font-medium">
                    <h1>Active Games</h1>
                    <button className="bg-zinc-900 rounded-[4px] py-1 px-2 text-white transition-all hover:bg-zinc-800/90" onClick={handleCreateLobby}>Create New Game</button>
                </div>
                <LobbyList />
            </div>
        </div>
    )
}