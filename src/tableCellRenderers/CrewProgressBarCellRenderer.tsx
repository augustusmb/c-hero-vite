const CrewProgressBarCellRenderer = (params: any) => {
  const { first_name, last_name, totalAssessments, assessmentsCompleted } =
    params.data;

  const percentageComplete =
    Math.round((assessmentsCompleted / totalAssessments) * 100) || 0;

  const isComplete = percentageComplete === 100;
  const fillColor = isComplete ? "bg-green-500" : "bg-slate-500";

  return (
    <div className="flex h-full flex-col justify-center gap-1.5 py-2">
      <div className="text-sm font-medium text-slate-900">
        {`${first_name} ${last_name}`}
      </div>
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${fillColor}`}
            style={{ width: `${percentageComplete}%` }}
          />
        </div>
        <span className="text-xs font-medium text-slate-600">
          {percentageComplete}%
        </span>
      </div>
    </div>
  );
};

export default CrewProgressBarCellRenderer;
