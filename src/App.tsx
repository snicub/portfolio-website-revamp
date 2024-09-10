import EnterPage from "./Components/EnterPage/EnterPage";
import Experience from "./Components/Experience";

import PLP from "./Components/SpecificLandingPage/PLP";
import Home from "./Components/Home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Data from "./dataFile";
import About from "./Components/About/About";
import NavbarLayout from "./Components/Navbar/NavbarLayout";
import TopLayout from "./Components/Navbar/TopLayout";
import DeviceProvider from "./Context/DeviceContext";

function App() {
  return (
    <DeviceProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<EnterPage images={Data.enterPageSection} />}
          />

          <Route element={<NavbarLayout />}>
            <Route element={<TopLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/experience" element={<Experience />} />
            </Route>
            <Route path="/about" element={<About />} />
            <Route path="/learnmore" element={<PLP />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DeviceProvider>
  );
}

export default App;
