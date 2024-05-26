import { useParams } from "react-router-dom";
import { GET_LOBBY_QUERY, START_GAME_MUTATION, SUBMIT_ANSWER_MUTATION } from "../../api/mutations";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import LobbyPlayerList from "../../components/LobbyPlayerList";
import { useSocket } from "../../composables/socket/useSocket";

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
        console.log(data)
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

        socket.on("gameStarted", () => {
            console.log("Game started")
            setAnswer(null);
            setCurrentQuestion(null);
        })

        socket.on("roundEnded", () => {
            setAnswer(null);
            setCurrentQuestion(null);
        })

        socket.on("gameEnded", (scores: any) => {
            console.log("Game ended", scores)
            setAnswer(null);
            setCurrentQuestion(null);
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
    
    }, [socket, currentQuestion]);

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

    socket.emit("joinLobby", id);

    function handleAnswer(answer: string) {
        const userData = localStorage.getItem('user');
        if (!userData) return;

        const { token } = JSON.parse(userData);

        const isCorrect = currentQuestion.correct === answer;

        console.log(isCorrect, currentQuestion.correct, answer)

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

    const QuestionRender = () => {
        if (answer) {
            return <p>Your answer: {answer}</p>
        }

        if (currentQuestion) {
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
        return <p>No question</p>
    }

    return (
        <div>
        <h1>Lobby Page: {id}</h1>
        <LobbyPlayerList players={lobby.players} />
        {isOwner && <button onClick={handleStartGame}>Start Game</button>}
        <QuestionRender />
        </div>
    )
}