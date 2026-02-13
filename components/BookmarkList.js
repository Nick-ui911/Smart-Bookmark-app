"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function BookmarkList({ userId }) {
  const [bookmarks, setBookmarks] = useState([])
  const [deletingId, setDeletingId] = useState(null)

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
    setDeletingId(id)
    await supabase.from("bookmarks").delete().eq("id", id)
    setDeletingId(null)
  }

  return (
    <ul className="space-y-3">
      {bookmarks.map(item => (
        <li 
          key={item.id} 
          className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-300 transition-all duration-200"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <a 
                href={item.url} 
                target="_blank" 
                className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors block mb-1"
              >
                {item.title}
              </a>
              <a 
                href={item.url} 
                target="_blank" 
                className="text-sm text-gray-500 hover:text-indigo-600 transition-colors truncate block"
              >
                {item.url}
              </a>
            </div>

            <button
              onClick={() => deleteBookmark(item.id)}
              disabled={deletingId === item.id}
              className="flex-shrink-0 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {deletingId === item.id ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}