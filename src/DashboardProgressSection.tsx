import { useState, useRef, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { useLoggedInUserContext } from "./hooks/useLoggedInUserContext.ts";
import { getDashboardUsers } from "./api/user.ts";

const DashboardProgressSection = () => {
  const { loggedInUserInfo } = useLoggedInUserContext();
  const { level, id, vessel, company } = loggedInUserInfo || {};
  const gridRef = useRef<AgGridReact | null>(null);

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["dashboard-users", level, id, vessel, company],
    queryFn: getDashboardUsers,
  });

  useEffect(() => {
    const handleResize = () => {
      if (gridRef.current) {
        gridRef.current.api.sizeColumnsToFit();
      }
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component is unmounted
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: "name" },
    { field: "phone" },
    { field: "company" },
    { field: "vessel" },
    { field: "testsCompleted" },
    { field: "totalTests" },
  ]);

  const getRowStyle = useCallback((params: any) => {
    if (params.node.rowIndex % 2 === 0) {
      return { background: "#f8f8f8" };
    }
    return { background: "#ffffff" };
  }, []);

  if (isLoading) return <span>Loading...</span>;
  if (isError) return <span>Error: {error.message}</span>;

  return (
    <div
      className="ag-theme-quartz" // applying the grid theme
      style={{ height: 500 }} // the grid will fill the size of the parent container
    >
      <AgGridReact
        getRowStyle={getRowStyle}
        ref={gridRef}
        rowData={data?.data}
        columnDefs={colDefs}
      />
    </div>
  );
};

export default DashboardProgressSection;
