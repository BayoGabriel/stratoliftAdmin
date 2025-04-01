// "use client"

// import { useState } from "react"
// import { FaMapMarkerAlt, Faschool, FaSearch, FaPlus, FaMinus, FaMapMarked } from "react-icons/fa"
// import { MdSos, MdPerson, MdBuild, MdMiscellaneousServices } from "react-icons/md"
// import map from "@/public/map.png"
// import Image from "next/image"
// export default function GeolocationMap() {
//   // State for active tab
//   const [activeTab, setActiveTab] = useState("TECHNICIANS")

//   // State for selected technician/item
//   const [selectedItem, setSelectedItem] = useState(null)

//   // Sample data for technicians
//   const technicians = [
//     { id: 1, name: "James Adamu", position: { top: "15%", left: "45%" }, image: "/placeholder.svg?height=40&width=40" },
//     { id: 2, name: "James Adamu", position: { top: "25%", left: "70%" }, image: "/placeholder.svg?height=40&width=40" },
//     { id: 3, name: "James Adamu", position: { top: "40%", left: "50%" }, image: "/placeholder.svg?height=40&width=40" },
//     { id: 4, name: "James Adamu", position: { top: "45%", left: "35%" }, image: "/placeholder.svg?height=40&width=40" },
//     { id: 5, name: "James Adamu", position: { top: "55%", left: "55%" }, image: "/placeholder.svg?height=40&width=40" },
//     { id: 6, name: "James Adamu", position: { top: "65%", left: "30%" }, image: "/placeholder.svg?height=40&width=40" },
//     { id: 7, name: "James Adamu", position: { top: "75%", left: "50%" }, image: "/placeholder.svg?height=40&width=40" },
//     { id: 8, name: "James Adamu", position: { top: "85%", left: "70%" }, image: "/placeholder.svg?height=40&width=40" },
//     {
//       id: 9,
//       name: "Jeffery Mike",
//       position: { top: "35%", left: "15%" },
//       image: "/placeholder.svg?height=40&width=40",
//       isSOS: true,
//     },
//   ]

//   // Sample data for facilities
//   const facilities = [
//     {
//       id: 101,
//       name: "XYZ Plaza",
//       position: { top: "20%", left: "25%" },
//       image: "/placeholder.svg?height=40&width=40",
//       facilityId: "#DH58891",
//       status: "On-Site",
//       contact: {
//         name: "Chris Evan",
//         school: "08127383821",
//       },
//     },
//   ]

//   // Sample data for maintenance locations
//   const maintenanceLocations = [
//     { id: 201, name: "Building A", position: { top: "30%", left: "60%" }, status: "Scheduled" },
//     { id: 202, name: "Building B", position: { top: "50%", left: "40%" }, status: "In Progress" },
//     { id: 203, name: "Building C", position: { top: "70%", left: "60%" }, status: "Completed" },
//   ]

//   // Sample data for service requests
//   const serviceRequests = [
//     { id: 301, name: "Request #45678", position: { top: "25%", left: "55%" }, status: "Pending" },
//     { id: 302, name: "Request #45679", position: { top: "45%", left: "65%" }, status: "Assigned" },
//     { id: 303, name: "Request #45680", position: { top: "65%", left: "45%" }, status: "Completed" },
//   ]

//   // Get items based on active tab
//   const getActiveItems = () => {
//     switch (activeTab) {
//       case "SOS":
//         return technicians.filter((tech) => tech.isSOS)
//       case "TECHNICIANS":
//         return [...technicians, ...facilities]
//       case "MAINTENANCE":
//         return maintenanceLocations
//       case "SERVICE REQUEST":
//         return serviceRequests
//       default:
//         return []
//     }
//   }

//   // Handle item click
//   const handleItemClick = (item) => {
//     setSelectedItem(item === selectedItem ? null : item)
//   }

//   return (
//     <div className="relative h-screen w-full bg-gray-100 overflow-hidden">
//       {/* Map Container */}
//       <div className="relative h-full w-full bg-gray-200 overflow-hidden">
//         {/* Map Image (using a placeholder) */}
//         <Image src={map} alt="Map" className="h-full w-full object-cover" />

//         {/* Map Items */}
//         {getActiveItems().map((item) => (
//           <div
//             key={item.id}
//             className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
//             style={{
//               top: item.position.top,
//               left: item.position.left,
//             }}
//             onClick={() => handleItemClick(item)}
//           >
//             {/* Different display based on item type */}
//             {item.isSOS ? (
//               <div className="bg-red-500 text-white rounded-full p-2 shadow-lg">
//                 <span className="text-xs font-bold">SOS</span>
//               </div>
//             ) : item.facilityId ? (
//               <div className="bg-gray-800 rounded-md p-1 shadow-lg">
//                 <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-8 h-8 object-cover" />
//               </div>
//             ) : item.status && !item.image ? (
//               <div className="bg-blue-500 text-white rounded-full p-2 shadow-lg">
//                 <FaMapMarkerAlt size={16} />
//               </div>
//             ) : (
//               <img
//                 src={item.image || "/placeholder.svg"}
//                 alt={item.name}
//                 className="w-8 h-8 rounded-full border-2 border-white shadow-lg object-cover"
//               />
//             )}

//             {/* Name Label */}
//             <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-2 py-0.5 rounded-full shadow-md text-xs whitespace-nowrap">
//               {item.name}
//             </div>

//             {/* Status Badge for Facility */}
//             {item.status && item.facilityId && (
//               <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full whitespace-nowrap">
//                 {item.status}
//               </div>
//             )}

//             {/* Facility ID */}
//             {item.facilityId && (
//               <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-6 bg-gray-800 text-white px-2 py-0.5 rounded-md shadow-md text-xs whitespace-nowrap">
//                 {item.facilityId}
//               </div>
//             )}
//           </div>
//         ))}

//         {/* Selected Item Details */}
//         {selectedItem && selectedItem.contact && (
//           <div
//             className="absolute z-20 bg-white rounded-lg shadow-lg p-3 max-w-xs"
//             style={{
//               top: `calc(${selectedItem.position.top} + 40px)`,
//               left: selectedItem.position.left,
//             }}
//           >
//             <div className="flex items-center mb-2">
//               <img
//                 src="/placeholder.svg?height=30&width=30"
//                 alt={selectedItem.contact.name}
//                 className="w-6 h-6 rounded-full mr-2"
//               />
//               <span className="text-sm font-medium">{selectedItem.contact.name}</span>
//             </div>
//             <div className="flex items-center text-gray-600">
//               <Faschool size={12} className="mr-2" />
//               <span className="text-xs">{selectedItem.contact.school}</span>
//             </div>
//           </div>
//         )}

//         {/* Map Controls */}
//         <div className="absolute top-4 left-4 bg-white rounded-md shadow-md">
//           <button className="flex items-center justify-center p-2 text-blue-500 font-medium">
//             <FaMapMarked className="mr-2" />
//             Map
//           </button>
//         </div>

//         {/* Search Bar */}
//         <div className="absolute top-4 right-4 w-64">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search Technicians and clients"
//               className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//             />
//             <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           </div>
//         </div>

//         {/* Zoom Controls */}
//         <div className="absolute right-4 bottom-20 flex flex-col bg-white rounded-md shadow-md">
//           <button className="p-2 border-b border-gray-200 hover:bg-gray-100">
//             <FaPlus />
//           </button>
//           <button className="p-2 hover:bg-gray-100">
//             <FaMinus />
//           </button>
//         </div>

//         {/* Tab Navigation */}
//         <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="flex flex-col">
//             {[
//               { id: "SOS", icon: <MdSos size={20} /> },
//               { id: "TECHNICIANS", icon: <MdPerson size={20} /> },
//               { id: "MAINTENANCE", icon: <MdBuild size={20} /> },
//               { id: "SERVICE REQUEST", icon: <MdMiscellaneousServices size={20} /> },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 className={`flex items-center px-4 py-3 text-sm font-medium ${
//                   activeTab === tab.id ? "bg-white text-gray-800" : "text-gray-600 hover:bg-gray-50"
//                 }`}
//                 onClick={() => setActiveTab(tab.id)}
//               >
//                 <div className="relative flex items-center">
//                   {tab.icon}
//                   {activeTab === tab.id && (
//                     <span className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></span>
//                   )}
//                 </div>
//                 <span className="ml-3">{tab.id}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

import React from 'react'

const Locator = () => {
  return (
    <div>Locator</div>
  )
}

export default Locator