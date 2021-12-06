import React from 'react'
import { HeartIcon, HomeIcon, LibraryIcon, PlusCircleIcon, RssIcon, SearchIcon } from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import useSpotify from '../hooks/useSpotify'
import { useRecoilState } from 'recoil'
import { playlistIdState } from '../atoms/playlistAtom'



function Sidebar() {

    const spotifyApi = useSpotify()
    const { data: session, status } = useSession()
    const [playlists, setPlaylists] = React.useState([])
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)

    React.useEffect(() => {
        if(spotifyApi.getAccessToken()){
            spotifyApi.getUserPlaylists().then(data => {
                
                setPlaylists(data.body.items)
            })
        }
    },[session, spotifyApi])

    console.log({ session })
    console.log({ playlists })
    console.log(`You picked the playlist ${playlistId}`)

    return (
        <aside className="hidden md:inline-flex lg:text-sm sm:max-w[12rem] overflow-y-scroll scrollbar-hide h-screen text-gray-500 p-5 text-xs border-r border-gray-900">
            <div className="space-y-4">
                <button className="flex items-center space-x-2 hover:text-white">
                    <HomeIcon className="h-5 w-5" />
                    <p>Home</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <SearchIcon className="h-5 w-5" />
                    <p>Search</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <LibraryIcon className="h-5 w-5" />
                    <p>Your library</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900" />
                
                <button className="flex items-center space-x-2 hover:text-white">
                    <PlusCircleIcon className="h-5 w-5" />
                    <p>Create playlist</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <HeartIcon className="h-5 w-5" />
                    <p>Liked songs</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <RssIcon className="h-5 w-5" />
                    <p>Your episodes</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900" />


                {playlists.map(playlist => (
                    <p onClick={() => setPlaylistId(playlist.id)} className="cursor-pointer hover:text-white" key={playlist.id}>{playlist.name}</p>
                ))}


            </div>
        </aside>
    )
}

export default Sidebar
