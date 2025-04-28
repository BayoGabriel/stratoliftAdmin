import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Task from "@/models/Task"
import User from "@/models/User"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// CORS wrapper
async function withCors(request, handler) {
  const response = await handler();

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS method
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: response.headers });
  }

  return response;
}

export async function GET(request, { params }) {
  return withCors(request, async () => {
    const { id } = await params;
    const taskId = id;

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    try {
      let query = { _id: taskId };

      if (user.role === "user") {
        query.createdBy = user._id;
      } else if (user.role === "technician") {
        query.assignedTo = user._id;
      } else if (user.role === "admin") {
        query = { _id: taskId };
      }

      const task = await Task.findOne(query)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .populate("updates.updatedBy", "name email role");

      if (!task) {
        return NextResponse.json({
          success: false,
          message: "Task not found or you do not have permission to view it",
        }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: task }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
  });
}

export async function PATCH(request, { params }) {
  return withCors(request, async () => {
    const { id } = await params;
    const taskId = id;

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    try {
      const body = await request.json();

      let query = { _id: taskId };

      if (user.role === "user") {
        query.createdBy = user._id;
      } else if (user.role === "technician") {
        query.assignedTo = user._id;
      } else if (user.role === "admin") {
        query = { _id: taskId };
      }

      const existingTask = await Task.findOne(query);

      if (!existingTask) {
        return NextResponse.json({
          success: false,
          message: "Task not found or you do not have permission to update it",
        }, { status: 404 });
      }

      if (body.updateMessage) {
        if (!body.updates) {
          body.updates = [];
        }

        body.updates.push({
          message: body.updateMessage,
          updatedBy: user._id,
          updatedAt: new Date(),
        });

        delete body.updateMessage;
      }

      const updatedTask = await Task.findOneAndUpdate(query, { $set: body }, { new: true, runValidators: true })
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .populate("updates.updatedBy", "name email role");

      return NextResponse.json({ success: true, data: updatedTask }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
  });
}

export async function DELETE(request, { params }) {
  return withCors(request, async () => {
    const { id } = await params;
    const taskId = id;

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    try {
      let query = { _id: taskId };

      if (user.role === "user") {
        query.createdBy = user._id;
      } else if (user.role === "technician") {
        return NextResponse.json({
          success: false,
          message: "Technicians are not authorized to delete tasks",
        }, { status: 403 });
      } else if (user.role === "admin") {
        query = { _id: taskId };
      }

      const deletedTask = await Task.findOneAndDelete(query);

      if (!deletedTask) {
        return NextResponse.json({
          success: false,
          message: "Task not found or you do not have permission to delete it",
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: "Task deleted successfully",
      }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
  });
}

// Optionally, export OPTIONS handler for CORS preflight
export async function OPTIONS() {
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });

  return new Response(null, { status: 204, headers });
}
