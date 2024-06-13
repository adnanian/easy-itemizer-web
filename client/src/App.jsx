import React from "react";
import { BrowserRouter, Routes as RouteList, Route } from "react-router-dom";
import { SuperProvider } from "./SuperContext";
import Home from "./pages/Home"
import About from "./pages/About";
import Signup from "./pages/Signup";
import Layout from "./components/navigation/Layout";
import ErrorPage from "./pages/error-handling/ErrorPage";
import ForgotPassword from "./pages/ForgotPassword";
import AccessBlocker from "./pages/error-handling/AccessBlocker";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <SuperProvider>
        <RouteList>
          <Route path="/" element={<Layout/>}>
            <Route index element={<Home/>}/>
            <Route path="about" element={<About />} />
            <Route path="login" element={<Login/>}/>
            <Route path="forgot-password" element={<ForgotPassword/>}/>
            <Route path="signup" element={<Signup/>} />
            <Route path="unauthorized" element={<AccessBlocker/>}/>
          </Route>
          <Route path="*" element={<ErrorPage />}/>
        </RouteList>
      </SuperProvider>
    </BrowserRouter>
  )
}
