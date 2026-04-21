import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoggedInUserContext } from "../hooks/useLoggedInUserContext.ts";

const AdminQuestionsPage = () => {
  const navigate = useNavigate();
  const { loggedInUserInfo } = useLoggedInUserContext();

  useEffect(() => {
    if (!loggedInUserInfo?.is_admin) {
      return navigate("/redirect");
    }
  }, [loggedInUserInfo, navigate]);

  return (
    <div className="mx-auto max-w-4xl pb-10">
      <div className="rounded-lg border border-slate-200 bg-slate-050 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">Questions</h1>
        <p className="mt-4 text-slate-600">
          Admin question authoring is coming soon. This page will let admins
          add, edit, and remove assessment questions for each product class.
        </p>
      </div>
    </div>
  );
};

export default AdminQuestionsPage;
