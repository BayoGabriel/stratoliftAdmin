// app/api/tasks/resolve/route.js - Endpoint for admin/user to mark tasks as resolved/unresolved
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
    const { taskId, resolved, feedback } = body;
    
    if (!taskId || resolved === undefined) {
      return NextResponse.json(
        { success: false, message: 'Task ID and resolved status are required' }, 
        { status: 400 }
      );
    }
    
    // Find the task by taskId
    const task = await Task.findOne({ taskId });
    
    if (!task) {
      return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
    }
    
    // Check if user is the creator or an admin
    const isCreator = task.createdBy.toString() === user._id.toString();
    const isAdmin = user.role === 'admin' && task.school === user.school;
    
    if (!isCreator && !isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Only task creators or admins can mark tasks as resolved/unresolved' }, 
        { status: 403 }
      );
    }
    
    // Update task status
    task.status = resolved ? 'resolved' : 'unresolved';
    
    // Set completedAt if resolving
    if (resolved) {
      task.completedAt = Date.now();
    } else {
      task.completedAt = null;
    }
    
    // Add feedback as an update if provided
    if (feedback) {
      task.updates.push({
        message: `Task marked as ${resolved ? 'resolved' : 'unresolved'}: ${feedback}`,
        updatedBy: user._id
      });
    }
    
    await task.save();
    
    // Get the updated task with populated fields
    const updatedTask = await Task.findOne({ taskId })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('updates.updatedBy', 'name email role');
    
    return NextResponse.json({ success: true, data: updatedTask }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}