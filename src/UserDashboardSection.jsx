import React, { useState, useContext, useEffect } from "react";
import { UserAuthContext } from "./MainPanel.jsx";
import axios from "axios";
import {
  StatefulDataTable,
  NumericalColumn,
  StringColumn,
} from "baseui/data-table";

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
  const { userInfo } = useContext(UserAuthContext);

  const [dashboardUsers, setDashboardUsers] = useState([]);

  useEffect(() => {
    if (userInfo.level <= 3) {
      axios.get("api/routes/dashboard", { params: userInfo }).then((res) => {
        let mappedUserData = res.data.map((dashUser) => {
          const {
            company,
            email,
            id,
            name,
            phone,
            title_function,
            vessel,
            port,
            testsCompleted,
            totalTests,
          } = dashUser;

          let progressQuotient = (
            Math.round((testsCompleted / totalTests) * 100) / 100
          ).toFixed(2);
          let totalTestCount = `${testsCompleted} / ${totalTests}`;

          let dashUserData = Object.values({
            name,
            phone,
            email,
            title_function,
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

        setDashboardUsers(mappedUserData);
      });
    }
  }, [userInfo]);

  return (
    <div className={{ height: "800px" }}>
      <h3>Tracking My Crew's Progress:</h3>
      <StatefulDataTable columns={columns} rows={dashboardUsers} />
    </div>
  );
};

export default UserDashboardSection;
