import connectMongo from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Validate required fields
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: 'Please provide email and password' }), 
        { status: 400 }
      );
    }

    await connectMongo();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'User not found' }), 
        { status: 404 }
      );
    }

    // Check if user is active
    if (user.status !== 'Active') {
      return new Response(
        JSON.stringify({ message: 'Account is inactive. Please contact support.' }), 
        { status: 403 }
      );
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ message: 'Invalid credentials' }), 
        { status: 400 }
      );
    }

    // Authentication successful
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
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ 
        message: 'Login failed', 
        error: error.message 
      }), 
      { status: 500 }
    );
  }
}
