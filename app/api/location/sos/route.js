import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// Endpoint to trigger SOS alert
export async function POST(request) {
  try {
    await connectDB();
    
    const { userId, reason } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      {
        'sosAlert.active': true,
        'sosAlert.timestamp': new Date(),
        'sosAlert.reason': reason || 'Emergency assistance needed'
      },
      { new: true }
    );
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // In a real application, you might want to send notifications here
    
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error triggering SOS:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Endpoint to resolve SOS alert
export async function PUT(request) {
  try {
    await connectDB();
    
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      {
        'sosAlert.active': false
      },
      { new: true }
    );
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error resolving SOS:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}