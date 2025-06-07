import { Outlet } from "react-router-dom";
import GoToTopBottomBar from "./GoToTopBottomBar";

function TopLayout() {
  return (
    <>
      <GoToTopBottomBar showBelow={300} />
      <Outlet /> {/* renders the child route components */}
    </>
  );
}

export default TopLayout;
