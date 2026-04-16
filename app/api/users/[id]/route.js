import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/user";
import Tenant from "@/models/tenant";
import Learner from "@/models/learner";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const userDoc = await User.findById(id).select("-password").lean();
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let learner = null;
    learner = await Learner.findOne({ userId: userDoc._id }).lean();

    return NextResponse.json({
      ...userDoc,
      id: userDoc._id.toString(),
      learner
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const data = await req.json();
    const { tenantId, cohortId } = data;

    if (tenantId) {
      const tenantExists = await Tenant.findById(tenantId);
      if (!tenantExists) {
        return NextResponse.json({ error: "Invalid tenantId" }, { status: 400 });
      }
    }

    const updateData = {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.phone && { phone: data.phone }),
      ...(data.avatar && { avatar: data.avatar }),
      ...(data.roles && { roles: data.roles }),
      ...(tenantId && { tenantId }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    };

    if (data.password) {
      updateData.password = data.password;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password").lean();
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let learner = null;
    if (data.cohortId !== undefined || data.status || data.demographics || data.contact) {
      const learnerUpdate = {
        ...(cohortId !== undefined && { cohortId }),
        ...(data.status && { status: data.status }),
        ...(data.demographics && { demographics: data.demographics }),
        ...(data.contact && { contact: data.contact }),
      };
      learner = await Learner.findOneAndUpdate(
        { userId: id },
        learnerUpdate,
        { new: true, upsert: true }
      );
    } else {
      learner = await Learner.findOne({ userId: id }).lean();
    }

    return NextResponse.json({
      ...updatedUser,
      id: updatedUser._id.toString(),
      learner
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const userDoc = await User.findByIdAndDelete(id);
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await Learner.findOneAndDelete({ userId: id });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}