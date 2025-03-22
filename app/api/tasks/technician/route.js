// app/api/tasks/technician/route.js - Endpoint for technicians to see their assigned tasks
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Task from '@/models/Task';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  
  await dbConnect();
  
  // Get the user from the database
  const user = await User.findOne({ email: session.user.email });
  
  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
  }
  
  // Only technicians can access this endpoint
  if (user.role !== 'technician') {
    return NextResponse.json(
      { success: false, message: 'Only technicians can access this endpoint' }, 
      { status: 403 }
    );
  }
  
  try {
    const { searchParams } = new URL(request.url);
    
    // Build query
    let query = {
      assignedTo: user._id,
      school: user.school
    };
    
    // Filter by status if provided
    if (searchParams.get('status')) {
      query.status = searchParams.get('status');
    }
    
    // Filter by type if provided
    if (searchParams.get('type')) {
      query.type = searchParams.get('type');
    }
    
    // Pagination
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    
    // Get tasks
    const tasks = await Task.find(query)
      .sort({ 
        // Sort by priority and creation date
        priority: -1, // This will sort urgent (high) first
        createdAt: -1 
      })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('updates.updatedBy', 'name email role');
    
    const total = await Task.countDocuments(query);
    
    return NextResponse.json({ 
      success: true, 
      data: tasks,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}