import { Outlet } from "react-router-dom";
import Navbar2 from "./NavBarv2";

function NavbarLayout() {
  return (
    <>
      <Navbar2 />
      <Outlet /> {/*renders the child route components */}
    </>
  );
}

export default NavbarLayout;
