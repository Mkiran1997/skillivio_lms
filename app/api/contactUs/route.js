import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import contactUs from "@/app/api/model/contactUs";
import { sendContactUsEmail } from "@/lib/nodemailer";

export async function GET() {
  try {
    await dbConnect();
    const contactus = await contactUs.find()
    const mapped = contactus.map((c) => ({
      ...c.toObject(),
      id: c._id.toString(),
    }));
    return NextResponse.json(mapped);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const data = await req.json();
    const contactus = await contactUs.create(data);

    let emailSent = false;
    let emailError = null;

    try {
      await sendContactUsEmail(data);
      emailSent = true;
    } catch (err) {
      emailError = err.message;
      console.error("Contact email error:", err);
    }

    return NextResponse.json({
      ...contactus.toObject(),
      id: contactus._id.toString(),
      emailSent,
      emailError,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
