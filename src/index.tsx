import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { RecoilRoot } from "recoil";
import "./styles/tailwind.css";
import Router from "./Router";
import * as serviceWorker from "./serviceWorker";
import React from "react";
import Header from "./components/Header";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <div className="bg-color-light w-full min-h-full">
    <React.StrictMode>
      <BrowserRouter>
        <RecoilRoot>
          <div className="max-w-7xl  mx-auto 	">
            <Header />
            <Router />
          </div>
        </RecoilRoot>
      </BrowserRouter>
    </React.StrictMode>
  </div>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
