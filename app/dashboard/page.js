"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import BookmarkForm from "@/components/BookmarkForm"
import BookmarkList from "@/components/BookmarkList"
import { LogOut, Bookmark, Sparkles } from "lucide-react"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) window.location.href = "/login"
      setUser(data.user)
    })
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Bookmark className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Smart Bookmarks
                </h1>
                <p className="text-sm text-gray-500">Organize your web effortlessly</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
           
              <div className="hidden sm:flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user.email?.[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 max-w-[150px] truncate">
                  {user.email}
                </span>
              </div>

            
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

     
      <main className="max-w-5xl mx-auto px-6 py-8">
     
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-white/90 text-sm font-medium">Welcome back!</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Your Bookmark Collection
            </h2>
            <p className="text-white/80 max-w-2xl">
              Save, organize, and access your favorite websites all in one place. 
              Add new bookmarks below and manage your collection effortlessly.
            </p>
          </div>
        </div>

      
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
            Add New Bookmark
          </h3>
          <BookmarkForm userId={user.id} />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
            Your Bookmarks
          </h3>
          <BookmarkList userId={user.id} />
        </div>
      </main>

      
      <footer className="max-w-5xl mx-auto px-6 py-6 mt-12">
        <div className="text-center text-sm text-gray-500">
          <p>Made with ❤️ using Next.js and Supabase</p>
        </div>
      </footer>
    </div>
  )
}