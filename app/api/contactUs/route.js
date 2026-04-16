import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import ContactUs from "@/models/contactUs";
import { sendContactUsEmail } from "@/lib/nodemailer";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId");
    const status = searchParams.get("status");

    const query = {};
    if (tenantId) query.tenantId = tenantId;
    if (status) query.status = status;

    const contacts = await ContactUs.find(query)
      .populate("assignedTo", "name email")
      .lean();

    const mapped = contacts.map(c => ({
      ...c,
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
    const { tenantId, firstName, lastName, email, phone, company, jobTitle, message, source } = data;

    const contactData = {
      firstName,
      lastName,
      email,
      phone: phone || null,
      company: company || null,
      jobTitle: jobTitle || null,
      message: message || null,
      source: source || "website",
      tenantId,
      status: "new",
    };

    const contact = await ContactUs.create(contactData);

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
      ...contact.toObject(),
      id: contact._id.toString(),
      emailSent,
      emailError,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}