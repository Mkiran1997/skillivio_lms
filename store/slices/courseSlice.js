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
    console.log(courseData);
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
    console.log(updatedData);
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
        // Match the course by its ID and update it in the state
        const updatedCourse = action.payload;
        const index = state.Course.findIndex(
          (course) => course._id === updatedCourse._id,
        );
        if (index !== -1) {
          state.Course[index] = updatedCourse;
        } else {
          // Optional: Push the new course if not found (unlikely, but possible)
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
        state.Course = state.Course.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Something went wrong";
      });
  },
});

export default courseSlice.reducer;
