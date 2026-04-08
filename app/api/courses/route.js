import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Course from "@/app/api/model/course";
import Module from "../model/module";
import Lesson from "../model/lesson";

export async function GET() {
  try {
    await dbConnect();
    const courses = await Course.find();
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
  await dbConnect(); // Ensure DB is connected

  try {
    // Get the data from the request body
    const data = await req.json();

    // Step 1: Create the Course
    const course = await Course.create({
      title: data.title,
      cat: data.cat,
      level: data.level,
      nqfLevel: data.nqfLevel,
      saqaQualificationId: data.saqaQualificationId,
      accreditingBody: data.accreditingBody,
      passingScore: data.passingScore,
      description: data.description,
      type:data.type
    });

    // Step 2: Create Modules for the Course
    const modules = await Promise.all(
      data.modules.map(async (moduleData) => {
        // Create the module and link it to the course
        const module = await Module.create({
          moduleName: moduleData.moduleName,
          courseId: course._id, // Link the module to the course
        });

        // Step 3: Create Lessons for this Module
        const lessons = await Promise.all(
          moduleData.lessons.map(async (lessonData) => {
            // Create each lesson and link it to the module
            const lesson = await Lesson.create({
              title: lessonData.title,
              type: lessonData.type,
              desc: lessonData.desc,
              url: lessonData.url || "", // Default empty string if no URL is provided
              moduleId: module._id, // Link the lesson to the module
            });

            return lesson; // Return the lesson object
          })
        );

        // Update the module with the created lessons
        module.lessons = lessons.map((lesson) => lesson._id); // Save lesson references in the module
        await module.save();

        return module; // Return the created module
      })
    );

    // Step 4: Update the Course with the created Module IDs
    course.modules = modules.map((module) => module._id);
    await course.save();

    // Step 5: Return the course data, including modules and lessons
    return NextResponse.json({
      ...course.toObject(),
      id: course._id.toString(),
    });
  } catch (err) {
    // Handle errors during the operation
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
