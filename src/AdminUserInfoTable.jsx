import { useState, useMemo, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { fetchAllUsers } from "./api/user";
import { PropTypes } from "prop-types";

const AdminUserInfoTable = ({ handleUserToEdit }) => {
  const gridRef = useRef();
  // const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  // const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
    };
  }, []);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setGridOption(
      "quickFilterText",
      document.getElementById("filter-text-box").value,
    );
  }, []);

  const [colDefs, setColDefs] = useState([
    { field: "name" },
    { field: "phone" },
    { field: "title" },
    { field: "vessel" },
    { field: "port" },
    { field: "company" },
  ]);

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["all-users"],
    queryFn: fetchAllUsers,
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const onSelectionChanged = (e) => {
    const selectedRowData = e.api.getSelectedNodes()[0].data;
    console.log("selectedRowData: ", selectedRowData);
    handleUserToEdit(selectedRowData);
  };

  return (
    <div className="ag-theme-quartz" style={{ height: 600, width: 1200 }}>
      <div className="example-wrapper">
        <div className="flex text-lg">
          <span>Filter Search:</span>
          <input
            type="text"
            id="filter-text-box"
            placeholder="Filter..."
            onInput={onFilterTextBoxChanged}
          />
        </div>
        <div style={{ height: 500, width: 1200 }}>
          <AgGridReact
            ref={gridRef}
            rowData={data.data}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            rowSelection="single"
            onSelectionChanged={(e) => onSelectionChanged(e)}
          />
        </div>
      </div>
    </div>
  );
};

AdminUserInfoTable.propTypes = {
  handleUserToEdit: PropTypes.func,
};

export default AdminUserInfoTable;
