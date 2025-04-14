//app/api/location/update/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import LocationHistory from '@/models/Location';

export async function POST(request) {
  try {
    await connectDB();
    
    const { userId, latitude, longitude, address, batteryLevel, accuracy } = await request.json();
    
    if (!userId || !latitude || !longitude) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Update user's current location
    const user = await User.findByIdAndUpdate(
      userId,
      {
        'location.coordinates': [longitude, latitude],
        'location.address': address || '',
        'location.lastUpdated': new Date(),
        'updatedAt': new Date()
      },
      { new: true }
    );
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Save to location history
    await LocationHistory.create({
      userId,
      coordinates: [longitude, latitude],
      address,
      batteryLevel,
      accuracy,
      timestamp: new Date()
    });
    
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}