import { ChevronDownIcon } from "@heroicons/react/outline"
import { useSession } from "next-auth/react"
import React from "react"
import { shuffle } from "lodash"
import { useRecoilState, useRecoilValue } from 'recoil'
import { playlistIdState, playlistState } from '../atoms/playlistAtom'
import useSpotify from "../hooks/useSpotify"

const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
]

function Center() {

    const spotifyApi = useSpotify()
    const { data: session } = useSession()
    const [ color, setColor ] = React.useState(null)
    const playlistId = useRecoilValue(playlistIdState)
    const [playlist, setPlaylist] = useRecoilState(playlistState)

    React.useEffect(() => {
        setColor(shuffle(colors).pop())
    },[playlistId])

    React.useEffect(() => {
        spotifyApi.getPlaylist(playlistId).then(data => {
            setPlaylist(data.body)
        }).catch(error => console.log("something went wrong", error))
    },[spotifyApi, playlistId])

    console.log(playlist)

    return (
        <div className="flex-grow">
            <header className="absolute top-5 right-8 text-white">
                <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
                    <img className="rounded-full w-10 h-10" src={session?.user.image} />
                    <h2>{session?.user.name}</h2>
                    <ChevronDownIcon className="h-5 w-5" />
                </div>
            </header>
            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} text-white h-80`}>
                <img className="h-44 w-44 shadow-2xl" src={playlist?.images?.[0]?.url} />
            </section>
        </div>
    )
}

export default Center
