import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ----- API URL -----
const API_URL = "/api/learners";

// ----- Async Thunks -----

// 1️⃣ GET all learners
export const fetchlearners = createAsyncThunk(
    "learners/fetchlearners",
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

// 2️⃣ CREATE a new learners
export const createlearners = createAsyncThunk(
    "learners/createlearners",
    async (learnerData, { rejectWithValue }) => {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(learnerData),
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

// 3️⃣ UPDATE a learners
export const updatelearners = createAsyncThunk(
    "learners/updatelearners",
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/learners/${id}`, {
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

// 4️⃣ DELETE a learners
export const deletelearners = createAsyncThunk(
    "learners/deletelearners",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/learners/${id}`, {
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
    Learners: [],
    loading: false,
    error: null,
};

// ----- Slice -----
const learnerSlice = createSlice({
    name: "learners",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // FETCH
            .addCase(fetchlearners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchlearners.fulfilled, (state, action) => {
                state.loading = false;
                state.Learners = action.payload;
            })
            .addCase(fetchlearners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            })

            // CREATE
            .addCase(createlearners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createlearners.fulfilled, (state, action) => {
                state.loading = false;
                state.Learners.push(action.payload);
            })
            .addCase(createlearners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            })

            // UPDATE
            .addCase(updatelearners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatelearners.fulfilled, (state, action) => {
                state.loading = false;
                // Match by _id if MongoDB, otherwise use id
                const updatedlearners = action.payload;
                const index = state.Learners.findIndex(c => c._id === updatedlearners._id);
                if (index !== -1) {
                    state.Learners[index] = updatedlearners;
                } else {
                    // Optional: push if not found
                    state.Learners.push(updatedlearners);
                }
            })
            .addCase(updatelearners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            })

            // DELETE
            .addCase(deletelearners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletelearners.fulfilled, (state, action) => {
                state.loading = false;
                state.Learners = state.Learners.filter(c => c._id !== action.payload);
            })
            .addCase(deletelearners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            });
    },
});

export default learnerSlice.reducer;