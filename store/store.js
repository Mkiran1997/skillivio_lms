import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./api/apiService";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import courseReducer from "./slices/courseSlice";
import learnersReducer from "./slices/learnerSlice";
import bankdetailReducer from "./slices/bankDetailSlice";
import saTenantReducer from "./slices/saTenantSlice";
import enrollmentReducer from "./slices/enrollmentSlice";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer,
      course:courseReducer,
      learners:learnersReducer,
      bankdetail:bankdetailReducer,
      saTenants:saTenantReducer,
      enrollment:enrollmentReducer,
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
