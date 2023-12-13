import React, { useState, useEffect } from "react";
import { UserAuthContext } from "./MainPanel.jsx";
import axios from "axios";

const columns = [
  StringColumn({
    title: "Name",
    mapDataToValue: (data) => data[0],
  }),
  StringColumn({
    title: "Phone",
    mapDataToValue: (data) => data[1],
  }),
  StringColumn({
    title: "Email",
    mapDataToValue: (data) => data[2],
  }),
  StringColumn({
    title: "Title",
    mapDataToValue: (data) => data[3],
  }),
  StringColumn({
    title: "Company",
    mapDataToValue: (data) => data[4],
  }),
  StringColumn({
    title: "Vessel",
    mapDataToValue: (data) => data[5],
  }),
  StringColumn({
    title: "Port",
    mapDataToValue: (data) => data[6],
  }),
  NumericalColumn({
    title: "Progress",
    precision: 3,
    mapDataToValue: (data) => data[7],
  }),
  StringColumn({
    title: "Total",
    mapDataToValue: (data) => data[8],
  }),
];

const UserDashboardSection = () => {
  // const { userInfo } = useContext(UserAuthContext);

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      let allUserData = await axios.get("/routes/all-user-overview");
      console.log("ALL USER DATA HERE " + allUserData.data[0]);
      let mappedUserData = allUserData.data.map((user) => {
        const {
          company,
          email,
          id,
          name,
          phone,
          title,
          vessel,
          port,
          testsCompleted,
          totalTests,
        } = user;

        let progressQuotient = (
          Math.round((testsCompleted / totalTests) * 100) / 100
        ).toFixed(2);
        let totalTestCount = `${testsCompleted} / ${totalTests}`;

        let dashUserData = Object.values({
          name,
          phone,
          email,
          title,
          company,
          vessel,
          port,
          progressQuotient,
          totalTestCount,
        });

        return {
          id,
          data: dashUserData,
        };
      });

      setUserData(mappedUserData);
    };

    fetchUserData();
  });

  return (
    <div className={{ height: "800px" }}>
      <h3>All Signed Up Users:</h3>
      <StatefulDataTable columns={columns} rows={userData} />
      <div>Sup Bro</div>
    </div>
  );
};

export default UserDashboardSection;
