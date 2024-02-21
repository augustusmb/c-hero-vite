//@ts-nocheck

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { fetchAllUsers } from "./api/user.ts";
import { UserType } from "./types/types.ts";

interface AdminTableProps {
  handleUserToEdit: (user: UserType) => void;
}

const AdminUserInfoTable: React.FC<AdminTableProps> = ({
  handleUserToEdit,
}) => {
  // const gridRef = useRef();
  const gridRef = useRef<AgGridReact | null>(null);

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

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      cellStyle: { textAlign: "left", height: 82 },
    };
  }, []);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current?.api.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value,
    );
  }, []);

  const getRowStyle = useCallback((params: any) => {
    if (params.node.rowIndex % 2 === 0) {
      return { background: "#f8f8f8" };
    }
    return null;
  }, []);

  const [colDefs, setColDefs] = useState([
    {
      headerName: "Name / Phone",
      field: "name",
      cellRenderer: TwoValuesCellRenderer,
      cellRendererParams: {
        field1: "name",
        field2: "phone",
      },
    },
    {
      headerName: "Title / Vessel",
      field: "name",
      cellRenderer: TwoValuesCellRenderer,
      cellRendererParams: {
        field1: "title",
        field2: "vessel",
      },
    },
    {
      headerName: "Company / Port",
      field: "company",
      cellRenderer: TwoValuesCellRenderer,
      cellRendererParams: {
        field1: "company",
        field2: "port",
      },
    },
  ]);

  function TwoValuesCellRenderer(params: { field1: string; field2: string }) {
    const field1 = params.colDef.cellRendererParams.field1;
    const field2 = params.colDef.cellRendererParams.field2;
    return (
      <div className="flex flex-col leading-7">
        <span className="text-xs font-semibold lg:text-xl">
          {params.data[field1]}
        </span>
        <span className="text-xs italic lg:text-lg">{params.data[field2]}</span>
      </div>
    );
  }

  const onSelectionChanged = (e: HTMLEvent) => {
    const selectedRowData = e.api.getSelectedNodes()[0].data;
    handleUserToEdit(selectedRowData);
  };

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["all-users"],
    queryFn: fetchAllUsers,
  });

  if (isLoading) return <span>Loading...</span>;
  if (isError) return <span>Error: {error.message}</span>;

  return (
    <div className="ag-theme-quartz" style={{ height: 600 }}>
      <div className="example-wrapper">
        <div className="flex items-baseline rounded bg-yellow-200 text-lg">
          <label
            htmlFor="filter-text-box"
            className="text-slate-950 mx-4 text-lg font-bold"
          >
            {`Filter Search: `}
          </label>
          <input
            type="text"
            id="filter-text-box"
            placeholder="Filter..."
            onInput={onFilterTextBoxChanged}
            className="border-2 border-indigo-100"
          />
        </div>
        <div
          className="border-x-2 border-yellow-200 shadow-xl"
          style={{ height: 500, width: "100%" }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={data.data}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            rowSelection="single"
            onSelectionChanged={(e) => onSelectionChanged(e)}
            getRowStyle={getRowStyle}
            rowHeight={65} // assuming the current height is 82
          />
        </div>
      </div>
    </div>
  );
};

export default AdminUserInfoTable;
