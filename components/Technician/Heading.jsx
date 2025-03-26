import {
    FaBell,
  } from "react-icons/fa"
import Image from "next/image"

const Heading = () => {
  return (
    <>
        <header className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-10 shadow-sm">
          <div className="text-red-500">
            <FaBell size={24} />
          </div>
          <h1 className="text-xl font-semibold text-red-500">Technician Dashboard</h1>
          <div className="rounded-full overflow-hidden">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="Profile"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        </header>
    </>
  )
}

export default Heading