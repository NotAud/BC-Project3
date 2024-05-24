import LobbyCard from "./LobbyCard";

import { useQuery  } from "@apollo/client";
import { GET_ALL_LOBBIES_QUERY } from "../api/mutations";
import { useSocket } from "../composables/socket/useSocket";
import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LobbyList() {
    const socket = useSocket();
    const [lobbies, setLobbies] = useState<any>([]);

    const { loading, error, data } = useQuery(GET_ALL_LOBBIES_QUERY);

    useEffect(() => {
        if (data && data.lobbies) {
          setLobbies(data.lobbies);
        }
      }, [data]);

    useEffect(() => {
        if (!socket) return;

        socket.on("lobbyCreated", (newLobby: any) => {
            setLobbies((prevLobbies: any) => [...prevLobbies, newLobby.data.createLobby]);
        });
    }, [socket])

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="grid grid-cols-4 gap-4">
            { lobbies.map((data: any, index: number) => <LobbyCard key={index} title={data.name} maxPlayers={data.maxPlayers} />) }
        </div>
    )
}