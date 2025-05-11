"use client";

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { FaCamera, FaMapMarkerAlt, FaClock, FaClipboardCheck, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';

export default function TechnicianDashboard() {
  const { data: session } = useSession();
  const [activeClockIn, setActiveClockIn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [image, setImage] = useState(null);
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [recentClockIns, setRecentClockIns] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);

  // Fetch active clock-in and recent records
  useEffect(() => {
    if (session?.accessToken) {
      fetchActiveClockIn();
      fetchRecentClockIns();
    }
  }, [session]);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: '',
          });
          setLocationError(null);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  }, []);

  // Clean up camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const fetchActiveClockIn = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/clock-in?status=active&limit=1', {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      });
      
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        setActiveClockIn(data.data[0]);
      } else {
        setActiveClockIn(null);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching active clock-in:', err);
      setError('Failed to fetch active clock-in');
      setLoading(false);
    }
  };

  const fetchRecentClockIns = async () => {
    try {
      const response = await fetch('/api/clock-in?limit=5', {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setRecentClockIns(data.data);
      }
    } catch (err) {
      console.error('Error fetching recent clock-ins:', err);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImage(dataUrl);
      
      // Stop camera stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setCameraActive(false);
    }
  };

  const resetCamera = () => {
    setImage(null);
    startCamera();
  };

  const uploadImageToCloudinary = async (imageData) => {
    try {
      const response = await fetch('/api/cloudinary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to upload image');
      }
      
      return data.url;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw err;
    }
  };

  const handleClockIn = async () => {
    if (!location) {
      setError('Location is required for clock-in');
      return;
    }
    
    if (!image) {
      setError('Please take a photo for verification');
      return;
    }
    
    try {
      setUploading(true);
      
      // Upload image to Cloudinary
      const imageUrl = await uploadImageToCloudinary(image);
      
      // Submit clock-in
      const response = await fetch('/api/clock-in', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location,
          image: imageUrl,
          notes,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to clock in');
      }
      
      // Reset form and refresh data
      setImage(null);
      setNotes('');
      setActiveClockIn(data.data);
      fetchRecentClockIns();
      setUploading(false);
      
    } catch (err) {
      console.error('Error clocking in:', err);
      setError(err.message || 'Failed to clock in');
      setUploading(false);
    }
  };

  const handleClockOut = async () => {
    if (!activeClockIn) return;
    
    try {
      setUploading(true);
      
      const response = await fetch('/api/clock-in', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: activeClockIn._id,
          notes: notes || activeClockIn.notes,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to clock out');
      }
      
      // Reset and refresh data
      setNotes('');
      setActiveClockIn(null);
      fetchRecentClockIns();
      setUploading(false);
      
    } catch (err) {
      console.error('Error clocking out:', err);
      setError(err.message || 'Failed to clock out');
      setUploading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  if (loading && !activeClockIn && recentClockIns.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Clock In/Out Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          {activeClockIn ? 'Currently Clocked In' : 'Clock In'}
        </h2>
        
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
            <button 
              onClick={() => setError(null)} 
              className="float-right"
            >
              &times;
            </button>
          </div>
        )}
        
        {locationError && (
          <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>{locationError}</p>
          </div>
        )}
        
        {activeClockIn ? (
          <div>
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center">
              <FaClock className="mr-2" />
              <div>
                <p className="font-medium">Clocked in at: {new Date(activeClockIn.clockInTime).toLocaleString()}</p>
                <p className="text-sm">
                  {formatTimeAgo(activeClockIn.clockInTime)}
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-black text-sm font-bold mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes || activeClockIn.notes || ''}
                onChange={(e) => setNotes(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                rows="3"
                placeholder="Add any notes about your work..."
              ></textarea>
            </div>
            
            <button
              onClick={handleClockOut}
              disabled={uploading}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline flex justify-center items-center"
            >
              {uploading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaClock className="mr-2" />
              )}
              Clock Out
            </button>
          </div>
        ) : (
          <div>
            {/* Location */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <FaMapMarkerAlt className="mr-2 text-blue-500" />
                <span className="font-medium">Location:</span>
              </div>
              
              {location ? (
                <div className="bg-black p-3 rounded">
                  <p className="text-sm">
                    Latitude: {location.latitude.toFixed(6)}, 
                    Longitude: {location.longitude.toFixed(6)}
                  </p>
                </div>
              ) : (
                <div className="bg-black p-3 rounded flex justify-center items-center">
                  <FaSpinner className="animate-spin mr-2" />
                  <span>Getting your location...</span>
                </div>
              )}
            </div>
            
            {/* Camera */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <FaCamera className="mr-2 text-blue-500" />
                <span className="font-medium">Verification Photo:</span>
              </div>
              
              <div className="bg-black p-3 rounded">
                {!cameraActive && !image && (
                  <button
                    onClick={startCamera}
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex justify-center items-center"
                  >
                    <FaCamera className="mr-2" />
                    Start Camera
                  </button>
                )}
                
                {cameraActive && (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-auto rounded"
                    />
                    <button
                      onClick={captureImage}
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                    >
                      <FaCamera />
                    </button>
                  </div>
                )}
                
                {image && (
                  <div className="relative">
                    <img
                      src={image || "/placeholder.svg"}
                      alt="Verification"
                      className="w-full h-auto rounded"
                    />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      <button
                        onClick={resetCamera}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold p-2 rounded-full focus:outline-none focus:shadow-outline"
                      >
                        <FaTimes />
                      </button>
                      <button
                        onClick={() => {}}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold p-2 rounded-full focus:outline-none focus:shadow-outline"
                      >
                        <FaCheck />
                      </button>
                    </div>
                  </div>
                )}
                
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </div>
            </div>
            
            {/* Notes */}
            <div className="mb-4">
              <label className="block text-black text-sm font-bold mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                rows="3"
                placeholder="Add any notes about your work..."
              ></textarea>
            </div>
            
            <button
              onClick={handleClockIn}
              disabled={!location || !image || uploading}
              className={`w-full font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline flex justify-center items-center ${
                !location || !image || uploading
                  ? 'bg-black cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-700 text-white'
              }`}
            >
              {uploading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaClock className="mr-2" />
              )}
              Clock In
            </button>
          </div>
        )}
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        
        {recentClockIns.length > 0 ? (
          <div className="space-y-4">
            {recentClockIns.map((record) => (
              <div key={record._id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <FaClock className="mr-2 text-blue-500" />
                      <span className="font-medium">
                        {record.status === 'active' ? 'Clocked In' : 'Completed'}
                      </span>
                    </div>
                    <p className="text-sm text-black">
                      {new Date(record.clockInTime).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    record.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {record.status}
                  </span>
                </div>
                
                {record.clockOutTime && (
                  <div className="mt-2">
                    <div className="flex items-center">
                      <FaClock className="mr-2 text-red-500" />
                      <span className="text-sm">Clocked Out: {new Date(record.clockOutTime).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-black">
                      Duration: {(record.duration || 0).toFixed(2)} hours
                    </p>
                  </div>
                )}
                
                {record.notes && (
                  <div className="mt-2">
                    <div className="flex items-center">
                      <FaClipboardCheck className="mr-2 text-black" />
                      <span className="text-sm font-medium">Notes:</span>
                    </div>
                    <p className="text-sm text-black mt-1">{record.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-black">
            <p>No recent activity found</p>
          </div>
        )}
      </div>
    </div>
  );
}
