// app/api/tasks/assign/route.js - Admin endpoint to assign tasks to technicians
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
  
  // Only admins can assign tasks
  if (user.role !== 'admin') {
    return NextResponse.json(
      { success: false, message: 'Only admins can assign tasks' }, 
      { status: 403 }
    );
  }
  
  try {
    const body = await request.json();
    const { taskId, technicianId, message } = body;
    
    if (!taskId || !technicianId) {
      return NextResponse.json(
        { success: false, message: 'Task ID and technician ID are required' }, 
        { status: 400 }
      );
    }
    
    // Find the task by taskId
    const task = await Task.findOne({ taskId });
    
    if (!task) {
      return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
    }
    
    // Verify task is from admin's school
    if (task.school !== user.school) {
      return NextResponse.json(
        { success: false, message: 'Cannot assign tasks from other schools' }, 
        { status: 403 }
      );
    }
    
    // Find the technician
    const technician = await User.findById(technicianId);
    
    if (!technician) {
      return NextResponse.json({ success: false, message: 'Technician not found' }, { status: 404 });
    }
    
    // Verify technician is from same school and has technician role
    if (technician.school !== user.school || technician.role !== 'technician') {
      return NextResponse.json(
        { success: false, message: 'Invalid technician. Must be from same school and have technician role' }, 
        { status: 400 }
      );
    }
    
    // Update the task
    task.assignedTo = technicianId;
    task.status = 'assigned';
    
    // Add update message if provided
    if (message) {
      task.updates.push({
        message: `Task assigned to technician${message ? `: ${message}` : ''}`,
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