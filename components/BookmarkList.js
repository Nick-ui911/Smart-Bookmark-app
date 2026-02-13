"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function BookmarkList({ userId }) {
  const [bookmarks, setBookmarks] = useState([])

  const loadBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    setBookmarks(data || [])
  }

  useEffect(() => {
    if (!userId) return
    
    loadBookmarks()

    const channel = supabase
      .channel('bookmarks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('🔥 REALTIME EVENT:', payload.eventType, payload)
          loadBookmarks()
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime status:', status)
      })

    return () => {
      channel.unsubscribe()
    }
  }, [userId])

  const deleteBookmark = async (id) => {
    console.log('🗑️ Deleting bookmark:', id)
    await supabase.from("bookmarks").delete().eq("id", id)
  }

  return (
    <ul className="space-y-3">
      {bookmarks.map(item => (
        <li 
          key={item.id} 
          className="flex justify-between items-center bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-300 transition-all duration-200 group"
        >
          <a 
            href={item.url} 
            target="_blank" 
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors flex-1 truncate"
          >
            {item.title}
          </a>

          <button
            onClick={() => deleteBookmark(item.id)}
            className="ml-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}