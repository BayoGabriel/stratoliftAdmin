import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request) {
  try {
    await connectDB();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'Active';
    
    // Find all active technicians with their current locations
    const technicians = await User.find({
      role: 'technician',
      status: status
    }).select('_id name email image location currentAssignment sosAlert');
    
    return NextResponse.json({ technicians });
  } catch (error) {
    console.error('Error fetching technicians:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}