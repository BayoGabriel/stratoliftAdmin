import connectMongo from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { cors, runMiddleware } from '@/lib/cors';

// Handle preflight OPTIONS requests
export async function OPTIONS(req) {
  const res = new Response(null, { status: 204 });
  await runMiddleware(req, res, cors);
  return res;
}

export async function POST(req) {
  const res = new Response(); // dummy res for cors
  await runMiddleware(req, res, cors);

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: 'Please provide email and password' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await connectMongo();

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (user.status !== 'Active') {
      return new Response(
        JSON.stringify({ message: 'Account is inactive. Please contact support.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ message: 'Invalid credentials' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        message: 'Login successful',
        user: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ message: 'Login failed', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
