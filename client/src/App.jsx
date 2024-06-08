import React from "react";
import { BrowserRouter, Routes as RouteList, Route } from "react-router-dom";
import { UserProvider } from "./UserContext";
import Home from "./pages/Home"
import About from "./pages/About";
import Layout from "./components/navigation/Layout";
import ErrorPage from "./pages/error-handling/ErrorPage";

function App() {
  

  return (
    <BrowserRouter>
      <UserProvider>
        <RouteList>
          <Route path="/" element={<Layout/>}>
            <Route index element={<Home/>}/>
            <Route path="about" element={<About />} />
          </Route>
          <Route path="*" element={<ErrorPage />}/>
        </RouteList>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App
