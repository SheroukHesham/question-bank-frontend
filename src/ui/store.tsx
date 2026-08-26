import { configureStore } from "@reduxjs/toolkit";
import activeTabReducer from "./features/activeTabSlice";
import userReducer from "./features/userSlice";

export const store = configureStore({
  reducer: {
    activeTab: activeTabReducer,
    user: userReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
