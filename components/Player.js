import React from "react"
import { useSession } from "next-auth/react"
import { useRecoilState } from "recoil"
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom"
import useSpotify from "../hooks/useSpotify"
import useSongInfo from "../hooks/useSongInfo"

function Player() {

    const spotifyApi = useSpotify()
    const { data:session, status } = useSession()

    const [currentTrackId, setCurrentIdTrack] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    const [volume, setVolume] = React.useState(50)

    const songInfo = useSongInfo()
    
    const fetchCurrentSong = () => {
        if(!songInfo){
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                console.log("Now Playing", data.body?.item)
                setCurrentIdTrack(data.body?.item?.id)
                spotifyApi.getMyCurrentPlaybackState().then(data => {
                    setIsPlaying(data.body?.is_playing)
                })
            })
        }
    }

    React.useEffect(() => {
        if(spotifyApi.getAccessToken() && !currentTrackId){
            fetchCurrentSong()
            setVolume(50)
        }
    },[currentTrackIdState, spotifyApi, session])

    return (
        <div className="grid grid-cols-3 text-xs md:text-base px-2 md:px-8 h-24 bg-gradient-to-b from-black to-gray-900 text-white">
            <div className="flex items-center space-x-4">
                <img className="hidden md:inline h-10 w-10" src={songInfo?.album?.images?.[0]?.url} />

                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>
        </div>
    )
}

export default Player
