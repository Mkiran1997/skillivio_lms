import dbConnect from "@/lib/mongoose";
import User from "@/app/api/model/user";
import Tenant from "@/app/api/model/tenant";
import { handleAuthError } from "@/lib/auth";
import Learner from "@/app/api/model/learner";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, password, tenantId } = body;

    if (!name || !email || !password || !tenantId) {
      return handleAuthError("Missing required fields", 400);
    }

    // Validate tenant exists
    const tenant = await Tenant.findOne({
      _id: tenantId,
      $or: [{ status: "Active" }, { isActive: true }]
    });
    if (!tenant) {
      return handleAuthError("Invalid or inactive tenant", 400);
    }

    // Check email uniqueness within tenant
    const existingUser = await User.findOne({ email, tenantId });
    if (existingUser) {
      return handleAuthError("Email already exists in this tenant", 409);
    }

    // Create user (password auto hashed via schema pre-save hook)
    const newUser = new User({
      name,
      email,
      password, // user.js schema uses 'password'
      tenantId,
      roles: "learner",
    });

    await newUser.save();

    let learner = null;
    if (newUser.roles === "learner") {
      learner = await Learner.create({
        userId: newUser._id,
        cohort: body.cohort || ""
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "User registered successfully",
        userId: newUser._id,
        learnerId: learner._id
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Register Error:", error);
    return handleAuthError("Internal server error", 500);
  }
}
