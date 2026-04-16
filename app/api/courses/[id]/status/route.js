import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import Course from "@/models/course";
import Enrollment from "@/models/enrollment";
const fieldMap = {
    title: "title",
    cat: "category",
    desc: "description",
    nqf: "nqfLevel",
    credits: "credits",
    level: "level",
    price: "price",
    free: "isFree",
    saqaId: "saqaId",
    setaAffiliation: "setaAffiliation",
    passingScore: "passingScore",
    type: "type",
    dripEnabled: "dripEnabled",
    status: "status",
    thumb: "thumbnail",
    issueCertificate: "issueCertificate",
    certificateTemplate: "certificateTemplate",
    hasFinalAssessment: "hasFinalAssessment",
    vatInclusive: "vatInclusive",
    previewVideo: "previewVideo",
    learningOutcomes: "learningOutcomes",
    seo: "seo",
};

function mapFields(data, reverse = false) {
    const mapped = {};
    for (const [oldKey, newKey] of Object.entries(fieldMap)) {
        let value = data[oldKey];
        if (reverse) value = data[newKey];

        if (value !== undefined) {
            if (!reverse && (newKey === "category" || newKey === "level") && typeof value === "string") {
                value = value.toLowerCase();
            }

            if (reverse) {
                mapped[oldKey] = value;
            } else {
                mapped[newKey] = value;
            }
        }
    }
    if (data.tenantId) mapped.tenantId = data.tenantId;
    if (reverse && data.modules) mapped.modules = data.modules;
    
    return mapped;
}

export async function PATCH(req, { params }) {
    try {
        await dbConnect();

        const paramsRes = await params;
        const { id } = paramsRes;

        // Prevent CastError if id is "undefined" or otherwise invalid
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid Course ID" }, { status: 400 });
        }

        let { status } = await req.json();
        if (typeof status === "string") {
            status = status.toLowerCase();
        }

        // Check for enrollments if trying to unpublish
        if (status !== "published") {
            const enrollmentCount = await Enrollment.countDocuments({ courseId: id });
            if (enrollmentCount > 0) {
                return NextResponse.json(
                    { error: `Cannot unpublish course: This course has ${enrollmentCount} active student enrollment(s).` },
                    { status: 400 }
                );
            }
        }

        const course = await Course.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).lean();

        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        return NextResponse.json({
            ...mapFields(course, true),
            id: course._id.toString(),
            _id: course._id.toString(), // include both for safety
        });
    } catch (err) {
        console.error("PATCH status error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}