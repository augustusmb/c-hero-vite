type RadioImageGroupProps<T extends string> = {
  title: string;
  description: string;
  options: Array<{
    value: T;
    label: string;
    image: string;
  }>;
  name: string;
  selected: T | null;
  onSelect: (value: T) => void;
  error?: string;
};

export function RadioImageGroup<T extends string>({
  title,
  description,
  options,
  name,
  selected,
  onSelect,
  error,
}: RadioImageGroupProps<T>) {
  return (
    <div className="flex flex-col gap-1 pb-2 pt-4">
      <label className="text-base font-semibold text-gray-900">
        {title}
      </label>
      <p className="mb-2 max-w-2xl text-sm text-gray-600">
        {description}
      </p>
      <div
        className={`grid grid-cols-2 gap-2 lg:gap-3 ${
          options.length >= 4 ? "lg:grid-cols-4" : ""
        }`}
      >
        {options.map((item) => (
          <div
            key={item.value}
            onClick={() => onSelect(item.value)}
            className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border p-2 ${
              selected === item.value
                ? "border-2 border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <label
              htmlFor={item.value}
              className={`text-center text-sm font-medium ${
                selected === item.value ? "text-blue-500" : "text-gray-900"
              }`}
            >
              {item.label}
            </label>
            <img
              src={item.image}
              alt={item.label}
              className="h-16 w-16 rounded-md object-cover"
            />
            <input
              type="radio"
              value={item.value}
              id={item.value}
              name={name}
              checked={selected === item.value}
              onChange={() => onSelect(item.value)}
              className="sr-only"
            />
          </div>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
