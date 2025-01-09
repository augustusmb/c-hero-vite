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
    <div className="flex flex-col gap-2 pb-2 pt-4">
      <label className="inline-block border-b-2 border-blue-500 pb-2 text-3xl font-semibold text-gray-900">
        {title}
      </label>
      <p className="mb-4 max-w-2xl text-lg italic leading-relaxed text-gray-600">
        {description}
      </p>
      <div className="grid grid-cols-2 gap-2 lg:gap-4">
        {options.map((item) => (
          <div
            key={item.value}
            onClick={() => onSelect(item.value)}
            className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-4 ${
              selected === item.value
                ? "border-2 border-blue-500"
                : "border-gray-200"
            }`}
          >
            <label
              htmlFor={item.value}
              className={`text-center font-medium ${
                selected === item.value ? "text-blue-500" : "text-gray-900"
              }`}
            >
              {item.label}
            </label>
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.label}
                className="h-24 w-24 rounded-md object-cover"
              />
              <input
                type="radio"
                value={item.value}
                id={item.value}
                name={name}
                checked={selected === item.value}
                onChange={() => onSelect(item.value)}
                className="h-4 w-4 text-blue-600"
              />
            </div>
          </div>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
