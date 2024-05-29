import { GET_HISTORIC_GAMES_QUERY } from "../../api/mutations";
import { useQuery  } from "@apollo/client";
import { useNavigate } from "react-router-dom";

export default function HistoricGames() {
    const navigate = useNavigate();

    const { loading, error, data } = useQuery(GET_HISTORIC_GAMES_QUERY);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    if (data.historicGames.length === 0) return (
        <div className="flex flex-col w-full gap-y-2 p-4">
            <h1 className="text-[24px]">Historic Games</h1>
            <div className="flex justify-center items-center flex-grow">
                <h2 className="text-[20px] font-medium">No historic games found</h2>
            </div>
        </div>
    );

    async function handleHistoryNavigation(id) {
        navigate("/lobby/" + id)
    }

    return (
        <div className="flex flex-col w-full gap-y-2 p-4">
            <h1 className="text-[24px]">Historic Games</h1>
            <div className="flex flex-col w-full gap-y-2">
                {
                    data.historicGames.map((game, index) => {
                        return (
                            <button key={index} className="flex justify-between items-center bg-zinc-900 rounded-[4px] py-2 px-4 text-white hover:bg-zinc-900/95 transition-all" onClick={() => handleHistoryNavigation(game.id)}>
                                <div className="flex gap-x-4 items-center">
                                    <span>{game.players.length} / {game.maxPlayers}</span>
                                    <span>{game.owner.username}</span>
                                </div>
                                <span> {game.name}</span>
                            </button>
                        )
                    })
                }
            </div>
        </div>
    )
}