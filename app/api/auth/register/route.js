import dbConnect from "@/lib/mongoose";
import User from "@/app/api/model/user";
import Tenant from "@/app/api/model/tenant";
import Learner from "@/app/api/model/learner";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, email, password, tenantId, cohortId } = body;

    // ✅ Validate fields
    if (!name || !email || !password || !tenantId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // ✅ Check tenant
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return new Response(
        JSON.stringify({ error: "Invalid or inactive tenant" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // ✅ Check existing user
    const existingUser = await User.findOne({ email, tenantId });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "Email already exists in this tenant" }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // ✅ Create user
    const newUser = new User({
      name,
      email,
      password,
      tenantId,
      roles: "learner", // 👈 your role
    });

    await newUser.save();

    let learner = null;

    // 🔥 ONLY create learner if role is "learner"
    if (newUser.roles === "learner") {
      try {

        learner = await Learner.create({
          userId: newUser._id,
          tenantId: tenantId,
          cohortId: cohortId || null,
           demographics: {}
        });


      } catch (learnerError) {
        console.error("❌ Learner creation failed:", learnerError.message);

        // 🔥 rollback user
        await User.findByIdAndDelete(newUser._id);

        return new Response(
          JSON.stringify({
            error: "Learner creation failed",
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // ✅ Success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "User created successfully",
        userId: newUser._id,
        learnerId: learner?._id || null,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("❌ Register Error:", error);

    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}