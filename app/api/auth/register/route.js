import connectMongo from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { firstName, lastName, address, email, password, confirmPassword } = await req.json();

    // Validate required fields
    if (!firstName || !lastName || !address || !email || !password) {
      return new Response(
        JSON.stringify({ 
          message: 'Please provide all required fields: firstName, lastName, address, email, and password' 
        }), 
        { status: 400 }
      );
    }

    // Validate password match
    if (password !== confirmPassword) {
      return new Response(
        JSON.stringify({ message: 'Passwords do not match' }), 
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
      firstName,
      lastName,
      address,
      email,
      password: hashedPassword,
      role: 'user',
      status: 'Active'
    });

    await newUser.save();

    return new Response(
      JSON.stringify({ 
        message: 'User registered successfully',
        user: {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
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
