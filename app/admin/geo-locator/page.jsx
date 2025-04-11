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

'use client';

import { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaSearch, FaPhone, FaExclamationTriangle } from 'react-icons/fa';
import { MdMyLocation } from 'react-icons/md';

export default function TechnicianMap() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    // Load Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initializeMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current) return;

    // Default center (can be set to your company's location)
    const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // New York City

    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 12,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    // Fetch technicians after map is loaded
    fetchTechnicians();

    // Set up periodic refresh (every 30 seconds)
    const intervalId = setInterval(fetchTechnicians, 30000);
    return () => clearInterval(intervalId);
  };

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/location/technicians');
      
      if (!response.ok) {
        throw new Error('Failed to fetch technicians');
      }
      
      const data = await response.json();
      setTechnicians(data.technicians);
      updateMapMarkers(data.technicians);
    } catch (err) {
      console.error('Error fetching technicians:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateMapMarkers = (technicianData) => {
    if (!googleMapRef.current) return;
    
    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.setMap(null));
    markersRef.current = {};
    
    const bounds = new window.google.maps.LatLngBounds();
    let hasValidLocations = false;

    technicianData.forEach(tech => {
      if (tech.location && tech.location.coordinates && 
          tech.location.coordinates.length === 2 && 
          tech.location.coordinates[0] !== 0 && 
          tech.location.coordinates[1] !== 0) {
        
        hasValidLocations = true;
        const position = {
          lat: tech.location.coordinates[1],
          lng: tech.location.coordinates[0]
        };
        
        // Create custom marker icon
        const markerIcon = {
          url: tech.image || 'https://via.placeholder.com/40',
          scaledSize: new window.google.maps.Size(40, 40),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(20, 20),
          borderRadius: 20
        };
        
        // Create marker
        const marker = new window.google.maps.Marker({
          position,
          map: googleMapRef.current,
          title: tech.name,
          icon: markerIcon,
          zIndex: tech.sosAlert?.active ? 1000 : 1
        });
        
        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 200px;">
              <div style="font-weight: bold; margin-bottom: 5px;">${tech.name}</div>
              ${tech.currentAssignment?.siteName ? 
                `<div style="margin-bottom: 5px;">
                  <strong>Site:</strong> ${tech.currentAssignment.siteName}
                </div>` : ''}
              ${tech.currentAssignment?.onSite ? 
                '<div style="color: green; margin-bottom: 5px;">● On-Site</div>' : ''}
              ${tech.sosAlert?.active ? 
                '<div style="color: red; font-weight: bold; margin-bottom: 5px;">SOS ALERT</div>' : ''}
              <div style="font-size: 12px; color: #666;">
                Last updated: ${new Date(tech.location.lastUpdated).toLocaleTimeString()}
              </div>
            </div>
          `
        });
        
        // Add click listener
        marker.addListener('click', () => {
          // Close any open info windows
          Object.values(markersRef.current).forEach(m => {
            if (m.infoWindow) m.infoWindow.close();
          });
          
          infoWindow.open(googleMapRef.current, marker);
          marker.infoWindow = infoWindow;
          
          setSelectedTechnician(tech);
        });
        
        // Add SOS visual indicator if needed
        if (tech.sosAlert?.active) {
          const sosCircle = new window.google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: googleMapRef.current,
            center: position,
            radius: 100,
            zIndex: 1
          });
          
          marker.sosCircle = sosCircle;
        }
        
        // Store marker reference
        markersRef.current[tech._id] = marker;
        
        // Extend bounds
        bounds.extend(position);
      }
    });
    
    // Fit map to bounds if we have valid locations
    if (hasValidLocations) {
      googleMapRef.current.fitBounds(bounds);
      
      // Don't zoom in too far
      const listener = googleMapRef.current.addListener('idle', () => {
        if (googleMapRef.current.getZoom() > 16) {
          googleMapRef.current.setZoom(16);
        }
        window.google.maps.event.removeListener(listener);
      });
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredTechnicians = technicians.filter(tech => 
    tech.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTechnicianClick = (tech) => {
    setSelectedTechnician(tech);
    
    if (googleMapRef.current && tech.location?.coordinates) {
      const position = {
        lat: tech.location.coordinates[1],
        lng: tech.location.coordinates[0]
      };
      
      googleMapRef.current.panTo(position);
      googleMapRef.current.setZoom(15);
      
      // Open the info window
      const marker = markersRef.current[tech._id];
      if (marker) {
        // Close any open info windows
        Object.values(markersRef.current).forEach(m => {
          if (m.infoWindow) m.infoWindow.close();
        });
        
        // Create info window if it doesn't exist
        if (!marker.infoWindow) {
          marker.infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 10px; max-width: 200px;">
                <div style="font-weight: bold; margin-bottom: 5px;">${tech.name}</div>
                ${tech.currentAssignment?.siteName ? 
                  `<div style="margin-bottom: 5px;">
                    <strong>Site:</strong> ${tech.currentAssignment.siteName}
                  </div>` : ''}
                ${tech.currentAssignment?.onSite ? 
                  '<div style="color: green; margin-bottom: 5px;">● On-Site</div>' : ''}
                ${tech.sosAlert?.active ? 
                  '<div style="color: red; font-weight: bold; margin-bottom: 5px;">SOS ALERT</div>' : ''}
                <div style="font-size: 12px; color: #666;">
                  Last updated: ${new Date(tech.location.lastUpdated).toLocaleTimeString()}
                </div>
              </div>
            `
          });
        }
        
        marker.infoWindow.open(googleMapRef.current, marker);
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-150px)]">
      <div className="flex items-center mb-4 gap-4">
        <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md flex-1">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search Technicians and clients"
            className="outline-none w-full"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
          onClick={fetchTechnicians}
        >
          <MdMyLocation className="mr-2" /> Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
        <div className="md:col-span-3 bg-white rounded-lg shadow-md overflow-hidden h-full">
          <div className="p-2 bg-blue-100 flex items-center">
            <FaMapMarkerAlt className="text-blue-500 mr-2" />
            <span className="font-semibold">Map</span>
          </div>
          <div ref={mapRef} className="w-full h-[calc(100%-40px)]">
            {loading && !googleMapRef.current && (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center h-full text-red-500">
                <p>Error loading map: {error}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
          <div className="p-3 bg-gray-100 font-semibold border-b">
            Technicians ({filteredTechnicians.length})
          </div>
          <div className="overflow-y-auto h-[calc(100%-50px)]">
            {filteredTechnicians.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {loading ? 'Loading technicians...' : 'No technicians found'}
              </div>
            ) : (
              <ul className="divide-y">
                {filteredTechnicians.map(tech => (
                  <li 
                    key={tech._id} 
                    className={`p-3 hover:bg-gray-50 cursor-pointer ${selectedTechnician?._id === tech._id ? 'bg-blue-50' : ''}`}
                    onClick={() => handleTechnicianClick(tech)}
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        <img 
                          src={tech.image || 'https://via.placeholder.com/40'} 
                          alt={tech.name} 
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        {tech.sosAlert?.active && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            !
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{tech.name}</div>
                        <div className="text-sm text-gray-500">
                          {tech.currentAssignment?.siteName || 'No active assignment'}
                        </div>
                      </div>
                      {tech.currentAssignment?.onSite && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          On-Site
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      
      {selectedTechnician && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-start">
            <img 
              src={selectedTechnician.image || 'https://via.placeholder.com/60'} 
              alt={selectedTechnician.name} 
              className="w-16 h-16 rounded-full mr-4"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold">{selectedTechnician.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaPhone className="mr-2" />
                    <span>Phone number</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span>Last updated: {new Date(selectedTechnician.location?.lastUpdated || Date.now()).toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  {selectedTechnician.currentAssignment?.siteName && (
                    <div className="mb-2">
                      <span className="font-semibold">Current Site:</span> {selectedTechnician.currentAssignment.siteName}
                    </div>
                  )}
                  {selectedTechnician.sosAlert?.active && (
                    <div className="flex items-center text-red-600">
                      <FaExclamationTriangle className="mr-2" />
                      <span className="font-bold">SOS Alert Active</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}