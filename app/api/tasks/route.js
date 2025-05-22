// app/api/tasks/route.js
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

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

// POST - Create Task
export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const decoded = verifyToken(authHeader);

    await dbConnect();

    const user = await User.findById(decoded.id);

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: 'User not found' }),
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    const body = await request.json();

    const task = new Task({
      ...body,
      createdBy: user._id,
    });

    await task.save();

    return new Response(
      JSON.stringify({ success: true, data: task }),
      {
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

// GET - Get Tasks
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const decoded = verifyToken(authHeader);

    await dbConnect();

    const user = await User.findById(decoded.id);

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: 'User not found' }),
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    const { searchParams } = new URL(request.url);

    let query = {};

    if (user.role === 'user') {
      query.createdBy = user._id;
    } else if (user.role === 'technician') {
      query.assignedTo = user._id;
    } else if (user.role === 'admin') {
      query = {};
    }

    if (searchParams.get('status')) {
      query.status = searchParams.get('status');
    }

    if (searchParams.get('type')) {
      query.type = searchParams.get('type');
    }

    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName email')
      .populate('updates.updatedBy', 'firstName lastName email role');

    const total = await Task.countDocuments(query);

    return new Response(
      JSON.stringify({
        success: true,
        data: tasks,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      }),
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

// OPTIONS - handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
