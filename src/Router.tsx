import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import NewPage from "./pages/NewPage";
import TaxAgencyNtf from "./pages/TaxAgencyNtf";
import FileSignatureCryptoPro from "./pages/FileSignatureCryptoPro.js"
import SignorEditor from "./pages/SignorEditor";
import DeviceSpec from "./pages/DeviceSpec";
import Egrul from "./pages/Egrul";

const Router = () => {
  return (
      <Routes>
        <Route path="/"     element={<LandingPage/>} />
        <Route path="/new"  element={<NewPage/>} />
        <Route path="/tax_agency_notification"  element={<TaxAgencyNtf/>} />
        <Route path="/digital_signature"  element={<FileSignatureCryptoPro/>} />
        <Route path="/signor_editor" element={<SignorEditor/>}/>
        <Route path="/device_spec" element={<DeviceSpec/>}/>
        <Route path="/egrul" element={<Egrul/>}/>
        <Route path="*"     element={<LandingPage/>} />
      </Routes>
  );
};

export default Router;
