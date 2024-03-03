interface ClassProgress {
  date_completed: Date;
}

interface UserFullProgressMap {
  [x: string]: {
    classProgress: {
      [x: string]: ClassProgress;
    };
  };
}

interface ClassProgressParams {
  data: {
    userFullProgressMap: UserFullProgressMap;
  };
}

export function getDateFormat(date: Date) {
  if (!date) return "X";
  const dateObj = new Date(date);
  return `${
    dateObj.getMonth() + 1
  }/${dateObj.getDate()}/${dateObj.getFullYear()}`;
}

const ClassProgressDatesCellRenderer =
  (suffix: string, vesselProduct1: string, vesselProduct2: string) =>
  (params: ClassProgressParams) => (
    <>
      {[vesselProduct1, vesselProduct2].map((product, index) => (
        <div key={index}>
          {getDateFormat(
            params?.data?.userFullProgressMap[product]?.classProgress[
              `${product}_${suffix}`
            ]?.date_completed,
          )}
        </div>
      ))}
    </>
  );

export default ClassProgressDatesCellRenderer;
