import React from "react"
import { useSession } from "next-auth/react"
import { useRecoilState } from "recoil"
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom"
import useSpotify from "../hooks/useSpotify"
import useSongInfo from "../hooks/useSongInfo"
import { SwitchHorizontalIcon, VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline"
import { PauseIcon, ReplyIcon, PlayIcon, VolumeUpIcon, RewindIcon, FastForwardIcon } from "@heroicons/react/solid"
import { debounce } from "lodash"


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

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then(data => {
            if (data.body.is_playing){
                spotifyApi.pause()
                setIsPlaying(false)
            } else {
                spotifyApi.play()
                setIsPlaying(true)
            }
        })
    }
    
    React.useEffect(() => {
        if(spotifyApi.getAccessToken() && !currentTrackId){
            fetchCurrentSong()
            setVolume(50)
        }
    },[currentTrackIdState, spotifyApi, session])

    React.useEffect(() => {
        if(volume > 0 && volume < 100){
            debouncedAdjustVolume(volume)
        }
    },[volume])

    const debouncedAdjustVolume = React.useCallback(
       debounce(volume => {
           spotifyApi.setVolume(volume).catch(error => {})
       }, 500),[])

    return (
        <div className="grid grid-cols-3 text-xs md:text-base px-2 md:px-8 h-24 bg-gradient-to-b from-black to-gray-900 text-white">
            <div className="flex items-center space-x-4">
                <img className="hidden md:inline h-10 w-10" src={songInfo?.album?.images?.[0]?.url} />
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <SwitchHorizontalIcon className="button"/>
                <RewindIcon className="button"/>
                {isPlaying ? <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" /> : <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />}
                <FastForwardIcon className="button"/>
                <ReplyIcon className="button" />
            </div>
            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeDownIcon onClick={() => volume > 0 && setVolume(volume - 10)} className="button" />
                <input className="w-14 md:w-28" onChange={e => setVolume(Number(e.target.value))} value={volume} type="range" min={0} max={100} />
                <VolumeUpIcon onClick={() => volume < 100 && setVolume(volume + 10)} className="button" />
            </div>
        </div>
    )
}

export default Player
