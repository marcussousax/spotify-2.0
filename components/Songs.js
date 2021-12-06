import { useRecoilValue } from "recoil"
import { playlistState } from "../atoms/playlistAtom"
import Song from "./Song"

function Songs() {

    const playlist = useRecoilValue(playlistState)
    console.log(playlist)
    return (
        <div className="text-white pb-28 px-8 flex flex-col space-y-1">
            {playlist?.tracks.items.map((track, i) => (
                <Song key={track?.track?.id} track={track} order={i}/>
            ))}
        </div>
    )
}

export default Songs
