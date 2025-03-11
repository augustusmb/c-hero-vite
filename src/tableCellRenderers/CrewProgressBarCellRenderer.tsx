const PROGRESS_BAR_MIN_WIDTH = 30;

const CrewProgressBarCellRenderer = (params: any) => {
  const { first_name, last_name, totalTests, testsCompleted } = params.data;

  const percentageComplete =
    Math.round((testsCompleted / totalTests) * 100) || 0;

  const bgColor = ((percentage: number) => {
    if (percentage <= 20) return "bg-red-300";
    if (percentage <= 35) return "bg-orange-300";
    if (percentage <= 60) return "bg-yellow-300";
    if (percentage <= 99) return "bg-green-300";
    return "bg-indigo-300";
  })(percentageComplete);

  return (
    <div>
      <div>{`${first_name} ${last_name}`}</div>
      <div
        className={`flex justify-center ${bgColor} rounded-md`}
        style={{
          width: `${percentageComplete}%`,
          minWidth: PROGRESS_BAR_MIN_WIDTH,
        }}
      >
        {percentageComplete}%
      </div>
    </div>
  );
};

export default CrewProgressBarCellRenderer;
