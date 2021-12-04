import { getProviders, signIn } from "next-auth/react"

function Login({ providers }) {
    return (
        <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
            <img className="w-52 mb-5" src="https://links.papareact.com/9xl" />

            {Object.values(providers).map(provider => (
                <div key={provider.name}>
                    <button onClick={() => signIn(provider.id, {
                        callbackUrl: "/"
                    })} className="bg-[#18D860] text-white rounded-full p-5">Login with {provider.name}</button>
                </div>
            ))}
        </div>
    )
}

export default Login

export async function getServerSideProps(){
    const providers = await getProviders()

    return {
        props: {
            providers
        }
    }
}