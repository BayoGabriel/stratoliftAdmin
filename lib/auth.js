import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { jwtVerify } from "jose"

// Get the session on the server
export async function getSession() {
  return await getServerSession(authOptions)
}

// Check if the user is authenticated
export async function getCurrentUser() {
  const session = await getSession()

  if (!session?.user) {
    return null
  }

  return session.user
}

// Middleware to protect routes
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

// Check if user has required role
export async function requireRole(allowedRoles) {
  const user = await requireAuth()

  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized")
  }

  return user
}

// Verify JWT token from Authorization header
export async function verifyToken(req) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null
    }

    const token = authHeader.split(" ")[1]
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET)

    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

// Middleware for API routes
export async function apiAuth(req) {
  const payload = await verifyToken(req)

  if (!payload) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  return payload
}
