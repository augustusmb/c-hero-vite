import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoggedInUserContext } from "../hooks/useLoggedInUserContext.ts";
import AdminQuestionsList from "../features/admin/questions/components/AdminQuestionsList.tsx";

const AdminQuestionsPage = () => {
  const navigate = useNavigate();
  const { loggedInUserInfo } = useLoggedInUserContext();

  useEffect(() => {
    if (!loggedInUserInfo?.is_admin) {
      return navigate("/redirect");
    }
  }, [loggedInUserInfo, navigate]);

  if (!loggedInUserInfo?.is_admin) return null;

  return <AdminQuestionsList />;
};

export default AdminQuestionsPage;
