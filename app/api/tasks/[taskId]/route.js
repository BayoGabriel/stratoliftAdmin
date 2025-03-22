// app/api/tasks/[taskId]/route.js - Get, update, or delete a specific task
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Task from '@/models/Task';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request, { params }) {
  const { taskId } = params;
  
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
  
  // Find the task by taskId (not MongoDB _id)
  const task = await Task.findOne({ taskId })
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email')
    .populate('updates.updatedBy', 'name email role');
  
  if (!task) {
    return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
  }
  
  // Check if the user has permission to access this task
  const isCreator = task.createdBy._id.toString() === user._id.toString();
  const isAssigned = task.assignedTo && task.assignedTo._id.toString() === user._id.toString();
  const isAdmin = user.role === 'admin' && task.school === user.school;
  
  if (!isCreator && !isAssigned && !isAdmin) {
    return NextResponse.json(
      { success: false, message: 'Not authorized to access this task' }, 
      { status: 403 }
    );
  }

  return NextResponse.json({ success: true, data: task }, { status: 200 });
}

export async function PUT(request, { params }) {
  const { taskId } = params;
  
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
  
  // Find the task by taskId
  const task = await Task.findOne({ taskId });
  
  if (!task) {
    return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
  }
  
  // Check if the user has permission to access this task
  const isCreator = task.createdBy.toString() === user._id.toString();
  const isAssigned = task.assignedTo && task.assignedTo.toString() === user._id.toString();
  const isAdmin = user.role === 'admin' && task.school === user.school;
  
  if (!isCreator && !isAssigned && !isAdmin) {
    return NextResponse.json(
      { success: false, message: 'Not authorized to update this task' }, 
      { status: 403 }
    );
  }
  
  try {
    const body = await request.json();
    const updateData = { ...body };
    
    // Only admins can assign tasks
    if (updateData.assignedTo && user.role !== 'admin') {
      delete updateData.assignedTo;
    }
    
    // Add update to updates array if message is provided
    if (body.updateMessage) {
      task.updates.push({
        message: body.updateMessage,
        updatedBy: user._id
      });
      delete updateData.updateMessage;
    }
    
    // Handle status changes
    if (updateData.status) {
      // Admin or creator can mark as resolved/unresolved
      if (['resolved', 'unresolved'].includes(updateData.status)) {
        if (!isAdmin && !isCreator) {
          return NextResponse.json(
            { success: false, message: 'Only admins or task creators can mark tasks as resolved/unresolved' }, 
            { status: 403 }
          );
        }
        
        // Set completedAt if resolving
        if (updateData.status === 'resolved') {
          updateData.completedAt = Date.now();
        }
      }
      
      // Only technicians or admins can mark as in-progress or completed
      if (['in-progress', 'completed'].includes(updateData.status)) {
        if (!isAssigned && !isAdmin) {
          return NextResponse.json(
            { success: false, message: 'Only assigned technicians or admins can update task progress' }, 
            { status: 403 }
          );
        }
      }
    }
    
    // Update the task
    Object.assign(task, updateData);
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

export async function DELETE(request, { params }) {
  const { taskId } = params;
  
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
  
  // Only admins can delete tasks
  if (user.role !== 'admin') {
    return NextResponse.json(
      { success: false, message: 'Only admins can delete tasks' }, 
      { status: 403 }
    );
  }
  
  try {
    await Task.deleteOne({ taskId });
    return NextResponse.json(
      { success: true, message: 'Task deleted successfully' }, 
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}