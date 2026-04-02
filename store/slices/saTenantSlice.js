import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ----- API URL -----
const API_URL = "/api/saTenants";

// ----- Async Thunks -----

// 1️⃣ GET all saTenants
export const fetchsaTenants = createAsyncThunk(
    "saTenants/fetchsaTenants",
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

// 2️⃣ CREATE a new saTenants
export const createsaTenants = createAsyncThunk(
    "saTenants/createsaTenants",
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

// 3️⃣ UPDATE a saTenants
export const updatesaTenants = createAsyncThunk(
    "saTenants/updatesaTenants",
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/saTenants/${id}`, {
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

// 4️⃣ DELETE a saTenants
export const deletesaTenants = createAsyncThunk(
    "saTenants/deletesaTenants",
    async (id, { rejectWithValue }) => {
        console.log(id);
        try {
            const response = await fetch(`/api/saTenants/${id}`, {
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
    saTenants: [],
    loading: false,
    error: null,
};

// ----- Slice -----
const saTenantslice = createSlice({
    name: "saTenants",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // FETCH
            .addCase(fetchsaTenants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchsaTenants.fulfilled, (state, action) => {
                state.loading = false;
                state.saTenants = action.payload;
            })
            .addCase(fetchsaTenants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            })

            // CREATE
            .addCase(createsaTenants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createsaTenants.fulfilled, (state, action) => {
                state.loading = false;
                state.saTenants.push(action.payload);
            })
            .addCase(createsaTenants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            })

            // UPDATE
            .addCase(updatesaTenants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatesaTenants.fulfilled, (state, action) => {
                state.loading = false;
                // Match by _id if MongoDB, otherwise use id
                const updatedsaTenants = action.payload;
                const index = state.saTenants.findIndex(c => c._id === updatedsaTenants._id);
                if (index !== -1) {
                    state.saTenants[index] = updatedsaTenants;
                } else {
                    // Optional: push if not found
                    state.saTenants.push(updatedsaTenants);
                }
            })
            .addCase(updatesaTenants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            })

            // DELETE
            .addCase(deletesaTenants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletesaTenants.fulfilled, (state, action) => {
                state.loading = false;
                state.saTenants = state.saTenants.filter(c => c._id !== action.payload);
            })
            .addCase(deletesaTenants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            });
    },
});

export default saTenantslice.reducer;