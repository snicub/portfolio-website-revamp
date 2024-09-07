import { Outlet } from "react-router-dom";
import Bottombar from "./Bottombar";

function NavbarLayout() {
  return (
    <>
      {/* <Bottombar /> */}
      <Outlet /> {/* Renders the child route components */}
    </>
  );
}

export default NavbarLayout;
