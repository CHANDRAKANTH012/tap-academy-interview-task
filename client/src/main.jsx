import React from "react";
// import "./index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import { loadMe } from "./store/user/userSlice";
import App from "./App";
import "./index.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";


// if token exists in storage we already set it in slice; try refreshing user info
if (localStorage.getItem("token")) {
  // dispatch once to refresh server-side user / keep state fresh
  store.dispatch(loadMe());
}

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
