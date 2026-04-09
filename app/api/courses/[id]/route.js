// app/api/courses/[id]/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import Course from "@/app/api/model/course";
import Module from "@/app/api/model/module";
import Lesson from "@/app/api/model/lesson";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const paramsRes = await params;
    const course = await Course.findById(paramsRes.id).populate({
      path: "modules",
      populate: { path: "lessons" }, // This will also populate lessons inside each module
    });
    if (!course)
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    return NextResponse.json({
      ...course.toObject(),
      id: course._id.toString(),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id: courseId } = await params;
    const data = await req.json();

    // 1. Update the Course
    const course = await Course.findByIdAndUpdate(
      courseId,
      {
        title: data.title,
        cat: data.cat,
        level: data.level,
        nqf: data.nqf,
        credits: data.credits,
        price: data.price,
        free: data.free,
        saqaId: data.saqaId,
        setaAffiliation: data.setaAffiliation,
        passingScore: data.passingScore,
        desc: data.desc,
        type: data.type,
        dripEnabled: data.dripEnabled,
        status: data.status,
        thumb: data.thumb,
        issueCertificate: data.issueCertificate,
      },
      { returnDocument: "after" }, // Updated for deprecation
    );

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // 2. Upsert Modules
    const updatedModules = await Promise.all(
      (data.modules || []).map(async (moduleData) => {
        // If no ID exists, create a new one for the upsert
        const moduleId = moduleData._id || new mongoose.Types.ObjectId();

        const updatedModule = await Module.findOneAndUpdate(
          { _id: moduleId },
          {
            moduleName: moduleData.moduleName,
            courseId: courseId,
          },
          {
            upsert: true,
            returnDocument: "after", // Updated for deprecation
            setDefaultsOnInsert: true,
          },
        );

        // 3. Upsert Lessons
        const updatedLessons = await Promise.all(
          (moduleData.lessons || []).map(async (lessonData) => {
            const isObject = typeof lessonData === "object";


            // Generate ID if missing to allow Creation
            const lessonId = isObject
              ? lessonData._id || new mongoose.Types.ObjectId()
              : lessonData;

            if (!isObject) {
              return await Lesson.findById(lessonId);
            }

            return await Lesson.findOneAndUpdate(
              { _id: lessonId },
              {
                title: lessonData.title,
                type: lessonData.type,
                desc: lessonData.desc,
                url: lessonData.url || "",
                moduleId: updatedModule._id,
              },
              {
                upsert: true,
                returnDocument: "after", // Updated for deprecation
                setDefaultsOnInsert: true,
              },
            );
          }),
        );

        // Sync and Save
        updatedModule.lessons = updatedLessons.map((l) => l._id);
        await updatedModule.save();

        const moduleWithLessons = updatedModule.toObject();
        moduleWithLessons.lessons = updatedLessons;
        return moduleWithLessons;
      }),
    );

    // 4. Update Course with final module list
    course.modules = updatedModules.map((m) => m._id);
    await course.save();

    return NextResponse.json({
      ...course.toObject(),
      modules: updatedModules,
      id: course._id.toString(),
    });
  } catch (err) {
    console.error("Error in PUT request:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const paramsRes = await params;
    const course = await Course.findByIdAndDelete(paramsRes.id);
    if (!course)
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
