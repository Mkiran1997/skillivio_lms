import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Course from "@/models/course";
import Module from "@/models/module";
import Lesson from "@/models/lesson";
import Enrollment from "@/models/enrollment";
import mongoose from "mongoose";

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
        lessons: mod.lessons ? mod.lessons.map(les => ({
          ...les,
          id: les._id.toString(),
          desc: les.description || les.content?.text
        })) : []
      }));
    }

    return NextResponse.json({
      ...mappedCourse,
      id: populatedCourse._id.toString(),
      _id: populatedCourse._id.toString(),
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
                      video: lessonData.url ? { url: lessonData.url } : undefined,
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
        lessons: mod.lessons ? mod.lessons.map(les => ({
          ...les,
          id: les._id.toString(),
          desc: les.description || les.content?.text
        })) : []
      }));
    }

    return NextResponse.json({
      ...mappedCourse,
      id: populatedCourse._id.toString(),
      _id: populatedCourse._id.toString(),
    });
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