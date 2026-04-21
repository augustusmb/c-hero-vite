import { useRef, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { useLoggedInUserContext } from "../../../hooks/useLoggedInUserContext.ts";
import { dashboardUsersQuery } from "../queries.ts";
import BeatLoader from "react-spinners/BeatLoader";
import CrewProgressBarCellRenderer from "../../admin/components/table/CrewProgressBarCellRenderer.tsx";
import ClassProgressDatesCellRenderer from "../../admin/components/table/ClassProgressDatesCellRenderer.tsx";
import { strings } from "../../../utils/strings.ts";

const DashboardProgressSection = () => {
  const { loggedInUserInfo } = useLoggedInUserContext();
  const { id, vessel_id, company } = loggedInUserInfo || {};
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

  const getRowStyle = useCallback((params: any) => {
    if (params.node.rowIndex % 2 === 0) {
      return { background: "#f8f8f8" };
    }
    return { background: "#ffffff" };
  }, []);

  const { isLoading, isError, data, error } = useQuery(
    dashboardUsersQuery({ id, vessel_id, company }),
  );

  if (isError)
    return <span>{`${strings["common.error"]}: ${error.message}`}</span>;

  const ROW_BASE_HEIGHT = 24;
  const ROW_PER_PRODUCT_HEIGHT = 30;
  const ROW_MIN_HEIGHT = 116;

  const getAssignedProductCodes = (row?: {
    userFullProgressMap?: Record<string, { assigned?: boolean }>;
  }) =>
    Object.keys(row?.userFullProgressMap ?? {}).filter(
      (code) => row?.userFullProgressMap?.[code]?.assigned,
    );

  const getRowHeight = (params: { data?: unknown }) => {
    const count = getAssignedProductCodes(params.data as any).length;
    return Math.max(
      ROW_MIN_HEIGHT,
      ROW_BASE_HEIGHT + Math.max(1, count) * ROW_PER_PRODUCT_HEIGHT,
    );
  };

  const centeredCellStyle = {
    display: "flex",
    alignItems: "center",
    textAlign: "left" as const,
  };

  const colDefs = [
    {
      headerName: data?.vesselName,
      children: [
        {
          headerName: "Crew",
          field: "name",
          cellRenderer: CrewProgressBarCellRenderer,
          cellStyle: centeredCellStyle,
          width: 320,
        },
        {
          headerName: "MOB Equipment",
          width: 160,
          cellRenderer: (params: {
            data: {
              userFullProgressMap?: Record<string, { assigned?: boolean }>;
            };
          }) => {
            const codes = getAssignedProductCodes(params.data);
            if (codes.length === 0) {
              return (
                <div className="flex h-full items-center text-xs text-slate-400">
                  None
                </div>
              );
            }
            return (
              <div className="flex h-full flex-col divide-y divide-slate-100">
                {codes.map((code) => (
                  <div
                    key={code}
                    className="flex flex-1 items-center py-1"
                  >
                    <span className="inline-flex w-fit items-center rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                      {code.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            );
          },
        },
        {
          headerName: "Date Classes Completed",
          children: [
            {
              headerName: "Setup",
              flex: 1,
              minWidth: 100,
              cellRenderer: ClassProgressDatesCellRenderer("a"),
            },
            {
              headerName: "Operations",
              flex: 1,
              minWidth: 100,
              cellRenderer: ClassProgressDatesCellRenderer("b"),
            },
            {
              headerName: "Inspection",
              flex: 1,
              minWidth: 100,
              cellRenderer: ClassProgressDatesCellRenderer("c"),
            },
            {
              headerName: "Drill",
              flex: 1,
              minWidth: 100,
              cellRenderer: ClassProgressDatesCellRenderer("d"),
            },
            {
              headerName: "Prusik",
              flex: 1,
              minWidth: 100,
              cellRenderer: ClassProgressDatesCellRenderer("p"),
            },
          ],
        },
      ],
    },
  ];

  return (
    <div className="mb-10 overflow-hidden rounded-lg border border-slate-200 bg-slate-050 p-4 shadow-sm lg:p-5">
      <h4 className="mb-4 text-xl font-semibold text-slate-900 lg:text-2xl">
        {strings["dashboard.title"]}
      </h4>
      {isLoading ? (
        <div className="flex justify-center py-10">
          <BeatLoader color="#123abc" loading={true} size={15} />
        </div>
      ) : (
        <div className="ag-theme-quartz h-[400px] w-full sm:h-[500px] lg:h-[600px]">
          <AgGridReact
            getRowStyle={getRowStyle}
            ref={gridRef}
            rowData={data?.usersWithProductProgressMaps}
            columnDefs={colDefs}
            defaultColDef={{ cellStyle: { textAlign: "left" }, width: 125 }}
            getRowHeight={getRowHeight}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardProgressSection;
