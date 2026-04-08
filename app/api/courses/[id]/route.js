// app/api/courses/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Course from "@/app/api/model/course";
import Module from "@/app/api/model/module";
import Lesson from "@/app/api/model/lesson";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const paramsRes = await params;
    const course = await Course.findById(paramsRes.id);
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
    const paramsRes = await params;
    console.log(params);
    // const { id } = params; // Extract course ID
    const data = await req.json(); // Extract updated course data

    // Step 1: Update the course
    const course = await Course.findByIdAndUpdate(
      paramsRes.id,
      {
        name: data.name,
        category: data.category,
        level: data.level,
        nqfLevel: data.nqfLevel,
        saqaQualificationId: data.saqaQualificationId,
        accreditingBody: data.accreditingBody,
        passingScore: data.passingScore,
        description: data.description,
      },
      { new: true },
    );

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Step 2: Update Modules and Lessons if provided
    const updatedModules = await Promise.all(
      data.modules.map(async (moduleData) => {
        console.log(moduleData);
        // Update the module
        const updatedModule = await Module.findByIdAndUpdate(
          moduleData._id,
          {
            moduleName: moduleData.moduleName,
          },
          { new: true },
        );

        if (!updatedModule) {
          throw new Error(`Module with ID ${moduleData._id} not found`);
        }

        // Update Lessons for this module
        const updatedLessons = await Promise.all(
          moduleData.lessons.map(async (lessonData) => {
            const updatedLesson = await Lesson.findByIdAndUpdate(
              lessonData._id,
              {
                title: lessonData.title,
                type: lessonData.type,
                description: lessonData.description,
                url: lessonData.url || "", // Default to an empty string if no URL is provided
              },
              { new: true },
            );

            if (!updatedLesson) {
              throw new Error(`Lesson with ID ${lessonData._id} not found`);
            }

            return updatedLesson;
          }),
        );

        updatedModule.lessons = updatedLessons.map((lesson) => lesson._id);
        await updatedModule.save();

        return updatedModule;
      }),
    );

    // Step 3: Update the course with the updated module IDs
    course.modules = updatedModules.map((module) => module._id);
    await course.save();

    return NextResponse.json({
      ...course.toObject(),
      id: course._id.toString(),
    });
  } catch (err) {
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
