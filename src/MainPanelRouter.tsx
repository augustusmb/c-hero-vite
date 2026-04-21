import { Routes, Route, Navigate, useParams } from "react-router-dom";
import AssessmentPage from "./pages/AssessmentPage.tsx";
import PDFRenderPage from "./pages/PDFRenderPage.tsx";
import CertificatePage from "./pages/CertificatePage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import AdminQuestionsPage from "./pages/AdminQuestionsPage.tsx";
import HomePage from "./pages/HomePage.tsx";

const LegacyTestRedirect = () => {
  const { classId } = useParams();
  return <Navigate to={`/assessment/${classId}`} replace />;
};

const MainPanelRouter = () => {
  return (
    <div className="p-1 lg:m-8">
      <Routes>
        <Route path="/certification" element={<CertificatePage />} />
        <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
        <Route path="/admin/users" element={<AdminPage />} />
        <Route path="/admin/questions" element={<AdminQuestionsPage />} />
        <Route path="/assessment/:classId" element={<AssessmentPage />} />
        <Route path="/test/:classId" element={<LegacyTestRedirect />} />
        <Route path="/class/:classId" element={<PDFRenderPage />} />
        <Route path="/help/:docId" element={<PDFRenderPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/redirect" element={<Navigate to="/" />} />
        <Route path="/home" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default MainPanelRouter;
