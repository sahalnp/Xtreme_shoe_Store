import { createSlice } from "@reduxjs/toolkit";

const storedUser = (() => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
})();

const storedToken = localStorage.getItem("token");

const UserSlice = createSlice({
  name: "user",
  initialState: {
    user: storedUser,
    token: storedToken || null,
    isAuthenticated: !!storedToken,
  },
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload || {};
      state.user = user || action.payload;
      if (token) {
        state.token = token;
        localStorage.setItem("token", token);
      }
      state.isAuthenticated = true;
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, clearUser } = UserSlice.actions;
export default UserSlice.reducer;

