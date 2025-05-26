"use client"

import { useState, useEffect, useRef } from "react"
import { FaMapMarkerAlt, FaClock, FaUser, FaCalendarAlt, FaFilter, FaSearch } from "react-icons/fa"
import { MdLocationOn, MdAccessTime, MdPerson } from "react-icons/md"
import { useSession } from "next-auth/react"

export default function ClockInMap() {
  const { data: session } = useSession()
  const [clockIns, setClockIns] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedClockIn, setSelectedClockIn] = useState(null)
  const [filter, setFilter] = useState("all")
  const [searchDate, setSearchDate] = useState("")
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])
  const [leafletLoaded, setLeafletLoaded] = useState(false)

  // Load Leaflet CSS and JS
  useEffect(() => {
    if (typeof window !== "undefined" && !window.L) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)

      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.onload = () => {
        console.log("Leaflet loaded successfully")
        setLeafletLoaded(true)
      }
      script.onerror = () => {
        console.error("Failed to load Leaflet")
      }
      document.head.appendChild(script)
    } else if (window.L) {
      setLeafletLoaded(true)
    }
  }, [])

  // Initialize map when Leaflet is loaded
  useEffect(() => {
    if (leafletLoaded && mapRef.current && !map && window.L) {
      console.log("Initializing map...")
      try {
        const newMap = window.L.map(mapRef.current, {
          center: [40.7128, -74.006],
          zoom: 10,
          zoomControl: true,
        })

        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(newMap)

        console.log("Map initialized successfully")
        setMap(newMap)
      } catch (error) {
        console.error("Error initializing map:", error)
      }
    }
  }, [leafletLoaded, map])

  // Fetch clock-in data
  useEffect(() => {
    if (session?.accessToken) {
      fetchClockIns()
    }
  }, [filter, searchDate, session])

  // Update markers when clockIns or map changes
  useEffect(() => {
    if (map && clockIns.length > 0) {
      console.log("Updating markers for", clockIns.length, "clock-ins")
      updateMapMarkers(clockIns)
    }
  }, [map, clockIns])

  const fetchClockIns = async () => {
    if (!session?.accessToken) return

    try {
      setLoading(true)
      let url = "/api/clock-in?limit=100"

      if (filter !== "all") {
        url += `&status=${filter}`
      }

      if (searchDate) {
        url += `&date=${searchDate}`
      }

      console.log("Fetching clock-ins from:", url)

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Fetched clock-ins:", data.data)
        setClockIns(data.data || [])
      } else {
        console.error("Failed to fetch clock-ins:", response.status)
      }
    } catch (error) {
      console.error("Error fetching clock-ins:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateMapMarkers = (clockInData) => {
    if (!map || !window.L) {
      console.log("Map or Leaflet not available")
      return
    }

    console.log("Clearing existing markers:", markers.length)
    // Clear existing markers
    markers.forEach((marker) => {
      map.removeLayer(marker)
    })

    const newMarkers = []
    let validLocations = 0

    clockInData.forEach((clockIn, index) => {
      console.log(`Processing clock-in ${index + 1}:`, {
        id: clockIn._id,
        user: clockIn.user?.firstName,
        location: clockIn.location,
      })

      if (clockIn.location?.latitude && clockIn.location?.longitude) {
        const lat = Number.parseFloat(clockIn.location.latitude)
        const lng = Number.parseFloat(clockIn.location.longitude)

        console.log(`Creating marker at: ${lat}, ${lng}`)

        if (!isNaN(lat) && !isNaN(lng)) {
          try {
            const marker = window.L.marker([lat, lng])
              .addTo(map)
              .bindPopup(`
                <div style="min-width: 200px; font-family: Arial, sans-serif;">
                  <h3 style="margin: 0 0 8px 0; color: #2563eb; font-size: 16px;">${clockIn.user?.firstName || "Unknown"} ${clockIn.user?.lastName || ""}</h3>
                  ${clockIn.location.address ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Address:</strong> ${clockIn.location.address}</p>` : ""}
                  ${clockIn.notes ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Notes:</strong> ${clockIn.notes}</p>` : ""}
                </div>
              `)
              .on("click", () => setSelectedClockIn(clockIn))

            newMarkers.push(marker)
            validLocations++
            console.log(`Marker ${validLocations} created successfully`)
          } catch (error) {
            console.error(`Error creating marker for clock-in ${index + 1}:`, error)
          }
        } else {
          console.log(`Invalid coordinates for clock-in ${index + 1}: ${lat}, ${lng}`)
        }
      } else {
        console.log(`No location data for clock-in ${index + 1}`)
      }
    })

    setMarkers(newMarkers)
    console.log(`Created ${validLocations} markers out of ${clockInData.length} clock-ins`)

    // Fit map to show all markers
    if (newMarkers.length > 0) {
      try {
        const group = new window.L.featureGroup(newMarkers)
        map.fitBounds(group.getBounds().pad(0.1))
        console.log("Map bounds fitted to markers")
      } catch (error) {
        console.error("Error fitting map bounds:", error)
      }
    } else {
      console.log("No markers to fit bounds to")
    }
  }

  const formatDuration = (hours) => {
    if (!hours) return "N/A"
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h}h ${m}m`
  }

  const getStatusColor = (status) => {
    return status === "active" ? "text-green-600" : "text-gray-500"
  }

  const getStatusBadgeColor = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        

        <div className="bg-white rounded-xl shadow-lg h-full">
              <div className="p-4 bg-[#EC3237] text-white">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <MdLocationOn className="text-xl" />
                  Geo Locations
                </h2>
              </div>
              <div className="relative">
                {(!leafletLoaded || loading) && (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">{!leafletLoaded ? "Loading map..." : "Loading locations..."}</p>
                    </div>
                  </div>
                )}
                <div ref={mapRef} className="h-[1000px] w-full"></div>
                {clockIns.length > 0 && markers.length === 0 && !loading && (
                  <div className="absolute bottom-4 left-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded text-sm">
                    Clock-ins found but no valid locations to display
                  </div>
                )}
              </div>
            </div>
      </div>
    </div>
  )
}
