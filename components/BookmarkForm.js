"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Plus, Link, Type, Loader2, CheckCircle } from "lucide-react"

export default function BookmarkForm({ userId }) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")

  const addBookmark = async () => {
    if (!title.trim() || !url.trim()) {
      setError("Please fill in both title and URL")
      return
    }

    try {
      new URL(url.startsWith('http') ? url : `https://${url}`)
    } catch {
      setError("Please enter a valid URL")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const { data: { user } } = await supabase.auth.getUser()

      const { error: insertError } = await supabase.from("bookmarks").insert({
        title: title.trim(),
        url: url.startsWith('http') ? url : `https://${url}`,
        user_id: user.id
      })

      if (insertError) throw insertError

    
      setShowSuccess(true)
      setTitle("")
      setUrl("")

      setTimeout(() => setShowSuccess(false), 3000)
    } catch (err) {
      setError("Failed to add bookmark. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      addBookmark()
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bookmark Title
          </label>
          <div className="relative">
            <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none bg-white"
              placeholder="e.g., My Favorite Article"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>
        </div>

        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website URL
          </label>
          <div className="relative">
            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="url"
              className="w-full pl-10 pr-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none bg-white"
              placeholder="e.g., https://example.com"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>


      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-shake">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          {error}
        </div>
      )}


      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          Bookmark added successfully!
        </div>
      )}

      <button
        onClick={addBookmark}
        disabled={isLoading}
        className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium group"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            Add Bookmark
          </>
        )}
      </button>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}