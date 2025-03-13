import connectMongo from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { username, email, password, school } = await req.json();

    // Validate required fields
    if (!username || !email || !password || !school) {
      return new Response(
        JSON.stringify({ 
          message: 'Please provide all required fields: name, email, password, and school' 
        }), 
        { status: 400 }
      );
    }

    await connectMongo();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'User with this email already exists' }), 
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      name: username, // Using username as name
      email,
      password: hashedPassword,
      school,
      role: 'user',
      trackedOpportunities: [],
      appliedOpportunities: []
    });

    await newUser.save();

    return new Response(
      JSON.stringify({ 
        message: 'User registered successfully',
        user: {
          name: newUser.name,
          email: newUser.email,
          school: newUser.school,
          role: newUser.role
        }
      }), 
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ 
        message: 'Registration failed', 
        error: error.message 
      }), 
      { status: 500 }
    );
  }
}
