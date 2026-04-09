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
import userReducer from "./slices/authSlice";
import lessonStatusReducer from "./slices/lessonStatusSlice";

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
      user:userReducer,
      lessonStatus:lessonStatusReducer,
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
