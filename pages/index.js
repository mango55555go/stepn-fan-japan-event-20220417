import { useState, useEffect } from "react"
import { supabase } from "../utils/supabaseClient"
import Image from "next/image"

export default function Home() {
  const [session, setSession] = useState(null)
  const [url, setUrl] = useState('')

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  getMintingUrl()

  async function getMintingUrl() {
    try {
      const user = supabase.auth.user()

      if (!user) return

      let { data, error, status } = await supabase
        .from('users')
        .select('url')
        .eq('username', `@${user.user_metadata.user_name}`)
        .single()


      if (data) {
        setUrl(data.url)
      }
    } catch (error) {
      alert(error.message)
    }
  }

  async function signInWithTwitter() {
    await supabase.auth.signIn({provider: "twitter"})
  }

  return (
    <div className="p-10 flex flex-col items-center justify-center w-screen h-screen bg-[#D33943] text-white">
      {session ? (
        <>
          <Image
            width={100}
            height={100}
            src={session?.user?.user_metadata?.picture}
            className="rounded-full"
          />
          <h2 className="mt-3 text-lg">
            Welcome {session?.user?.user_metadata?.full_name}
          </h2>
          <h2 className="mt-3 text-lg">
            You are signed in as @{session?.user?.user_metadata?.user_name}
          </h2>

          {url && (
            <p className="mt-3 text-2xl text-center">
              参加賞NFTミントサイトは<a className="text-green-500" href={url} target="_blank">こちら</a>
            </p>
          )}

          <button
            className="px-4 py-2 mt-3 text-black bg-white rounded-lg"
            onClick={() => supabase.auth.signOut()}
          >
            Sign out
          </button>
        </>
      ) : (
        <button
          onClick={signInWithTwitter}
          className="relative px-4 py-2 bg-[#1eb872] rounded-lg mt-4"
        >
          Twitter sign in
        </button>
      )}
    </div>
  )
}
