import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Course from "@/models/course";
import Module from "@/models/module";
import Lesson from "@/models/lesson";
import Enrollment from "@/models/enrollment";
import mongoose from "mongoose";
import { signCourseAssets, uploadCourseMaterial } from "@/lib/s3";

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

  // Basic field mapping from fieldMap
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

  // Handle tenantId which is not in fieldMap
  if (!reverse && data.tenantId) {
    mapped.tenantId = data.tenantId;
  }

  // Include materials array
  if (data.materials) Object.assign(mapped, { materials: data.materials });

  // Only include relations/tenantId when sending back to frontend
  if (reverse) {
    if (data.modules) mapped.modules = data.modules;
    if (data.prerequisites) mapped.prerequisites = data.prerequisites;
    if (data.tenantId) mapped.tenantId = data.tenantId;
  }

  return mapped;
}


export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const populatedCourse = await Course.findById(id)
      .populate({
        path: "modules",
        populate: { path: "lessons" }
      })
      .lean();

    if (!populatedCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const mappedCourse = mapFields(populatedCourse, true);
    if (populatedCourse.modules) {
      mappedCourse.modules = populatedCourse.modules.map(mod => ({
        ...mod,
        id: mod._id.toString(),
        moduleName: mod.name,
        lessons: mod.lessons ? mod.lessons.map(les => {
          let url = "";
          const lType = (les.type || "text").toLowerCase();
          if (lType === "video") url = les.content?.video?.url;
          else if (["pdf", "document", "audio"].includes(lType)) url = les.content?.document?.url;

          return {
            ...les,
            id: les._id.toString(),
            desc: les.description || les.content?.text,
            url: url || les.url
          };
        }) : []
      }));
    }

    const result = {
      ...mappedCourse,
      id: populatedCourse._id.toString(),
      _id: populatedCourse._id.toString(),
    };
    const signedResult = await signCourseAssets(result);
    return NextResponse.json(signedResult);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



async function handleRequestData(req, courseId) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const dataString = formData.get("data");
    const data = dataString ? JSON.parse(dataString) : {};

    // 1. Handle course-level files (thumb and previewVideo)
    const thumbFile = formData.get("thumb");
    if (thumbFile && typeof thumbFile !== "string") {
      const buffer = Buffer.from(await thumbFile.arrayBuffer());
      data.thumb = await uploadCourseMaterial(buffer, courseId, thumbFile.name, thumbFile.type, "materials");
    }

    const previewVideoFile = formData.get("previewVideo");
    if (previewVideoFile && typeof previewVideoFile !== "string") {
      const buffer = Buffer.from(await previewVideoFile.arrayBuffer());
      data.previewVideo = await uploadCourseMaterial(buffer, courseId, previewVideoFile.name, previewVideoFile.type, "materials");
    }

    // 2. Handle lesson-level files
    // Expecting fields like "lesson_file_0_1" for module index 0, lesson index 1
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("lesson_file_") && typeof value === 'object' && value.name) {
        const parts = key.split("_");
        const mIdx = parseInt(parts[2]);
        const lIdx = parseInt(parts[3]);

        if (data.modules && data.modules[mIdx] && data.modules[mIdx].lessons && data.modules[mIdx].lessons[lIdx]) {
          const buffer = Buffer.from(await value.arrayBuffer());
          const s3Url = await uploadCourseMaterial(buffer, courseId, value.name, value.type, "lessons");
          data.modules[mIdx].lessons[lIdx].url = s3Url;
        }
      }

      // Handle course materials
      if (key.startsWith("material_file_") && typeof value === 'object' && value.name) {
        const parts = key.split("_");
        const idx = parts[2];
        const buffer = Buffer.from(await value.arrayBuffer());
        const s3Url = await uploadCourseMaterial(buffer, courseId, value.name, value.type, "materials");
        const customName = formData.get(`material_name_${idx}`) || value.name;
        const customDesc = formData.get(`material_desc_${idx}`) || "Course Material";

        data.materials = data.materials || [];
        data.materials.push({
          url: s3Url,
          filename: customName,
          size: Math.round(value.size / 1024) + " KB",
          fileType: "OTHER",
          desc: customDesc
        });
      }
    }

    return data;
  }
  return await req.json();
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const data = await handleRequestData(req, id);
    const mappedData = mapFields(data);
    const course = await Course.findByIdAndUpdate(id, mappedData, { new: true });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (data.modules && Array.isArray(data.modules)) {
      const tenantId = course.tenantId || mappedData.tenantId || data.tenantId;

      // 1. Temporarily shift existing orders to avoid unique key conflicts during update
      await Module.updateMany({ courseId: id }, { $inc: { order: 1000 } });
      await Lesson.updateMany({ courseId: id }, { $inc: { order: 1000 } });

      const incomingModuleIds = [];
      const incomingLessonIds = [];

      const updatedModules = await Promise.all(
        data.modules.map(async (moduleData, idx) => {
          let moduleId = moduleData._id || moduleData.id;
          if (!moduleId || !mongoose.Types.ObjectId.isValid(moduleId)) {
            moduleId = new mongoose.Types.ObjectId();
          }
          incomingModuleIds.push(moduleId.toString());

          const updatedModule = await Module.findOneAndUpdate(
            { _id: moduleId },
            {
              name: moduleData.moduleName || moduleData.name,
              description: moduleData.description,
              courseId: id,
              tenantId: tenantId,
              order: idx + 1,
              isOptional: moduleData.isOptional,
              weight: moduleData.weight,
            },
            { upsert: true, new: true }
          );

          if (moduleData.lessons && Array.isArray(moduleData.lessons)) {
            const updatedLessons = await Promise.all(
              moduleData.lessons.map(async (lessonData, lid) => {
                let lessonId = lessonData._id || lessonData.id;
                if (!lessonId || !mongoose.Types.ObjectId.isValid(lessonId)) {
                  lessonId = new mongoose.Types.ObjectId();
                }
                incomingLessonIds.push(lessonId.toString());

                return await Lesson.findOneAndUpdate(
                  { _id: lessonId },
                  {
                    title: lessonData.title,
                    description: lessonData.desc || lessonData.description,
                    type: (lessonData.type || "text").toLowerCase(),
                    moduleId: updatedModule._id,
                    courseId: id,
                    tenantId: tenantId,
                    order: lid + 1,
                    content: {
                      text: lessonData.desc || lessonData.description,
                      video:
                        (lessonData.type || "").toLowerCase() === "video"
                          ? { url: lessonData.url, provider: "upload" }
                          : undefined,
                      document: ["pdf", "document", "audio"].includes(
                        (lessonData.type || "").toLowerCase()
                      )
                        ? { url: lessonData.url, filename: lessonData.tempName }
                        : undefined,
                    },
                    duration: lessonData.duration,
                    thumbnail: lessonData.thumb || lessonData.thumbnail,
                  },
                  { upsert: true, new: true }
                );
              })
            );

            updatedModule.lessons = updatedLessons.map(l => l._id);
            await updatedModule.save();
          }

          return updatedModule;
        })
      );

      // 2. Cleanup: Delete modules and lessons not in the updated list
      await Module.deleteMany({
        courseId: id,
        _id: { $nin: incomingModuleIds }
      });
      await Lesson.deleteMany({
        courseId: id,
        _id: { $nin: incomingLessonIds }
      });

      course.modules = updatedModules.map(m => m._id);
      await course.save();
    }


    const populatedCourse = await Course.findById(id)
      .populate({
        path: "modules",
        populate: { path: "lessons" }
      })
      .lean();

    const mappedCourse = mapFields(populatedCourse, true);
    if (populatedCourse.modules) {
      mappedCourse.modules = populatedCourse.modules.map(mod => ({
        ...mod,
        id: mod._id.toString(),
        moduleName: mod.name,
        lessons: mod.lessons ? mod.lessons.map(les => {
          let url = "";
          const lType = (les.type || "text").toLowerCase();
          if (lType === "video") url = les.content?.video?.url;
          else if (["pdf", "document", "audio"].includes(lType)) url = les.content?.document?.url;

          return {
            ...les,
            id: les._id.toString(),
            desc: les.description || les.content?.text,
            url: url || les.url
          };
        }) : []
      }));
    }

    const result = {
      ...mappedCourse,
      id: populatedCourse._id.toString(),
      _id: populatedCourse._id.toString(),
    };
    const signedResult = await signCourseAssets(result);
    return NextResponse.json(signedResult);
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const courseId = new mongoose.Types.ObjectId(id);

    // Check for enrollments
    const enrollmentCount = await Enrollment.countDocuments({ courseId: courseId });
    if (enrollmentCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete course: This course has ${enrollmentCount} active enrollment(s). Please unenroll all learners before deleting.` },
        { status: 400 }
      );
    }

    const course = await Course.findByIdAndDelete(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Cascaded deletion
    await Module.deleteMany({ courseId: courseId });
    await Lesson.deleteMany({ courseId: courseId });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}