
import {
  FaBell,
  FaExclamationTriangle,
  FaHome,
  FaListUl,
  FaClock,
  FaCommentAlt,
  FaBoxOpen,
  FaTimes,
} from "react-icons/fa"
import Image from "next/image"

const Footer = () => {
  return (
    <nav className="flex justify-around items-center bg-white py-2 fixed bottom-0 w-full max-w-md mx-auto shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-10">
        <div className="flex flex-col items-center text-red-500">
        <FaHome size={20} />
        <span className="text-xs mt-1">Home</span>
        </div>
        <div className="flex flex-col items-center text-gray-600">
        <FaListUl size={20} />
        <span className="text-xs mt-1">Tasks</span>
        </div>
        <div className="flex flex-col items-center text-gray-600">
        <FaClock size={20} />
        <span className="text-xs mt-1">Clock In</span>
        </div>
        <div className="flex flex-col items-center text-gray-600">
        <FaCommentAlt size={20} />
        <span className="text-xs mt-1">Message</span>
        </div>
        <div className="flex flex-col items-center text-gray-600">
        <FaBoxOpen size={20} />
        <span className="text-xs mt-1">Inventory</span>
        </div>
    </nav>
  )
}

export default Footer