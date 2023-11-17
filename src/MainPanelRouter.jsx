import { Routes, Route } from "react-router-dom";
import TestTakingPage from "./TestTakingPage.jsx";
// import UserAccountPage from "./UserAccountPage.jsx";
// import CustomerSetup from "./CustomerSetup.jsx";
// import DrillVideosPage from "./DrillVideosPage.jsx";
import PDFRenderPage from "./PDFRenderPage.jsx";
import CertificatePage from "./CertificatePage.jsx";
// import AllUserOverview from "./AllUserOverview.jsx";
import HomePage from "./HomePage.jsx";

const MainPanelRouter = () => {
  return (
    <div>
      <Routes>
        {/* <Route path="/drill-videos-page" element={DrillVideosPage} /> */}
        <Route path="/certification" element={<CertificatePage />} />
        {/* <Route path="/customersetup" element={CustomerSetup} /> */}
        <Route path="/test/:classId" element={<TestTakingPage />} />
        <Route path="/class/:classId" element={<PDFRenderPage />} />
        <Route path="/help/:safety" element={<PDFRenderPage />} />
        <Route path="/help/:troubleshooting" element={<PDFRenderPage />} />
        <Route
          path="/help/:MobInspectionCheckList"
          element={<PDFRenderPage />}
        />
        <Route path="/help/:MobDrillLog" element={<PDFRenderPage />} />
        {/* <Route path="/all-user-overview" element={AllUserOverview} /> */}
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
};

export default MainPanelRouter;
