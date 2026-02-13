import EnterPage from "./Components/EnterPage/EnterPage";
import PLP from "./Components/SpecificLandingPage/PLP";
import Home from "./Components/Home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Data from "./dataFile";
import About from "./Components/About/About";
import NavbarLayout from "./Components/Navbar/NavbarLayout";
import TopLayout from "./Components/Navbar/TopLayout";
import AnalyticsTracker from "./AnalyticsTracker";
import "./firebase";

function App() {
  return (
    <BrowserRouter>
      {/* track page views and analytics */}
      <AnalyticsTracker />

      <Routes>
        {/* entry page */}
        <Route
          path="/"
          element={<EnterPage images={Data.enterPageSection} />}
        />

        {/* routes that use the Navbar layout */}
        <Route element={<NavbarLayout />}>
          <Route element={<TopLayout />}>
            <Route path="/home" element={<Home />} />
          </Route>

          {/* About page */}
          <Route path="/about" element={<About />} />

          {/* Specific landing/product page */}
          <Route path="/learnmore" element={<PLP />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
