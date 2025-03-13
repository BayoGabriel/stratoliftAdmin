export default function UserProfile({ name }) {
    return (
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              1
            </span>
          </button>
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium mr-2">{name}</span>
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center relative">
            <img src="/placeholder.svg?height=32&width=32" alt={name} className="h-8 w-8 rounded-full object-cover" />
            <span className="absolute bottom-0 right-0 h-2 w-2 bg-green-500 rounded-full border border-white"></span>
          </div>
        </div>
      </div>
    )
  }
  
  