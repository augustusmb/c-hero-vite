import { useRef, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { useLoggedInUserContext } from "./hooks/useLoggedInUserContext.ts";
import { getDashboardUsers } from "./api/user.ts";
import BeatLoader from "react-spinners/BeatLoader";
import CrewProgressBarCellRenderer from "./tableCellRenderers/CrewProgressBarCellRenderer.tsx";
import ClassProgressDatesCellRenderer, {
  getDateFormat,
} from "./tableCellRenderers/ClassProgressDatesCellRenderer.tsx";
import { QueryKeys } from "./utils/QueryKeys.ts";

const DashboardProgressSection = () => {
  const { loggedInUserInfo } = useLoggedInUserContext();
  const { level, id, vessel, company } = loggedInUserInfo || {};
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

  const { isLoading, isError, data, error } = useQuery({
    queryKey: [QueryKeys.LIST_USERS_DASHBOARD, level, id, vessel, company],
    queryFn: getDashboardUsers,
    enabled: !!vessel,
  });

  if (isLoading) return <BeatLoader color="#123abc" loading={true} size={15} />;
  if (isError) return <span>Error: {error.message}</span>;

  const vesselProducts = data?.data.vesselProducts || [];
  const vesselProduct1 = vesselProducts[0]?.product_id;
  const vesselProduct2 = vesselProducts[1]?.product_id;

  const colDefs = [
    {
      headerName: data?.data.vesselName,
      children: [
        {
          headerName: "Crew",
          field: "name",
          cellRenderer: CrewProgressBarCellRenderer,
          width: 200,
        },
        { headerName: "Port", field: "port" },
        { headerName: "Title", field: "title" },
        {
          headerName: "Date Started",
          valueGetter: (params: { data: { date_signed_up: Date } }) => {
            return getDateFormat(params.data.date_signed_up);
          },
        },
        {
          headerName: "MOB Equipment",
          cellRenderer: () => {
            return (
              <div>
                <div>{vesselProduct1?.toUpperCase() || "N/A"}</div>
                <div>{vesselProduct2?.toUpperCase() || "N/A"}</div>
              </div>
            );
          },
        },
        {
          headerName: "Date Classes Completed",
          children: [
            {
              headerName: "Setup",
              cellRenderer: ClassProgressDatesCellRenderer(
                "a",
                vesselProduct1,
                vesselProduct2,
              ),
            },
            {
              headerName: "Operations",
              cellRenderer: ClassProgressDatesCellRenderer(
                "b",
                vesselProduct1,
                vesselProduct2,
              ),
            },
            {
              headerName: "Inspection",
              cellRenderer: ClassProgressDatesCellRenderer(
                "c",
                vesselProduct1,
                vesselProduct2,
              ),
            },
            {
              headerName: "Drill",
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
    <div
      className="ag-theme-quartz mb-10" // applying the grid theme
      style={{ height: 500, width: "100%" }} // the grid will fill the size of the parent container
    >
      <h4 className="mt-8 self-start text-xl font-semibold text-slate-900 underline lg:text-xl">
        Vessel's Crew Progress Dashboard
      </h4>{" "}
      <div className="shadow-xl" style={{ height: 500, width: "100%" }}>
        <AgGridReact
          getRowStyle={getRowStyle}
          ref={gridRef}
          rowData={data?.data.usersWithProductProgressMaps}
          columnDefs={colDefs}
          defaultColDef={{ cellStyle: { textAlign: "left" }, width: 125 }}
          rowHeight={82}
        />
      </div>
    </div>
  );
};

export default DashboardProgressSection;
