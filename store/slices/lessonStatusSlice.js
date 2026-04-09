import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ----- API URL -----
const API_URL = "/api/lessonStatus";

// ----- Async Thunks -----

// 1️⃣ GET all lessonStatus
export const fetchlessonStatus = createAsyncThunk(
    "lessonStatuss/fetchlessonStatus",
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

// 2️⃣ CREATE a new lessonStatuss
export const createlessonStatus = createAsyncThunk(
    "lessonStatuss/createlessonStatuss",
    async (lessonStatussData, { rejectWithValue }) => {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(lessonStatussData),
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

// 3️⃣ UPDATE a lessonStatuss
export const updatelessonStatuss = createAsyncThunk(
    "lessonStatus/updatelessonStatuss",
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/lessonStatus/${id}`, {
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

// 4️⃣ DELETE a lessonStatuss
export const deletelessonStatuss = createAsyncThunk(
    "lessonStatuss/deletelessonStatuss",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/lessonStatus/${id}`, {
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
    lessonStatus: [],
    loading: false,
    error: null,
};

// ----- Slice -----
const lessonStatuSlice = createSlice({
    name: "lessonStatus",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // FETCH
            .addCase(fetchlessonStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchlessonStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.lessonStatus = action.payload;
            })
            .addCase(fetchlessonStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            })

            // CREATE
            .addCase(createlessonStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createlessonStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.lessonStatus.push(action.payload);
            })
            .addCase(createlessonStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            })

            // UPDATE
            .addCase(updatelessonStatuss.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatelessonStatuss.fulfilled, (state, action) => {
                state.loading = false;
                // Match by _id if MongoDB, otherwise use id
                const updatedlessonStatuss = action.payload;
                const index = state.lessonStatus.findIndex(c => c._id === updatedlessonStatuss._id);
                if (index !== -1) {
                    state.lessonStatus[index] = updatedlessonStatuss;
                } else {
                    // Optional: push if not found
                    state.lessonStatus.push(updatedlessonStatuss);
                }
            })
            .addCase(updatelessonStatuss.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            })

            // DELETE
            .addCase(deletelessonStatuss.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletelessonStatuss.fulfilled, (state, action) => {
                state.loading = false;
                state.lessonStatus = state.lessonStatus.filter(c => c._id !== action.payload);
            })
            .addCase(deletelessonStatuss.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            });
    },
});

export default lessonStatuSlice.reducer;