import { useMutation  } from "@apollo/client";
import { CREATE_LOBBY_MUTATION, JOIN_LOBBY_MUTATION } from "../../api/mutations";

import LobbyList from "../../components/LobbyList";
import { useSocket } from "../../composables/socket/useSocket";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate()

    const [createLobby] = useMutation(CREATE_LOBBY_MUTATION);
    const [joinLobby] = useMutation(JOIN_LOBBY_MUTATION);
    const [overlayActive, setOverlayActive] = useState(false);

    const [lobbyName, setLobbyName] = useState("");
    const [lobbySize, setLobbySize] = useState(4);

    const socket = useSocket();
    useEffect(() => {
        if (!socket) return;

        socket.emit("joinMain");
    }, [socket]);

    const user = localStorage.getItem('user');
    async function handleCreateLobby() {
        if (!lobbyName) return;

        if (!user) return;
        const { token } = JSON.parse(user);

        try {
            const response = await createLobby({ 
                variables: { name: lobbyName, maxPlayers: parseInt(lobbySize) },
                context: {
                    headers: {
                        authorization: token
                    }
                }
            });
            socket.emit("createLobby", response);

            try {
                const { data } = await joinLobby({
                    variables: { lobbyId: response.data.createLobby.id },
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
        } catch (error) {
            console.error(error);
        }
    }

    function resetLobbyForm(e, force = false) {
        if (e?.target !== e?.currentTarget && !force) return;

        setOverlayActive(false);
        setLobbyName("");
        setLobbySize(4);
    }

    return (
        <div className="flex w-full h-full">
            <div className="flex flex-col gap-y-4 flex-grow px-8 pt-12">
                <div className="flex justify-between items-center text-[18px] font-medium">
                    <h1>Active Games</h1>
                    {
                        user && <button className="bg-zinc-900 rounded-[4px] py-1 px-2 text-white transition-all hover:bg-zinc-800/90" onClickCapture={() => setOverlayActive(true)}>Create New Game</button>
                    }
                </div>
                <LobbyList />
            </div>
            {
                overlayActive && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm" onClick={(e) => resetLobbyForm(e)}>
                        <div className="flex flex-col bg-white/80 p-4 rounded-md shadow-md gap-y-2">
                            <h1 className="text-[24px] font-medium text-center select-none">Create Lobby</h1>
                            <div className="flex flex-col gap-y-2">
                                <div className="flex flex-col">
                                    <label htmlFor="name" className="text-[12px] pl-1">Lobby Name</label>
                                    <input type="text" id="name" className="border rounded-[4px]" spellCheck="false" autoComplete="off" value={lobbyName} onChange={(e) => setLobbyName(e.target.value)} />
                                </div>
                                <div className="flex flex-col py-1">
                                    <label htmlFor="maxPlayers" className="text-[12px] pl-1">Max Players</label>
                                    <select value={lobbySize} className="py-1 border rounded-[4px] hover:cursor-pointer" onChange={(e) => setLobbySize(e.target.value)}>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="6">6</option>
                                        <option value="8">8</option>
                                        <option value="12">12</option>
                                        <option value="16">16</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-x-2">
                                <button onClick={(e) => resetLobbyForm(e)} className="bg-zinc-900 h-fit px-8 py-2 rounded-[4px] text-white hover:bg-zinc-900/95 transition-all">Cancel</button>
                                <button onClick={handleCreateLobby} className="bg-zinc-900 h-fit px-8 py-2 rounded-[4px] text-white hover:bg-zinc-900/95 transition-all">Create</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}