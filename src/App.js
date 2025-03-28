import "./App.css";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
// import { HashRouter as Router } from "react-router-dom"
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadPO from "./pages/UploadPO";
import React, { useEffect, useLayoutEffect } from "react";
// import "datatables.net-dt/js/dataTables.dataTables";
// import "../node_modules/datatables.net-dt/css/jquery.dataTables.min.css";
import UserMaster from "./pages/UserMaster";
import BuildMenus from "./components/DashBoard/BuildMenus";
import HomeTiles from "../src/pages/HomeTiles";
import Footer from "../src/components/Footer";
import ViewPO from "./pages/ViewPO";
import ProcessPO from "./pages/ProcessPO";
import POLogView from "./pages/POLogView";
import Brand from "./pages/Brand";
import CrudUI from "./pages/CrudUI";
import ReportPOVsSales from "./pages/ReportPoVsFulfill";
import { ToastContainer } from "react-fox-toast";

const App = () => {
  //   useLayoutEffect(() => {

  //     //document.body.classList.add(loginStyle);
  //     window.location.pathname == "/"
  //       ? document.body.classList.add("loginBG")
  //       : document.body.classList.add(
  //         "fixed-nav",
  //         "sticky-footer",
  //         "sidenav-toggled"
  //       );
  //   }, []);

  return (
    <>
      <ToastContainer />

      <BrowserRouter basename={process.env.PUBLIC_URL}>
        {/* <BrowserRouter basename={"/partner/"}> */}
        {/* <HashRouter> */}

        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/home"
            element={
              <>
                <Dashboard />

                <HomeTiles />
                <Footer />
              </>
            }
          />

          <Route
            path="/dashboard"
            element={
              <>
                <Dashboard />
              </>
            }
          />

          <Route
            path="/user_master"
            element={
              <>
                <Dashboard />
                <UserMaster />
              </>
            }
          />

          <Route
            path="/crud"
            element={
              <>
                <Dashboard />
                <CrudUI />
              </>
            }
          />
          <Route
            path="/reportv1"
            element={
              <>
                <Dashboard />
                <ReportPOVsSales />
              </>
            }
          />

          <Route
            path="/brandtest"
            element={
              <>
                <Brand />
              </>
            }
          />

          <Route
            path="/uploadPO"
            element={
              <>
                <Dashboard />
                <UploadPO />
              </>
            }
          />

          <Route
            path="/ViewPO"
            element={
              <>
                <Dashboard />
                <ViewPO />
              </>
            }
          />

          <Route
            path="/processFile"
            element={
              <>
                <Dashboard />

                <ProcessPO />
                <Footer />
              </>
            }
          />
          <Route
            path="/processed_po_log"
            element={
              <>
                <Dashboard />
                <POLogView />
              </>
            }
          />
        </Routes>
        {/* </HashRouter> */}
      </BrowserRouter>
    </>
  );
};

export default App;
