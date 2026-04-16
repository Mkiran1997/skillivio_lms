import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ----- API URL -----
const API_URL = "/api/courses";

// ----- Async Thunks -----

// 1️⃣ GET all courses
export const fetchCourses = createAsyncThunk(
  "course/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      return await response.json();
    } catch (err) {
      return rejectWithValue({ error: err.message });
    }
  },
);

// 2️⃣ CREATE a new course
export const createCourses = createAsyncThunk(
  "course/createCourse",
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return await response.json();
    } catch (err) {
      return rejectWithValue({ error: err.message });
    }
  },
);

// 3️⃣ UPDATE a course
export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  },
);

export const updateCourseStatus = createAsyncThunk(
  "courses/updateCourseStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/courses/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  },
);

// 4️⃣ DELETE a course
export const deleteCourse = createAsyncThunk(
  "course/deleteCourse",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return id; // return deleted id
    } catch (err) {
      return rejectWithValue({ error: err.message });
    }
  },
);

// ----- Initial State -----
const initialState = {
  Course: [],
  loading: false,
  error: null,
};

// ----- Slice -----
const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.Course = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Something went wrong";
      })

      // CREATE
      .addCase(createCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.Course.push(action.payload);
      })
      .addCase(createCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Something went wrong";
      })

      // UPDATE
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCourse = action.payload;

        const index = state.Course.findIndex(
          (course) => (course?._id || course?.id) === (updatedCourse?._id || updatedCourse?.id),
        );

        if (index !== -1) {
          // 1. Update the top-level course data
          // We use spread to keep existing data and overwrite with incoming changes
          state.Course[index] = { ...state.Course[index], ...updatedCourse };

          // 2. Handle Modules
          // Check if updatedCourse.modules exists and if it's an array of objects or IDs
          updatedCourse.modules?.forEach((updatedModule) => {
            // If updatedModule is just a string (ID), we find the module in state by that ID
            const moduleId =
              typeof updatedModule === "string"
                ? updatedModule
                : updatedModule._id;

            const moduleIndex = state.Course[index].modules.findIndex(
              (m) => m._id === moduleId,
            );

            if (moduleIndex !== -1) {
              // If it's an object, update the module data
              if (typeof updatedModule === "object") {
                state.Course[index].modules[moduleIndex] = {
                  ...state.Course[index].modules[moduleIndex],
                  ...updatedModule,
                };

                // 3. Handle Lessons (Only if updatedModule is an object containing lessons)
                updatedModule.lessons?.forEach((updatedLesson) => {
                  // Determine the ID whether the payload is an object or a string
                  const lessonId =
                    typeof updatedLesson === "string"
                      ? updatedLesson
                      : updatedLesson._id;

                  const lessonIndex = state.Course[index].modules[
                    moduleIndex
                  ].lessons.findIndex((l) => l._id === lessonId);

                  if (lessonIndex !== -1) {
                    // ONLY update if we actually have new data (an object)
                    // If it's just a string ID, we keep the existing lesson object as is
                    if (typeof updatedLesson === "object") {
                      state.Course[index].modules[moduleIndex].lessons[
                        lessonIndex
                      ] = {
                        ...state.Course[index].modules[moduleIndex].lessons[
                        lessonIndex
                        ],
                        ...updatedLesson,
                      };
                    }
                  }
                });
              }
            }
          });
        } else {
          state.Course.push(updatedCourse);
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Something went wrong";
      })

      // DELETE
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.Course = state.Course.filter((c) => (c._id || c.id) !== action.payload);
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Something went wrong";
      }).addCase(updateCourseStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourseStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCourse = action.payload;
        const index = state.Course.findIndex(
          (course) => (course?._id || course?.id) === (updatedCourse?._id || updatedCourse?.id)
        );

        if (index !== -1) {
          // ✅ ONLY update status (DO NOT touch modules/lessons)
          state.Course[index].status = updatedCourse.status;
        }
      })
      .addCase(updateCourseStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to update status";
      });
  },
});

export default courseSlice.reducer;
