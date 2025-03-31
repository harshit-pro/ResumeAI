import { Outlet } from "react-router";
import React from "react";
import NavBar from "../component/NavBar";

function Root() {
  return (
    <div>
      <NavBar/>
      <Outlet/>
    </div>
  );
}
export default Root;