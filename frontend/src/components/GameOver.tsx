import { Fragment } from 'react/jsx-runtime';
import {ordinalSuffix} from '../util/ordinalSuffix';

export default function GameOver({ players }: any) {
    const sortedPlayers = [...players].sort((a: any, b: any) => b.score - a.score)

    const WinnerCard = ({ player, place }: any) => {
        const medalColors = ['text-yellow-400 fill-yellow-400 border-yellow-400', 'text-neutral-500 fill-neutral-500 border-neutral-500', 'text-[#947341] fill-[#947341] border-[#947341]'];

        return (
            <div className={`border shadow-md rounded-md h-[275px] w-[25%] select-none ${place < 3 ? medalColors[place] : ''} ${place === 0 ? 'scale-105' : place === 2 ? 'scale-95' : ''}`}>
                <div className="flex flex-col justify-between items-center h-full w-full">
                    <h1 className="text-4xl font-bold py-4 ">{ place === 0 ? 'Winner' : place === 1 ? '2nd' : '3rd' }</h1>
                    <div className="flex justify-center flex-grow w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" height="97px" viewBox="0 0 256 256"><path d="M232,64H208V48a8,8,0,0,0-8-8H56a8,8,0,0,0-8,8V64H24A16,16,0,0,0,8,80V96a40,40,0,0,0,40,40h3.65A80.13,80.13,0,0,0,120,191.61V216H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V191.58c31.94-3.23,58.44-25.64,68.08-55.58H208a40,40,0,0,0,40-40V80A16,16,0,0,0,232,64ZM48,120A24,24,0,0,1,24,96V80H48v32q0,4,.39,8Zm144-8.9c0,35.52-29,64.64-64,64.9a64,64,0,0,1-64-64V56H192ZM232,96a24,24,0,0,1-24,24h-.5a81.81,81.81,0,0,0,.5-8.9V80h24Z"></path></svg>
                    </div>
                    <div className="flex flex-col items-center py-4">
                        <h1 className="text-4xl font-medium">{player.user.username}</h1>
                        <h1 className="text-2xl font-medium">Score: {player.score}</h1>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-y-4 justify-start h-full w-full">
            <h1 className="text-center text-[24px] font-medium select-none">Game Over</h1>
            <div className="flex flex-col gap-y-8 flex-grow ">
                <div className="flex gap-x-4 justify-center">
                    {sortedPlayers[1] ? <WinnerCard player={sortedPlayers[1]} place={1} /> : null}
                    {sortedPlayers[0] ? <WinnerCard player={sortedPlayers[0]} place={0} /> : null}
                    {sortedPlayers[2] ? <WinnerCard player={sortedPlayers[2]} place={2} /> : null}
                </div>
                <hr />
                <div className="grid grid-auto-fill-auto gap-x-4 w-[80%] self-center">
                    <span></span>
                    <span className="text-[18px] font-medium">Player</span>
                    <span className="text-[18px] font-medium">Score</span>
                    {sortedPlayers.map((player, index) => (
                        <Fragment key={player.user.id}>
                            <span>{ordinalSuffix(index + 1)}</span>
                            <span>{player.user.username}</span>
                            <span>{player.score}</span>
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    )
}