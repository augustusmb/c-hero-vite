import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import HeaderNavigation from "./HeaderNavigation.jsx";
import MainPanelRouter from "./MainPanelRouter.jsx";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

export const UserAuthContext = React.createContext();

const MainPanelLayout = () => {
  const [userInfo, setUserInfo] = useState({});
  const [editMode, setEditMode] = useState(1);
  const { user } = useAuth0();

  const userInfoContext = {
    userInfo,
    toggleEditMode: (val) => {
      setEditMode(val);
    },
  };

  useEffect(() => {
    setEditMode(1);
    user &&
      axios
        .get("/api/routes/users", {
          params: { phone: user.name },
        })
        .then((res) => {
          setUserInfo(res.data[0]);
        })
        .catch((err) => {
          console.log("Error here retrieving user info: ", err);
        });
  }, [user, editMode]);

  return (
    <Router>
      <UserAuthContext.Provider value={userInfoContext}>
        <div>
          <HeaderNavigation />
        </div>
        <div>
          <MainPanelRouter />
        </div>
      </UserAuthContext.Provider>
    </Router>
  );
};

export default MainPanelLayout;
