type ClassProgress = {
  date_completed: Date;
};

type UserFullProgressMap = {
  [x: string]: {
    classProgress: {
      [x: string]: ClassProgress;
    };
  };
};

type ClassProgressParams = {
  data: {
    userFullProgressMap: UserFullProgressMap;
  };
};

export function getDateFormat(date: Date | undefined | null): string | null {
  if (!date) return null;
  const dateObj = new Date(date);
  return `${
    dateObj.getMonth() + 1
  }/${dateObj.getDate()}/${dateObj.getFullYear()}`;
}

const ClassProgressDatesCellRenderer =
  (suffix: string, vesselProduct1: string, vesselProduct2: string) =>
  (params: ClassProgressParams) => (
    <div className="flex h-full flex-col">
      {[vesselProduct1, vesselProduct2].map((product, index) => {
        const formatted = getDateFormat(
          params?.data?.userFullProgressMap?.[product]?.classProgress?.[
            `${product}_${suffix}`
          ]?.date_completed,
        );
        return (
          <div
            key={index}
            className={`flex flex-1 items-center text-sm ${
              index === 0 ? "border-b border-slate-100" : ""
            }`}
          >
            {formatted ? (
              <span className="text-slate-900">{formatted}</span>
            ) : (
              <span className="text-slate-400">—</span>
            )}
          </div>
        );
      })}
    </div>
  );

export default ClassProgressDatesCellRenderer;
