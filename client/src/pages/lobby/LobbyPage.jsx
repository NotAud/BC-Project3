import { useParams } from "react-router-dom";
import { GET_LOBBY_QUERY, START_GAME_MUTATION, SUBMIT_ANSWER_MUTATION } from "../../api/mutations";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import LobbyPlayerList from "../../components/LobbyPlayerList";
import { useSocket } from "../../composables/socket/useSocket";
import GameOver from "../../components/GameOver";
import RoundTimer from "../../components/RoundTimer";
import WaitingGif from "../../assets/waiting.gif";

export default function LobbyPage() {
    const socket = useSocket();

    const { id } = useParams();
    const user = localStorage.getItem('user');

    const [lobby, setLobby] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [answer, setAnswer] = useState(null);
    const [wasCorrect, setWasCorrect] = useState(false);

    const { loading, error, data } = useQuery(GET_LOBBY_QUERY, {
        variables: { lobbyId: id },
    });

    const [startGame] = useMutation(START_GAME_MUTATION);
    const [submitAnswer] = useMutation(SUBMIT_ANSWER_MUTATION);

    useEffect(() => {
        if (data && data.lobby && !lobby) {
            setLobby(data.lobby);
        }
    }, [data, lobby]);

    useEffect(() => {
        if (!socket) return;
      
        socket.emit("joinLobby", id);

        socket.on("lobbyUpdated", (updatedLobby) => {
            setLobby(updatedLobby)
        });

        socket.on("gameStarted", (updatedLobby) => {
            setAnswer(null);
            setWasCorrect(null);

            setLobby(updatedLobby)
        })

        socket.on("roundStarted", (updatedLobby) => {
            setAnswer(null);
            setWasCorrect(null);

            setLobby(updatedLobby)
        })

        socket.on("gameEnded", (updatedLobby) => {
            setAnswer(null);
            setWasCorrect(null);

            setLobby(updatedLobby)
        })

        return () => {
            socket.off("lobbyUpdated");
            socket.off("gameStarted");
            socket.off("gameEnded");
            socket.off("roundStarted");
            socket.off("answer")
        }
    
    }, [socket, id, wasCorrect, lobby]);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) return;

        const { id } = JSON.parse(userData);

        if (lobby && lobby.owner.id === id) {
            setIsOwner(true);
        }
    }, [lobby])

    async function handleStartGame() {
        const user = localStorage.getItem('user');
        if (!user) return;
        const { token } = JSON.parse(user);

        startGame({ 
            variables: { lobbyId: id }, 
            context: { 
                headers: { 
                    authorization: token 
                } 
            }
        });
    }

    if (loading || !lobby) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    function handleAnswer(answer) {
        const userData = localStorage.getItem('user');
        if (!userData) return;

        const { token } = JSON.parse(userData);

        const isCorrect = lobby.game.currentQuestion.correct === answer;
        setWasCorrect(isCorrect);

        setAnswer(answer);
        submitAnswer({ 
            variables: { lobbyId: id, score: isCorrect ? 1 : 0 }, 
            context: { 
                headers: { 
                    authorization: token 
                } 
            }
        })
    }

    const GameStateRender = () => {
        if (lobby.game.status === "waiting") {
            if (isOwner) {
                return <button onClick={handleStartGame} className="bg-green-900 h-fit px-8 py-4 rounded-[4px] text-white hover:bg-green-900/90 transition-all">Start Game</button>
            }

            return (
                <div className="flex flex-col">
                    <img src={WaitingGif} alt="Waiting for host" className="w-[128px] h-auto mx-auto" />
                    <p>Waiting for host to start game...</p>
                </div>
            )
        } else if (lobby.game.status === "started") {
            if (lobby.game.currentQuestion) {
                return (
                    <div className="flex flex-col gap-y-4 w-full h-full">
                        <div className="flex items-center justify-center h-1/2 border rounded-md w-full shadow-md relative">
                            <div className="flex items-start justify-between absolute w-full h-full p-2">
                                <span>{lobby.game.currentRound + 1} / {lobby.game.totalRounds}</span>
                                <RoundTimer roundTimestamp={lobby.game.roundTimestamp} roundTime={lobby.game.roundTime} />
                            </div>
                            <h1 className="font-medium text-[24px] select-none">{lobby.game.currentQuestion.question}</h1>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {lobby.game.currentQuestion.answers.map((answerChoice) => (
                                <button 
                                key={answerChoice} 
                                onClick={() => handleAnswer(answerChoice)} 
                                disabled={answer !== null}
                                className={`${answer === answerChoice && wasCorrect !== null ? (wasCorrect ? 'border-green-400' : 'border-red-400') : ''} ${user ? 'hover:scale-105' : 'cursor-default'} border rounded-md py-4 transition-all shadow-md`}
                                >{answerChoice}</button>
                            ))}
                        </div>
                    </div>
                )
            }
        } else if (lobby.game.status === "ended") {
            return <GameOver players={lobby.players} />
        } else {
            return <p>Unknown game status</p>
        }
    }

    return (
        <div className="flex flex-col p-4 flex-grow gap-y-2 relative">
            <h1 className="text-[24px] font-medium text-start select-none">Lobby: { lobby.name }</h1>
            <hr />
            <div className="flex flex-grow gap-x-8">
                <LobbyPlayerList players={lobby.players} ownerId={lobby.owner.id} />
                <div className="flex flex-grow justify-center items-center">
                    <GameStateRender />
                </div>
            </div>
        </div>
    )
}