

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