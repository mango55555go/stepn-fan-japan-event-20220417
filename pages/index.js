import { useState, useEffect } from "react"
import { supabase } from "../utils/supabaseClient"
import Image from "next/image"

export default function Home() {
  return (
    <div className="h-screen bg-gradient-to-r from-yellow-400 via-green-500 to-blue-500 text-center">
        <div className="text-center py-10 px-5 self-center w-3/5 m-auto">
          <Image
            width={1143}
            height={133}
            src="/images/logo.png"
            className="self-center"
          />
          <Image
            width={981}
            height={509}
            src="/images/stats.png"
            className="self-center"
          />
        </div>
        <h2>参加賞NFTのミント期間は終了しました。この度はイベントのご参加ありがとうございました！</h2>
    </div>
  );
}
