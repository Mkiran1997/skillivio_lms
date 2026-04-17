import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Course from "@/models/course";
import Module from "@/models/module";
import Lesson from "@/models/lesson";
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

  // Include materials array
  if (data.materials) mapped.materials = data.materials;

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
      return {
        ...mappedCourse,
        id: c._id.toString(),
        _id: c._id.toString()
      };
    });
    const signedCourses = await Promise.all(
      mapped.map(async (c) => await signCourseAssets(c))
    );

    return NextResponse.json(signedCourses);
  } catch (err) {
    console.error("GET error:", err);
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
          fileType: "OTHER", // You can enhance type detection if needed
          desc: customDesc
        });
      }
    }

    return data;
  }
  return await req.json();
}

export async function POST(req) {
  await dbConnect();

  try {
    const courseId = new mongoose.Types.ObjectId();
    const data = await handleRequestData(req, courseId);
    const mappedData = mapFields(data);
    mappedData._id = courseId; // Assign pre-generated ID

    console.log("mappedData", mappedData);

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
                console.log("Creating lesson with type:", lessonData.type?.toLowerCase());
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

    const mapped = {
      ...mapFields(populatedCourse, true),
      id: course._id.toString(),
      modules: populatedCourse.modules?.map(mod => ({
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
      }))
    };
    const signedResult = await signCourseAssets(mapped);
    return NextResponse.json(signedResult);
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}