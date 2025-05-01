import dbConnect from "@/lib/mongodb"
import Task from "@/models/Task"
import User from "@/models/User"
import jwt from 'jsonwebtoken'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

// Helper: Verify JWT from Authorization header
function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Helper: Verify JWT from Authorization header
function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const taskId = id;

    const authHeader = request.headers.get('authorization');
    const decoded = verifyToken(authHeader);

    await dbConnect();

    const user = await User.findById(decoded.id);

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Build query to fetch the task
    let query = { _id: taskId };

    // Apply role-based access control
    if (user.role === "user") {
      // Users can only see their own tasks
      query.createdBy = user._id;
      query.createdBy = user._id
    } else if (user.role === "technician") {
      // Technicians can only see tasks assigned to them
      query.assignedTo = user._id
    } else if (user.role === "admin") {
      // Admins can see all tasks 
      query = { _id: taskId }; // Keep only the ID filter
    }

    // Get the task with populated user info
    const task = await Task.findOne(query)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .populate("updates.updatedBy", "name email role")

    if (!task) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Task not found or you do not have permission to view it",
        }),
        { status: 404, headers: corsHeaders }
      )
    }

    return new Response(
      JSON.stringify({ success: true, data: task }),
      { status: 200, headers: corsHeaders }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 400, headers: corsHeaders }
    )
  }
}

// Add ability to update a specific task
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const taskId = id;

    const authHeader = request.headers.get('authorization');
    const decoded = verifyToken(authHeader);

    if (!decoded) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { status: 401, headers: corsHeaders }
      );
    }

    await dbConnect();

    const user = await User.findById(decoded.id);

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: 'User not found' }),
        { status: 404, headers: corsHeaders }
      );
    }

    const body = await request.json();

    // Build query to find the task
    let query = { _id: taskId }

    // Apply role-based access control for finding the task
    if (user.role === "user") {
      // Users can only update their own tasks
      query.createdBy = user._id
    } else if (user.role === "technician") {
      // Technicians can only update tasks assigned to them
      query.assignedTo = user._id
    } else if (user.role === "admin") {
      query = { _id: taskId }; // Admin can access any task
    }

    // Find the task first to check permissions
    const existingTask = await Task.findOne(query)

    if (!existingTask) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Task not found or you do not have permission to update it",
        }),
        { status: 404, headers: corsHeaders }
      )
    }

    // If there's an update message, add it to the updates array
    if (body.updateMessage) {
      if (!body.updates) {
        body.updates = []
      }

      body.updates.push({
        message: body.updateMessage,
        updatedBy: user._id,
        updatedAt: new Date(),
      })

      // Remove the updateMessage from the body as it's now in the updates array
      delete body.updateMessage
    }

    // Update the task
    const updatedTask = await Task.findOneAndUpdate(query, { $set: body }, { new: true, runValidators: true })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .populate("updates.updatedBy", "name email role")

    return new Response(
      JSON.stringify({ success: true, data: updatedTask }),
      { status: 200, headers: corsHeaders }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 400, headers: corsHeaders }
    )
  }
}

// Add ability to delete a specific task
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const taskId = id;

    const authHeader = request.headers.get('authorization');
    const decoded = verifyToken(authHeader);

    if (!decoded) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { status: 401, headers: corsHeaders }
      );
    }

    await dbConnect();

    const user = await User.findById(decoded.id);

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: 'User not found' }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Build query to find the task
    let query = { _id: taskId }

    // Apply role-based access control
    // Only admins and the original creator can delete tasks
    if (user.role === "user") {
      // Users can only delete their own tasks
      query.createdBy = user._id
    } else if (user.role === "technician") {
      // Technicians cannot delete tasks
      return new Response(
        JSON.stringify({
          success: false,
          message: "Technicians are not authorized to delete tasks",
        }),
        { status: 403, headers: corsHeaders }
      )
    } else if (user.role === "admin") {
      // Admins can delete any task
      query = { _id: taskId };
    }

    // Delete the task
    const deletedTask = await Task.findOneAndDelete(query)

    if (!deletedTask) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Task not found or you do not have permission to delete it",
        }),
        { status: 404, headers: corsHeaders }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Task deleted successfully",
      }),
      { status: 200, headers: corsHeaders }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 400, headers: corsHeaders }
    )
  }
}