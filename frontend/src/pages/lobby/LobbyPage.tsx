import { useParams } from "react-router-dom";
import { GET_LOBBY_QUERY, START_GAME_MUTATION, SUBMIT_ANSWER_MUTATION } from "../../api/mutations";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import LobbyPlayerList from "../../components/LobbyPlayerList";
import { useSocket } from "../../composables/socket/useSocket";
import GameOver from "../../components/GameOver";

export default function LobbyPage() {
    const socket = useSocket();

    const { id } = useParams<{ id: string }>();

    const [lobby, setLobby] = useState<any>(null);
    const [isOwner, setIsOwner] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [answer, setAnswer] = useState<any>(null);

    const { loading, error, data } = useQuery(GET_LOBBY_QUERY, {
        variables: { lobbyId: id },
    });

    const [startGame] = useMutation(START_GAME_MUTATION);
    const [submitAnswer] = useMutation(SUBMIT_ANSWER_MUTATION);

    useEffect(() => {
        if (data && data.lobby && !lobby) {
            console.log("initial", data.lobby)
            setLobby(data.lobby);
        }
    }, [data, lobby]);

    useEffect(() => {
        if (!socket) return;
      
        socket.emit("joinLobby", id);

        socket.on("lobbyUpdated", (updatedLobby: any) => {
            console.log("updated", updatedLobby)
            setLobby(updatedLobby)
        });

        socket.on("gameStarted", (updatedLobby: any) => {
            console.log("Game started", updatedLobby)
            setAnswer(null);
            setCurrentQuestion(null);

            setLobby(updatedLobby)
        })

        socket.on("roundEnded", () => {
            setAnswer(null);
            setCurrentQuestion(null);
        })

        socket.on("gameEnded", (updatedLobby: any) => {
            console.log("Game ended", updatedLobby)
            setAnswer(null);
            setCurrentQuestion(null);

            setLobby(updatedLobby)
        })

        socket.on("question", (question: any) => {
            setAnswer(null);
            setCurrentQuestion(question);
        });

        return () => {
            socket.off("lobbyUpdated");
            socket.off("gameStarted");
            socket.off("gameEnded");
            socket.off("question");
            socket.off("answer")
        }
    
    }, [socket, currentQuestion, id]);

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

    function handleAnswer(answer: string) {
        const userData = localStorage.getItem('user');
        if (!userData) return;

        const { token } = JSON.parse(userData);

        const isCorrect = currentQuestion.correct === answer;

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
        console.log("render", lobby)

        if (lobby.gameStatus === "waiting") {
            if (isOwner) {
                return <button onClick={handleStartGame} className="bg-green-900 h-fit px-8 py-4 rounded-[4px] text-white hover:bg-green-900/90 transition-all">Start Game</button>
            }

            return <p>Waiting for host to start game...</p>
        } else if (lobby.gameStatus === "started") {
            if (currentQuestion) {
                if (answer) {
                    return <p>Your answer: {answer}</p>
                }
                
                return (
                    <div>
                        <p>{currentQuestion.question}</p>
                        <ul>
                            {currentQuestion.answers.map((answer: any) => (
                                <button key={answer} onClick={() => handleAnswer(answer)}>{answer}</button>
                            ))}
                        </ul>
                    </div>
                )
            }
        } else if (lobby.gameStatus === "ended") {
            return <GameOver players={lobby.players} />
        } else {
            return <p>Unknown game status</p>
        }
    }

    return (
        <div className="flex flex-col p-4 flex-grow gap-y-2">
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