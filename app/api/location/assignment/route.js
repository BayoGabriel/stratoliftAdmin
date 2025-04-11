import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// Update technician's current assignment and on-site status
export async function POST(request) {
  try {
    await connectDB();
    
    const { userId, siteId, siteName, onSite, startTime, endTime } = await request.json();
    
    if (!userId || !siteId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      {
        'currentAssignment': {
          siteId,
          siteName,
          onSite: onSite || false,
          startTime: startTime || new Date(),
          endTime: endTime || null
        }
      },
      { new: true }
    );
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error updating assignment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}