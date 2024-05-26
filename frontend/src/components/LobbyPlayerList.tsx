export default function LobbyPlayerList({ players }: { players: any[] }) {
    return (
        <div>
            <h2>Players</h2>
            <ul>
                {players.map((player, $i) => (
                    <li key={$i}>{player.user.username} : {player.score}</li>
                ))}
            </ul>
        </div>
    )
}