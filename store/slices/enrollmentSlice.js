import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ----- API URL -----
const API_URL = "/api/enrollment";

// ----- Async Thunks -----

export const fetchEnrollment = createAsyncThunk(
    "enrollment/fetchEnrollment",
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
    }
);

export const createEnrollment = createAsyncThunk(
    "enrollment/createEnrollment",
    async (enrollmentData, { rejectWithValue }) => {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(enrollmentData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData);
            }

            return await response.json();
        } catch (err) {
            return rejectWithValue({ error: err.message });
        }
    }
);

export const updateEnrollment = createAsyncThunk(
    "enrollment/updateEnrollment",
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/enrollment/${id}`, {
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
    }
);

export const deleteEnrollment = createAsyncThunk(
    "enrollment/deleteEnrollment",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/enrollment/${id}`, {
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
    }
);

// ----- Initial State -----
const initialState = {
    Enrollment: [],
    loading: false,
    error: null,
};

// ----- Slice -----
const enrollmentSlice = createSlice({
    name: "enrollment",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // FETCH
            .addCase(fetchEnrollment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEnrollment.fulfilled, (state, action) => {
                state.loading = false;
                state.Enrollment = action.payload;
            })
            .addCase(fetchEnrollment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            })

            // CREATE
            .addCase(createEnrollment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEnrollment.fulfilled, (state, action) => {
                state.loading = false;
                state.Enrollment.push(action.payload);
            })
            .addCase(createEnrollment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            })

            // UPDATE
            .addCase(updateEnrollment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEnrollment.fulfilled, (state, action) => {
                state.loading = false;
                // Match by _id if MongoDB, otherwise use id
                const updatedEnrollment = action.payload;
                const index = state.Enrollment.findIndex(c => c._id === updatedEnrollment._id);
                if (index !== -1) {
                    state.Enrollment[index] = updatedEnrollment;
                } else {
                    // Optional: push if not found
                    state.Enrollment.push(updatedEnrollment);
                }
            })
            .addCase(updateEnrollment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            })

            // DELETE
            .addCase(deleteEnrollment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEnrollment.fulfilled, (state, action) => {
                state.loading = false;
                state.Enrollment = state.Enrollment.filter(c => c._id !== action.payload);
            })
            .addCase(deleteEnrollment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            });
    },
});

export default enrollmentSlice.reducer;