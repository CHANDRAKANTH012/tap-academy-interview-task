// frontend/src/store/user/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import API, { setAuthToken } from "../../api/api";

/**
 * Robust boot: read token and user from localStorage safely.
 * If token exists, set it on the API instance immediately.
 */
const safeGet = (key, isJson = true) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return isJson ? JSON.parse(raw) : raw;
  } catch (e) {
    try { localStorage.removeItem(key); } catch(_) {}
    return null;
  }
};

const initialToken = safeGet("token", false) || null;
const initialUser = safeGet("user", true) || null;

// Ensure axios has Authorization header if token present (very important)
if (initialToken) setAuthToken(initialToken);

const initialState = {
  token: initialToken,
  user: initialUser,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    authStart(state) {
      state.loading = true;
      state.error = null;
    },
    authSuccess(state, action) {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
      try {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      } catch (e) {
        // ignore localStorage write errors
        console.warn("Failed to persist auth to localStorage", e);
      }
      setAuthToken(action.payload.token);
    },
    authFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.loading = false;
      state.error = null;
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch (e) {}
      setAuthToken(null);
    },
    setUser(state, action) {
      state.user = action.payload;
      try { localStorage.setItem("user", JSON.stringify(action.payload)); } catch(e){}
    }
  },
});

export const { authStart, authSuccess, authFailure, logout, setUser } = slice.actions;
export default slice.reducer;

/* ------------------ Thunks ------------------ */

export const login = (credentials) => async (dispatch) => {
  dispatch(authStart());
  try {
    const { data } = await API.post("/auth/login", credentials);
    // expected: { token, user }
    dispatch(authSuccess({ token: data.token, user: data.user }));
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || "Login failed";
    dispatch(authFailure(msg));
    throw err;
  }
};

export const register = (payload) => async (dispatch) => {
  dispatch(authStart());
  try {
    const { data } = await API.post("/auth/register", payload);
    dispatch(authSuccess({ token: data.token, user: data.user }));
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || "Register failed";
    dispatch(authFailure(msg));
    throw err;
  }
};

/**
 * loadMe: refresh user from /auth/me if token present.
 * Safe: doesn't blow up if endpoint fails.
 */
export const loadMe = () => async (dispatch, getState) => {
  const token = getState().user.token;
  if (!token) return;
  // set header just in case
  setAuthToken(token);
  try {
    const { data } = await API.get("/auth/me");
    if (data?.user) dispatch(setUser(data.user));
  } catch (err) {
    // if token invalid/expired, logout
    console.warn("loadMe failed:", err?.response?.data || err.message);
    dispatch(logout());
  }
};
