import { Outlet } from "react-router-dom";

function NavbarLayout() {
  return (
    <>
      {/* <Bottombar /> */}
      <Outlet /> {/* Renders the child route components */}
    </>
  );
}

export default NavbarLayout;
