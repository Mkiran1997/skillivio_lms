// app/api/courses/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import user from "@/app/api/model/user";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    // Find the user by ID and populate tenant info
    const userDoc = await user.findById(params.id).populate('tenantId');
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...userDoc.toObject(),
      id: userDoc._id.toString(),
      tenant: userDoc.tenantId, // populated tenant object
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const data = await req.json();

    // If tenantId is being updated, validate it exists
    if (data.tenantId) {
      const tenantExists = await user.db.model('tenants').findById(data.tenantId);
      if (!tenantExists) {
        return NextResponse.json({ error: "Invalid tenantId" }, { status: 400 });
      }
    }

    // Update the user
    const updatedUser = await user.findByIdAndUpdate(params.id, data, { new: true }).populate('tenantId');
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...updatedUser.toObject(),
      id: updatedUser._id.toString(),
      tenant: updatedUser.tenantId,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const deletedUser = await user.findByIdAndDelete(params.id);
    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}