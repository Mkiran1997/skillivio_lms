import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ----- API URL -----
const API_URL = "/api/contactUs";

// ----- Async Thunks -----

// 1️⃣ GET all contactUs
export const fetchcontactUs = createAsyncThunk(
    "contactUs/fetchcontactUs",
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

// 2️⃣ CREATE a new contactUs
export const createcontactUs = createAsyncThunk(
    "contactUs/createcontactUs",
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


// ----- Initial State -----
const initialState = {
    contactUs: [],
    loading: false,
    error: null,
};

// ----- Slice -----
const contactUslice = createSlice({
    name: "contactUs",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // FETCH
            .addCase(fetchcontactUs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchcontactUs.fulfilled, (state, action) => {
                state.loading = false;
                state.contactUs = action.payload;
            })
            .addCase(fetchcontactUs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            })

            // CREATE
            .addCase(createcontactUs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createcontactUs.fulfilled, (state, action) => {
                state.loading = false;
                state.contactUs.push(action.payload);
            })
            .addCase(createcontactUs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Something went wrong";
            })
    },
});

export default contactUslice.reducer;