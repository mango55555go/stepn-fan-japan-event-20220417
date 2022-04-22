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
    <div className="justify-center items-center bg-gradient-to-r from-yellow-400 via-green-500 to-blue-500 h-screen">
        <div className="text-center py-10 px-5 self-center">
          <Image
            width={1143}
            height={133}
            resizeMode="contain"
            src="/images/logo.png"
            className="self-center"
          />
          <Image
            width={981}
            height={509}
            resizeMode="contain"
            src="/images/stats.png"
            className="self-center"
          />
        </div>
        <div className="text-center py-10 px-5 object-center self-center">
        </div>
        {session ? (
        <>
        <div>
          <div className="text-center">
          <Image
            width={100}
            height={100}
            src={session?.user?.user_metadata?.picture}
            className="rounded-full self-center"
          />
          </div>
          <p className="mt-3 text-lg text-center">
            Welcome {session?.user?.user_metadata?.full_name}
          </p>
          <p className="mt-3 text-lg text-center">
            You are signed in as @{session?.user?.user_metadata?.user_name}
          </p>

          {url && (
            <p className="mt-3 text-lg text-center px-5">
              参加賞NFTミントサイトは<a className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 px-4 py-2 mt-3 text-white bg-[#FFA500] rounded-lg" href={url} target="_blank">こちら</a>
            </p>
          )}
          <div className="text-center py-10">
          <button
            className="px-4 py-2 mt-3 text-black bg-[#1589FF] hover:bg-[#2554C7] hover:text-white rounded-lg"
            onClick={() => supabase.auth.signOut()}
          >
            Sign out
          </button>
          </div>
        </div>
        </>
      ) : (
        <>
        <div>
          <p className="mt-3 text-lg text-center px-5">
            参加賞NFTを受け取るには、大会エントリー時に使用したTwitterにてログインをしてください。
          </p>
          <div className="text-center py-10">
            <button
              onClick={signInWithTwitter}
              className="relative px-4 py-2 bg-[#1589FF] hover:bg-[#2554C7] hover:text-white rounded-lg mt-4"
            >
              Twitter sign in
           </button>
          </div>
        </div>
        </>
      )}
    </div>
  );
}
