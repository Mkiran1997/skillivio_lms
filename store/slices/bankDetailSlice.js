import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ----- API URL -----
const API_URL = "/api/bankDetail";

// ----- Async Thunks -----

// 1️⃣ GET all bankdetails
export const fetchbankdetails = createAsyncThunk(
    "bankdetail/fetchbankdetail",
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

// 2️⃣ CREATE a new bankdetails
export const createbankdetail = createAsyncThunk(
    "bankdetail/createbankdetail",
    async ( bankdetailData, { rejectWithValue }) => {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify( bankdetailData),
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

// 3️⃣ UPDATE a bankdetails
export const updatebankdetails = createAsyncThunk(
    "bankdetails/updatebankdetails",
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/bankDetail/${id}`, {
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

// 4️⃣ DELETE a bankdetails
export const deletebankdetails = createAsyncThunk(
    "bankdetails/deletebankdetails",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/bankDetail/${id}`, {
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
    bankdetails: [],
    loading: false,
    error: null,
};

// ----- Slice -----
const bankdetailSlice = createSlice({
    name: "bankdetails",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // FETCH
            .addCase(fetchbankdetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchbankdetails.fulfilled, (state, action) => {
                state.loading = false;
                state.bankdetails = action.payload;
            })
            .addCase(fetchbankdetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            })

            // CREATE
            .addCase(createbankdetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createbankdetail.fulfilled, (state, action) => {
                state.loading = false;
                state.bankdetails.push(action.payload);
            })
            .addCase(createbankdetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            })

            // UPDATE
            .addCase(updatebankdetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatebankdetails.fulfilled, (state, action) => {
                state.loading = false;
                // Match by _id if MongoDB, otherwise use id
                const updatedbankdetails = action.payload;
                const index = state.bankdetails.findIndex(c => c._id === updatedbankdetails._id);
                if (index !== -1) {
                    state.bankdetails[index] = updatedbankdetails;
                } else {
                    // Optional: push if not found
                    state.bankdetails.push(updatedbankdetails);
                }
            })
            .addCase(updatebankdetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            })

            // DELETE
            .addCase(deletebankdetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletebankdetails.fulfilled, (state, action) => {
                state.loading = false;
                state.bankdetails = state.bankdetails.filter(c => c._id !== action.payload);
            })
            .addCase(deletebankdetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            });
    },
});

export default bankdetailSlice.reducer;