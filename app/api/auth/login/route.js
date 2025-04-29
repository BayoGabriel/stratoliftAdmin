import connectMongo from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// Handle POST login request
export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Please provide email and password' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    await connectMongo();

    const user = await User.findOne({ email }).lean(); // Get plain JS object
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    if (user.status !== 'Active') {
      return new Response(
        JSON.stringify({ message: 'Account is inactive. Please contact support.' }),
        {
          status: 403,
          headers: corsHeaders,
        }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Remove sensitive info
    delete user.password;

    return new Response(
      JSON.stringify({
        message: 'Login successful',
        user, // Send full user object without password
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ message: 'Login failed', error: error.message }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// Handle preflight CORS requests
export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Shared CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};
