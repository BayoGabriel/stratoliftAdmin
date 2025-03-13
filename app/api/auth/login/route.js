import connectMongo from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  const { email, password } = req.body;

  await connectMongo();

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Authentication successful
    return res.status(200).json({
      message: 'Login successful',
      user: {
        username: user.username,
        email: user.email,
        school: user.school,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong', error });
  }
}
