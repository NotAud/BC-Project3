export default function LobbyPlayerList({ players }: { players: any[] }) {

    const sortedPlayers = [...players].sort((a: any, b: any) => b.score - a.score);

    const PlayerList = () => {
        const medalColors = ['fill-yellow-400', 'fill-gray-400', 'fill-brown-400'];

        return (
            <div className="grid grid-cols-2 text-[18px] px-2">
                {sortedPlayers.map((player, $i) => (
                    <div key={$i} className="contents">
                        <div className="flex items-center gap-x-2">
                            <div className="w-[24px] h-[24px]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className={$i < 3 ? medalColors[$i] : ''} viewBox="0 0 256 256"><path d="M232,64H208V48a8,8,0,0,0-8-8H56a8,8,0,0,0-8,8V64H24A16,16,0,0,0,8,80V96a40,40,0,0,0,40,40h3.65A80.13,80.13,0,0,0,120,191.61V216H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V191.58c31.94-3.23,58.44-25.64,68.08-55.58H208a40,40,0,0,0,40-40V80A16,16,0,0,0,232,64ZM48,120A24,24,0,0,1,24,96V80H48v32q0,4,.39,8Zm144-8.9c0,35.52-29,64.64-64,64.9a64,64,0,0,1-64-64V56H192ZM232,96a24,24,0,0,1-24,24h-.5a81.81,81.81,0,0,0,.5-8.9V80h24Z"></path></svg>
                            </div>
                            <span>{player.user.username}</span>
                        </div>
                        <span className="text-end">{player.score}</span>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="flex flex-col border px-4 py-2 rounded-md w-1/4 shadow-md gap-y-1">
            <h2 className="text-[20px] font-medium text-center select-none">Player List</h2>
            <hr />
            <PlayerList />
        </div>
    )
}