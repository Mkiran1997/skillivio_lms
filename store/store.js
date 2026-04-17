import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./api/apiService";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import courseReducer from "./slices/courseSlice";
import learnersReducer from "./slices/learnerSlice";
import bankdetailReducer from "./slices/bankDetailSlice";
import tenantReducer from "./slices/tenantSlice";
import enrollmentReducer from "./slices/enrollmentSlice";

import lessonStatusReducer from "./slices/lessonStatusSlice";
import uploadReducer from './slices/uploadSlice';
import contactusReducer from "./slices/contactUsSlice";


export const makeStore = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer,
      course:courseReducer,
      learners:learnersReducer,
      bankdetail:bankdetailReducer,
      tenants:tenantReducer,
      enrollment:enrollmentReducer,

      lessonStatus:lessonStatusReducer,
      upload:uploadReducer,
      contactUs:contactusReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });

  setupListeners(store.dispatch);
  return store;
};

// export type AppStore = ReturnType<typeof makeStore>;
// export type RootState = ReturnType<AppStore["getState"]>;
// export type AppDispatch = AppStore["dispatch"];
