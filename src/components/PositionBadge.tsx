type PositionBadgeProps = {
  value: string | undefined | null;
};

const positionStyles: Record<string, string> = {
  captain: "bg-orange-100 text-orange-700",
  crew: "bg-sky-100 text-sky-700",
  shoreside: "bg-violet-100 text-violet-700",
};

const PositionBadge = ({ value }: PositionBadgeProps) => {
  if (!value) return null;
  const className =
    positionStyles[value.toLowerCase()] ?? "bg-slate-100 text-slate-700";
  return (
    <span
      className={`inline-block rounded-full px-3 py-0.5 text-xs font-medium uppercase tracking-wide ${className}`}
    >
      {value}
    </span>
  );
};

export default PositionBadge;
