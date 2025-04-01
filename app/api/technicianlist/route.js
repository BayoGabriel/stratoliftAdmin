//api/technicianlist/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();
    const technicians = await User.find({ role: "technician" });

    return NextResponse.json(technicians, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching users", error }, { status: 500 })
  }
}

