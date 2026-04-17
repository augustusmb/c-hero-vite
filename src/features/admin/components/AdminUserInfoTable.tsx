import { useEffect, useMemo, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { listUsers } from "../../../api/user.ts";
import { UserType } from "../../../types/types.ts";
import BeatLoader from "react-spinners/BeatLoader";
import { QueryKeys } from "../../../lib/QueryKeys.ts";
import { strings } from "../../../utils/strings.ts";
import PositionBadge from "../../../components/PositionBadge.tsx";
import { formatPhone } from "../../../utils/formatPhone.ts";

const capitalizeFirst = (s: string | undefined | null) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

type AdminTableProps = {
  handleUserToEdit: (user: UserType) => void;
};

const AdminUserInfoTable: React.FC<AdminTableProps> = ({
  handleUserToEdit,
}) => {
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
    return { background: "#ffffff" };
  }, []);

  const colDefs = [
    {
      headerName: "Name / Phone",
      field: "first_name",
      flex: 1.3,
      cellRenderer: threeValuesCellRenderer,
      cellRendererParams: {
        field1: `first_name`,
        field2: `last_name`,
        field3: "phone",
      },
    },
    {
      headerName: "Position / Vessel",
      field: "position",
      flex: 0.9,
      cellRenderer: PositionVesselCellRenderer,
    },
    {
      headerName: "Company / Port",
      field: "company",
      flex: 1,
      cellRenderer: TwoValuesCellRenderer,
      cellRendererParams: {
        field1: "company",
        field2: "port",
      },
    },
  ];

  function threeValuesCellRenderer(params: {
    colDef: any;
    field1: string;
    field2: string;
    field3: string;
    data: UserType;
  }) {
    const field1 = params.colDef.cellRendererParams.field1;
    const field2 = params.colDef.cellRendererParams.field2;
    const field3 = params.colDef.cellRendererParams.field3;

    const displayName =
      `${capitalizeFirst(params.data[field1])} ${capitalizeFirst(params.data[field2])}`.trim();
    const displayPhone =
      field3 === "phone"
        ? formatPhone(params.data[field3])
        : params.data[field3];

    return (
      <div className="flex flex-col leading-7">
        <span className="text-xs font-semibold lg:text-xl">{displayName}</span>
        <span className="text-xs italic text-slate-500 lg:text-sm">
          {displayPhone}
        </span>
      </div>
    );
  }

  function TwoValuesCellRenderer(params: {
    colDef: any;
    field1: string;
    field2: string;
    data: UserType;
  }) {
    const field1 = params.colDef.cellRendererParams.field1;
    const field2 = params.colDef.cellRendererParams.field2;

    return (
      <div className="flex flex-col leading-7">
        <span className="text-xs font-semibold lg:text-xl">
          {params.data[field1].charAt(0).toUpperCase() +
            params.data[field1].slice(1)}
        </span>
        <span className="text-xs italic lg:text-lg">{params.data[field2]}</span>
      </div>
    );
  }

  function PositionVesselCellRenderer(params: { data: UserType }) {
    return (
      <div className="flex flex-col items-start justify-center gap-1 leading-7">
        <PositionBadge value={params.data.position} />
        <span className="text-xs italic lg:text-lg">{params.data.vessel}</span>
      </div>
    );
  }

  const onSelectionChanged = (e: { api: any }) => {
    const selectedRowData = e.api.getSelectedNodes()[0].data;
    handleUserToEdit(selectedRowData);
  };

  const { isLoading, isError, data, error } = useQuery({
    queryKey: [QueryKeys.LIST_USERS],
    queryFn: listUsers,
  });

  if (isLoading) return <BeatLoader color="#123abc" loading={true} size={15} />;
  if (isError)
    return <span>{`${strings["common.error"]}: ${error.message}`}</span>;

  return (
    <div className="ag-theme-quartz" style={{ height: 600 }}>
      <div className="example-wrapper">
        <div className="mb-3 flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-2">
          <label
            htmlFor="filter-text-box"
            className="text-sm font-semibold text-slate-700"
          >
            Filter:
          </label>
          <input
            type="text"
            id="filter-text-box"
            placeholder="Search users..."
            onInput={onFilterTextBoxChanged}
            className="flex-1 rounded border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
        <div
          className="rounded-md border border-slate-200 shadow-sm"
          style={{ height: 500, width: "100%" }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={data?.data}
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
