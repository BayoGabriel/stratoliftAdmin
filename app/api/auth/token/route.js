// app/api/auth/token/route.js
import jwt from "jsonwebtoken";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request) {
  try {
    const userData = await request.json();

    if (!userData.email || !userData.id || !userData.role) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required user data" }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const token = jwt.sign(
      {
        id: userData.id,
        email: userData.email,
        role: userData.role,
      },
      process.env.NEXTAUTH_SECRET,
      { expiresIn: "30d" }
    );

    return new Response(
      JSON.stringify({ 
        success: true, 
        token,
        user: {
          id: userData.id,
          email: userData.email,
          role: userData.role
        }
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
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  }
}
