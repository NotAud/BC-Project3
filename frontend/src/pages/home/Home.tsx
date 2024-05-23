import LobbyCard from "../../components/LobbyCard";

const TempData = [
    { title: "Test", playerCount: 4, maxPlayers: 4 },
    { title: "Test1", playerCount: 2, maxPlayers: 5 },
    { title: "Test2", playerCount: 3, maxPlayers: 8 },
    { title: "Test3", playerCount: 4, maxPlayers: 8 },
    { title: "Test4", playerCount: 1, maxPlayers: 2 },
    { title: "Test5", playerCount: 7, maxPlayers: 7 },
]

export default function Home() {
    return (
        <div className="flex w-full h-full">
            <div className="flex flex-col gap-y-4 flex-grow px-8 pt-12">
                <div className="flex justify-between">
                    <h1>Active Games</h1>
                    <button>Create New Game</button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    { TempData.map((data, index) => <LobbyCard key={index} title={data.title} playerCount={data.playerCount} maxPlayers={data.maxPlayers} />) }
                </div>
            </div>
        </div>
    )
}