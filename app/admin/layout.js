
"use client"

import { useState } from "react"
import Sidebar from "@/components/AdminDb/Sidebar"
import UserProfile from "@/components/AdminDb/User-profile"

export default function RootLayout({ children }) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="bg-white border border-gray-200 text-gray-700 rounded-md pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search Tasks"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <UserProfile name="James Adamu" />
          </div>

          {children}
        </div>
      </main>
    </div>
  )
}

