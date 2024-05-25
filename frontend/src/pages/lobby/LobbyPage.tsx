import { useParams } from "react-router-dom";
import { GET_LOBBY_QUERY } from "../../api/mutations";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import LobbyPlayerList from "../../components/LobbyPlayerList";
import { useSocket } from "../../composables/socket/useSocket";

export default function LobbyPage() {
    const socket = useSocket();

    const { id } = useParams<{ id: string }>();

    const [lobby, setLobby] = useState<any>(null);

    const { loading, error, data } = useQuery(GET_LOBBY_QUERY, {
        variables: { lobbyId: id },
    });

    useEffect(() => {
        if (data && data.lobby) {
            setLobby(data.lobby);
            console.log(data.lobby)
        }
    }, [data]);

    useEffect(() => {
        if (!socket) return;
      
        socket.on("lobbyUpdated", (updatedLobby: any) => {
            console.log(updatedLobby)
            setLobby(updatedLobby)
        });
    
      }, [socket]);

    if (loading || !lobby) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    socket.emit("joinLobby", id);

    return (
        <div>
        <h1>Lobby Page: {id}</h1>
        <LobbyPlayerList players={lobby.players} />
        </div>
    )
}