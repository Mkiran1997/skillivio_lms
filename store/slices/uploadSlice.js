// src/slices/uploadSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  url: null,
  error: null,
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    uploadStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    uploadSuccess: (state, action) => {
      state.loading = false;
      state.url = action.payload;
    },
    uploadFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { uploadStart, uploadSuccess, uploadFailure } = uploadSlice.actions;

export const uploadFile = (file) => async (dispatch) => {
  // Start the upload
  dispatch(uploadStart());

  // Create the formData to send with the request
  const formData = new FormData();
  formData.append("file", file);

  try {
    // Make the POST request to your upload API
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("File upload failed");
    }

    const data = await response.json();

    if (data.url) {
      // Dispatch success action if upload is successful
      dispatch(uploadSuccess(data.url));
    } else {
      // Dispatch failure action if there's no URL in response
      dispatch(uploadFailure("No URL returned"));
    }
  } catch (error) {
    // Dispatch failure action if something goes wrong
    dispatch(uploadFailure(error.message));
  }
};

export default uploadSlice.reducer;