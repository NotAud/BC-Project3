import LobbyCard from "./LobbyCard";

import { useQuery  } from "@apollo/client";
import { GET_ALL_LOBBIES_QUERY } from "../api/mutations";
import { useSocket } from "../composables/socket/useSocket";
import { useEffect, useState } from "react";
import LDS from "./LDS";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LobbyList() {
    const socket = useSocket();
    const [lobbies, setLobbies] = useState([]);

    const { loading, error, data } = useQuery(GET_ALL_LOBBIES_QUERY, {
        fetchPolicy: "network-only",
    });

    useEffect(() => {
        if (data && data.lobbies) {
          setLobbies(data.lobbies);
        }
    }, [data]);

    useEffect(() => {
        if (!socket) return;

        const handleLobbyCreated = (newLobby) => {
            setLobbies((prevLobbies) => [...prevLobbies, newLobby]);
        };

        const handleLobbyUpdated = (updatedLobby) => {
            setLobbies((prevLobbies) =>
                prevLobbies.map((lobby) =>
                    lobby.id === updatedLobby.id ? { ...lobby, players: updatedLobby.players } : lobby
                )
            );
        };

        const handleLobbyDelete = (lobbyList) => {
            if (!lobbyList) return;
            setLobbies(lobbyList);
        }

        socket.on("lobbyCreated", handleLobbyCreated);
        socket.on("lobbiesUpdated", handleLobbyUpdated)
        socket.on("lobbyDeleted", handleLobbyDelete)

        return () => {
            socket.off("lobbyCreated", handleLobbyCreated);
            socket.off("lobbiesUpdated", handleLobbyUpdated);
            socket.off("lobbyDeleted", handleLobbyDelete);
        };
    }, [socket])

    if (loading) return <LDS />;
    if (error) return <p>Error: {error.message}</p>;

    if (lobbies.length === 0) return (
        <div className="flex justify-center items-center h-full">
            <span className="text-[24px] font-medium">No lobbies found</span>
        </div>
    )

    return (
        <div className="grid grid-cols-4 gap-4">
            { lobbies.map((data, index) => <LobbyCard key={index} id={data.id} title={data.name} maxPlayers={data.maxPlayers} playerCount={data.players.length} />) }
        </div>
    )
}