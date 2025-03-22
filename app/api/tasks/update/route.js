// app/api/tasks/update/route.js - Endpoint for technicians to submit task updates
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
  
  // Only technicians and admins can submit updates
  if (user.role !== 'technician' && user.role !== 'admin') {
    return NextResponse.json(
      { success: false, message: 'Only technicians and admins can submit task updates' }, 
      { status: 403 }
    );
  }
  
  try {
    const body = await request.json();
    const { taskId, message, status, attachments } = body;
    
    if (!taskId || !message) {
      return NextResponse.json(
        { success: false, message: 'Task ID and update message are required' }, 
        { status: 400 }
      );
    }
    
    // Find the task by taskId
    const task = await Task.findOne({ taskId });
    
    if (!task) {
      return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
    }
    
    // For technicians, verify they are assigned to this task
    if (user.role === 'technician') {
      if (!task.assignedTo || task.assignedTo.toString() !== user._id.toString()) {
        return NextResponse.json(
          { success: false, message: 'You are not assigned to this task' }, 
          { status: 403 }
        );
      }
    }
    
    // For admins, verify task is from their school
    if (user.role === 'admin' && task.school !== user.school) {
      return NextResponse.json(
        { success: false, message: 'Cannot update tasks from other schools' }, 
        { status: 403 }
      );
    }
    
    // Add update to the task
    task.updates.push({
      message,
      updatedBy: user._id
    });
    
    // Update status if provided
    if (status) {
      // Technicians can only mark tasks as in-progress or completed
      if (user.role === 'technician' && !['in-progress', 'completed'].includes(status)) {
        return NextResponse.json(
          { success: false, message: 'Technicians can only mark tasks as in-progress or completed' }, 
          { status: 400 }
        );
      }
      
      task.status = status;
      
      // Set completedAt if task is completed
      if (status === 'completed') {
        task.completedAt = Date.now();
      }
    }
    
    // Add attachments if provided
    if (attachments && Array.isArray(attachments)) {
      task.attachments = [...task.attachments, ...attachments];
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