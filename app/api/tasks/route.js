// app/api/tasks/route.js - Create new task and get tasks
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Task from '@/models/Task';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
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

  try {
    const body = await request.json();
    
    // Create a new task
    const task = new Task({
      ...body,
      createdBy: user._id,
      school: user.school  // Assuming school comes from the user
    });
    
    await task.save();
    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

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
  
  try {
    const { searchParams } = new URL(request.url);
    
    let query = {};
    
    // Filter tasks based on user role
    if (user.role === 'user') {
      // Users can only see their own tasks
      query.createdBy = user._id;
    } else if (user.role === 'technician') {
      // Technicians can see tasks assigned to them
      query.assignedTo = user._id;
    } else if (user.role === 'admin') {
      // Admins can see all tasks from their school
      query.school = user.school;
    }
    
    // Additional filters from query params
    if (searchParams.get('status')) {
      query.status = searchParams.get('status');
    }
    
    if (searchParams.get('type')) {
      query.type = searchParams.get('type');
    }
    
    // Pagination
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    
    // Get tasks with populated user info
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
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