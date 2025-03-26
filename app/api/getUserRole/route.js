// app/api/getUserRole/route.js - Get user role
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";

export async function GET(req) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
    }

    try {
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ role: user.role }), { status: 200 });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}
