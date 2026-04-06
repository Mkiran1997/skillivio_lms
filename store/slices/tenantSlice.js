import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ----- API URL -----
const API_URL = "/api/tenants";

// ----- Async Thunks -----

// 1️⃣ GET all tenants
export const fetchtenants = createAsyncThunk(
    "tenants/fetchtenants",
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

// 2️⃣ CREATE a new tenants
export const createtenants = createAsyncThunk(
    "tenants/createtenants",
    async (saTenantData, { rejectWithValue }) => {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(saTenantData),
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

// 3️⃣ UPDATE a tenants
export const updatetenants = createAsyncThunk(
    "tenants/updatetenants",
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/tenants/${id}`, {
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

// 4️⃣ DELETE a tenants
export const deletetenants = createAsyncThunk(
    "tenants/deletetenants",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/tenants/${id}`, {
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
    tenants: [],
    loading: false,
    error: null,
};

// ----- Slice -----
const tenantslice = createSlice({
    name: "tenants",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // FETCH
            .addCase(fetchtenants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchtenants.fulfilled, (state, action) => {
                state.loading = false;
                state.tenants = action.payload;
            })
            .addCase(fetchtenants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            })

            // CREATE
            .addCase(createtenants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createtenants.fulfilled, (state, action) => {
                state.loading = false;
                state.tenants.push(action.payload);
            })
            .addCase(createtenants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            })

            // UPDATE
            .addCase(updatetenants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatetenants.fulfilled, (state, action) => {
                state.loading = false;
                
                const updatedtenants = action.payload;
                const index = state.tenants.findIndex(c => c._id === updatedtenants._id);
                if (index !== -1) {
                    state.tenants[index] = updatedtenants;
                } else {
                    // Optional: push if not found
                    state.tenants.push(updatedtenants);
                }
            })
            .addCase(updatetenants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            })

            // DELETE
            .addCase(deletetenants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletetenants.fulfilled, (state, action) => {
                state.loading = false;
                state.tenants = state.tenants.filter(c => c._id !== action.payload);
            })
            .addCase(deletetenants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            });
    },
});

export default tenantslice.reducer;