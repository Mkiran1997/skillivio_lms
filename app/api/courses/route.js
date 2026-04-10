import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Course from "@/app/api/model/course";
import Module from "../model/module";
import Lesson from "../model/lesson";

export async function GET() {
  try {
    await dbConnect();
    const courses = await Course.find().populate({
      path: "modules",
      populate: { path: "lessons" }, // This will also populate lessons inside each module
    });
    const mapped = courses.map((c) => ({
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

    // Create a course
    const course = await Course.create({
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
    });

    // Create modules and lessons
    const modules = await Promise.all(
      data.modules.map(async (moduleData) => {
        const module = await Module.create({
          moduleName: moduleData.moduleName,
          courseId: course._id,
        });

        const lessons = await Promise.all(
          moduleData.lessons.map(async (lessonData) => {
            const lesson = await Lesson.create({
              title: lessonData.title,
              type: lessonData.type,
              desc: lessonData.desc|| "",
              url: lessonData.url || "",  // Store the uploaded file URL
              moduleId: module._id,
            });

            return lesson;
          })
        );

        module.lessons = lessons.map((lesson) => lesson._id);
        await module.save();

        return module;
      })
    );

    course.modules = modules.map((module) => module._id);
    await course.save();

    // Populate the course with modules and lessons
    const populatedCourse = await Course.findById(course._id).populate({
      path: "modules",
      populate: { path: "lessons" },
    });

    return NextResponse.json(populatedCourse);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}