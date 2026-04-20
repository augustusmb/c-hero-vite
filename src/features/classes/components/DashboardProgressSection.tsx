import { useRef, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { useLoggedInUserContext } from "../../../hooks/useLoggedInUserContext.ts";
import { dashboardUsersQuery } from "../queries.ts";
import BeatLoader from "react-spinners/BeatLoader";
import CrewProgressBarCellRenderer from "../../admin/components/table/CrewProgressBarCellRenderer.tsx";
import ClassProgressDatesCellRenderer, {
  getDateFormat,
} from "../../admin/components/table/ClassProgressDatesCellRenderer.tsx";
import PositionBadge from "../../../components/PositionBadge.tsx";
import { strings } from "../../../utils/strings.ts";

const DashboardProgressSection = () => {
  const { loggedInUserInfo } = useLoggedInUserContext();
  const { level, id, vessel_id, company } = loggedInUserInfo || {};
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
    dashboardUsersQuery({ level, id, vessel_id, company }),
  );

  if (isError)
    return <span>{`${strings["common.error"]}: ${error.message}`}</span>;

  const vesselProducts = data?.vesselProducts || [];
  const vesselProduct1 = vesselProducts[0]?.product_id;
  const vesselProduct2 = vesselProducts[1]?.product_id;

  const colDefs = [
    {
      headerName: data?.vesselName,
      children: [
        {
          headerName: "Crew",
          field: "name",
          cellRenderer: CrewProgressBarCellRenderer,
          width: 200,
        },
        { headerName: "Port", field: "port" },
        {
          headerName: "Position",
          field: "position",
          cellRenderer: (params: { value?: string }) => (
            <PositionBadge value={params.value} />
          ),
        },
        {
          headerName: "Date Started",
          valueGetter: (params: { data: { date_signed_up: Date } }) => {
            return getDateFormat(params.data.date_signed_up) ?? "—";
          },
        },
        {
          headerName: "MOB Equipment",
          width: 135,
          cellRenderer: () => {
            const Badge = ({ label }: { label: string }) => (
              <span className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                {label}
              </span>
            );
            return (
              <div className="flex h-full flex-col">
                <div className="flex flex-1 items-center border-b border-slate-100">
                  <Badge label={vesselProduct1?.toUpperCase() || "N/A"} />
                </div>
                <div className="flex flex-1 items-center">
                  <Badge label={vesselProduct2?.toUpperCase() || "N/A"} />
                </div>
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
              cellRenderer: ClassProgressDatesCellRenderer(
                "a",
                vesselProduct1,
                vesselProduct2,
              ),
            },
            {
              headerName: "Operations",
              flex: 1,
              minWidth: 100,
              cellRenderer: ClassProgressDatesCellRenderer(
                "b",
                vesselProduct1,
                vesselProduct2,
              ),
            },
            {
              headerName: "Inspection",
              flex: 1,
              minWidth: 100,
              cellRenderer: ClassProgressDatesCellRenderer(
                "c",
                vesselProduct1,
                vesselProduct2,
              ),
            },
            {
              headerName: "Drill",
              flex: 1,
              minWidth: 100,
              cellRenderer: ClassProgressDatesCellRenderer(
                "d",
                vesselProduct1,
                vesselProduct2,
              ),
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
            rowHeight={82}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardProgressSection;
