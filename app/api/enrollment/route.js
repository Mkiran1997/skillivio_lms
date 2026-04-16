import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Enrollment from "@/models/enrollment";
import Learner from "@/models/learner";
import Course from "@/models/course";
import Module from "@/models/module";
import Lesson from "@/models/lesson";
import { getAuthContext } from "@/lib/auth";
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId");
    const learnerId = searchParams.get("learnerId");
    const courseId = searchParams.get("courseId");
    const status = searchParams.get("status");

    const query = {};
    if (tenantId) query.tenantId = tenantId;
    if (learnerId) query.learnerId = learnerId;
    if (courseId) query.courseId = courseId;
    if (status) query.status = status;

    const enrollments = await Enrollment.find(query)
      .populate("learnerId")
      .populate({
        path: "courseId",
        populate: { path: "modules", populate: { path: "lessons" } }
      })
      .lean();

    const mapped = enrollments.map(e => ({
      ...e,
      id: e._id.toString(),
    }));
    return NextResponse.json(mapped);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const auth = await getAuthContext(req);
    const data = await req.json();

    const {
      courseId, learnerId, tenantId,
      qualification, entryRequirements, entryAssessment,
      declaration, popiaConsent, provider, documents,
      // Mapping fields from common frontend structures
      intakeNo, mode, startDate, endDate, saqaId, nqfLevel, credits,
      enteyRequest, assessment, popia, docs, personal
    } = data;

    const finalCourseId = courseId || data.courseId;
    const finalTenantId = tenantId || auth.user?.tenantId?._id || auth.tenant?._id;

    if (!finalCourseId) {
      return NextResponse.json({ error: "courseId is required for enrollment" }, { status: 400 });
    }
    if (!learnerId) {
       return NextResponse.json({ error: "learnerId is required for enrollment" }, { status: 400 });
    }
    if (!finalTenantId) {
       return NextResponse.json({ error: "tenantId is required (could not be derived from auth)" }, { status: 400 });
    }

    const enrollmentData = {
      courseId: finalCourseId,
      learnerId,
      tenantId: finalTenantId,
      qualification: {
        saqaId: qualification?.saqaId || saqaId,
        nqfLevel: qualification?.nqfLevel || nqfLevel,
        credits: qualification?.credits || credits,
        intakeNumber: qualification?.intakeNumber || intakeNo || `INT-${Date.now()}`,
        startDate: qualification?.startDate || startDate || new Date(),
        plannedEndDate: qualification?.plannedEndDate || endDate,
        deliveryMode: qualification?.deliveryMode || mode?.toLowerCase() || "blended",
      },
      // Handle the 'enteyRequest' typo variant from the frontend
      entryRequirements: entryRequirements || (enteyRequest && enteyRequest.map(r => ({
          requirement: r.req,
          submitted: r.sub === 'Y',
          verified: !!r.verBy,
          verifiedBy: r.verBy,
          verifiedDate: r.date
      }))) || [],
      entryAssessment: {
          conducted: (entryAssessment?.conducted || assessment?.conducted) === "Yes",
          date: entryAssessment?.date || assessment?.dateCond,
          outcome: (function(val) {
              if (!val) return null;
              const v = val.toLowerCase();
              if (v.includes("competent") && v.includes("approved")) return "competent";
              if (v.includes("competent")) return "competent";
              if (v.includes("bridging")) return "bridging";
              if (v.includes("not competent")) return "not-competent";
              return null;
          })(entryAssessment?.outcome || assessment?.outcome),
          assessorName: entryAssessment?.assessorName || assessment?.assessor,
          assessorSignature: entryAssessment?.assessorSignature || assessment?.sig,
      },
      declaration: {
          agreed: !!(declaration?.agreed),
          name: declaration?.name,
          signature: declaration?.sig || declaration?.signature,
          date: declaration?.date,
      },
      popiaConsent: {
          granted: !!(popiaConsent?.granted || popia?.consent),
          signature: popiaConsent?.signature || popia?.sig,
          date: popiaConsent?.date || popia?.date,
      },
      provider: {
          entryVerified: (provider?.entryVerified || provider?.verified) === "Yes",
          learnerApproved: (provider?.learnerApproved || provider?.approved) === "Yes",
          qctoSubmittedDate: provider?.qctoSubmittedDate || provider?.qctoDate,
          representativeName: provider?.representativeName || provider?.repName,
          representativeSignature: provider?.representativeSignature || provider?.sig,
          approvalDate: provider?.approvalDate || provider?.date,
      },
      documents: {
          certifiedId: documents?.certifiedId || docs?.certifiedId,
          highestQualification: documents?.highestQualification || docs?.highestQual,
          cv: documents?.cv || docs?.cv,
          studyPermit: documents?.studyPermit || docs?.studyPermit,
          workplaceConfirmation: documents?.workplaceConfirmation || docs?.workplaceConf,
          entryAssessmentRecord: documents?.entryAssessmentRecord || docs?.entryAssessment,
          proofOfPayment: documents?.proofOfPayment || docs?.proofOfPayment,
      },
      status: "draft",
    };

    const enrollment = await Enrollment.create(enrollmentData);
    return NextResponse.json({
      ...enrollment.toObject(),
      id: enrollment._id.toString(),
    });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}