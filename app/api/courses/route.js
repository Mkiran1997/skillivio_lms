import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Course from "@/models/course";
import Module from "@/models/module";
import Lesson from "@/models/lesson";
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
  for (const [oldKey, newKey] of Object.entries(fieldMap)) {
    let value = data[oldKey];
    if (reverse) value = data[newKey];

    if (value !== undefined) {
      // Normalize enums for incoming data
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

  // Include tenantId if present (not in fieldMap)
  if (!reverse && data.tenantId) mapped.tenantId = data.tenantId;
  if (reverse && data.tenantId) mapped.tenantId = data.tenantId;

  // Only include relations when reversing (sending back to frontend)
  // Incoming relations are handled manually in POST/PUT
  if (reverse) {
    if (data.modules) mapped.modules = data.modules;
    if (data.prerequisites) mapped.prerequisites = data.prerequisites;
  }

  return mapped;
}

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId");
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    const query = {};
    if (tenantId) query.tenantId = tenantId;
    if (status) query.status = status;
    if (category) query.category = category;

    const courses = await Course.find(query)
      .populate({
        path: "modules",
        populate: { path: "lessons" }
      })
      .lean();

    const mapped = courses.map(c => {
      const mappedCourse = mapFields(c, true);
      if (c.modules) {
        mappedCourse.modules = c.modules.map(mod => ({
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
      return {
        ...mappedCourse,
        id: c._id.toString(),
        _id: c._id.toString()
      };
    });
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
    const mappedData = mapFields(data);

    const course = await Course.create(mappedData);

    if (data.modules && data.modules.length > 0) {
      const modules = await Promise.all(
        data.modules.map(async (moduleData, idx) => {
          const module = await Module.create({
            name: moduleData.moduleName || moduleData.name,
            description: moduleData.description,
            courseId: course._id,
            tenantId: course.tenantId,
            order: idx + 1,
          });

          if (moduleData.lessons && moduleData.lessons.length > 0) {
            const lessons = await Promise.all(
              moduleData.lessons.map(async (lessonData, lid) => {
                return await Lesson.create({
                  title: lessonData.title,
                  description: lessonData.desc || lessonData.description,
                  type: lessonData.type?.toLowerCase(),
                  moduleId: module._id,
                  courseId: course._id,
                  tenantId: course.tenantId,
                  order: lid + 1,
                  content: {
                    text: lessonData.desc || lessonData.description,
                    video: lessonData.url ? { url: lessonData.url } : undefined,
                  },
                  thumbnail: lessonData.thumb,
                  duration: lessonData.duration,
                });
              })
            );
            module.lessons = lessons.map(l => l._id);
            await module.save();
          }

          return module;
        })
      );

      course.modules = modules.map(m => m._id);
      await course.save();
    }

    const populatedCourse = await Course.findById(course._id)
      .populate({
        path: "modules",
        populate: { path: "lessons" }
      })
      .lean();

    return NextResponse.json({
      ...mapFields(populatedCourse, true),
      id: course._id.toString(),
    });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}