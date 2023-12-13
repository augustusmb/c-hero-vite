import { Routes, Route, Navigate } from "react-router-dom";
import TestTakingPage from "./TestTakingPage.jsx";
import PDFRenderPage from "./PDFRenderPage.jsx";
import CertificatePage from "./CertificatePage.jsx";
import AdminPage from "./AdminPage.jsx";
import HomePage from "./HomePage.jsx";

const MainPanelRouter = () => {
  return (
    <div>
      <Routes>
        <Route path="/certification" element={<CertificatePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/test/:classId" element={<TestTakingPage />} />
        <Route path="/class/:classId" element={<PDFRenderPage />} />
        <Route path="/help/:safety" element={<PDFRenderPage />} />
        <Route path="/help/:troubleshooting" element={<PDFRenderPage />} />
        <Route
          path="/help/:MobInspectionCheckList"
          element={<PDFRenderPage />}
        />
        <Route path="/help/:MobDrillLog" element={<PDFRenderPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/redirect" element={<Navigate to="/" />} />
        <Route path="/home" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default MainPanelRouter;
