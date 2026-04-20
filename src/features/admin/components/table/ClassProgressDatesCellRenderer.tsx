type ClassProgress = {
  date_completed: Date;
};

type UserFullProgressMap = {
  [x: string]: {
    assigned: boolean;
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
  (suffix: string) => (params: ClassProgressParams) => {
    const progressMap = params?.data?.userFullProgressMap ?? {};
    const assignedCodes = Object.keys(progressMap).filter(
      (code) => progressMap[code]?.assigned,
    );

    if (assignedCodes.length === 0) {
      return (
        <div className="flex h-full items-center text-sm text-slate-400">—</div>
      );
    }

    return (
      <div className="flex h-full flex-col divide-y divide-slate-100">
        {assignedCodes.map((code) => {
          const formatted = getDateFormat(
            progressMap[code]?.classProgress?.[`${code}_${suffix}`]
              ?.date_completed,
          );
          return (
            <div
              key={code}
              className="flex flex-1 items-center py-1 text-sm"
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
  };

export default ClassProgressDatesCellRenderer;
