type Props = {
  active: number;
  max?: number;
};

export function ActiveCapacityBar({ active, max = 5 }: Props) {
  const maxArray = new Array(max).fill(0);
  return (
    <div className="flex shrink-0 gap-1.5 ml-4">
      {maxArray.map((_, index) => (
        <div
          key={index}
          className={`h-2 w-16 rounded-full ${
            index < active ? "bg-purple-500" : "bg-slate-700"
          }`}
        />
      ))}
    </div>
  );
}
