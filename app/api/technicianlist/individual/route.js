import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "Technician ID is required" }, { status: 400 });
  }

  try {
    const technician = await User.findById(id);
    if (!technician) return NextResponse.json({ message: "Technician not found" }, { status: 404 });

    return NextResponse.json(technician, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching technician", error }, { status: 500 });
  }
}

