//app/api/clock-in/route.js
import dbConnect from '@/lib/mongodb';
import ClockIn from '@/models/ClockIn';
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

// POST - Create ClockIn
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

    const clockIn = new ClockIn({
      user: user._id,
      clockInTime: new Date(),
      location: body.location,
      image: body.image,
      notes: body.notes,
      status: 'active'
    });

    await clockIn.save();

    return new Response(
      JSON.stringify({ success: true, data: clockIn }),
      {
        status: 201,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 401,
        headers: corsHeaders,
      }
    );
  }
}

// PUT - Clock Out
export async function PUT(request) {
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
    const { id, notes } = body;

    const clockIn = await ClockIn.findOne({ 
      _id: id,
      user: user._id,
      status: 'active'
    });

    if (!clockIn) {
      return new Response(
        JSON.stringify({ success: false, message: 'Active clock-in record not found' }),
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    clockIn.clockOutTime = new Date();
    clockIn.status = 'completed';
    if (notes) clockIn.notes = notes;
    clockIn.updatedAt = new Date();

    await clockIn.save();

    return new Response(
      JSON.stringify({ success: true, data: clockIn }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 401,
        headers: corsHeaders,
      }
    );
  }
}

// GET - Get Clock-ins
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

    if (user.role === 'technician') {
      query.user = user._id;
    }

    if (searchParams.get('status')) {
      query.status = searchParams.get('status');
    }

    if (searchParams.get('date')) {
      const date = new Date(searchParams.get('date'));
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      
      query.clockInTime = {
        $gte: date,
        $lt: nextDay
      };
    }

    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const clockIns = await ClockIn.find(query)
      .sort({ clockInTime: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'firstName lastName email role');

    const total = await ClockIn.countDocuments(query);

    return new Response(
      JSON.stringify({
        success: true,
        data: clockIns,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 401,
        headers: corsHeaders,
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
