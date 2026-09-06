import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type Props = {
  pauseCount: number;
};
const MAX_PAUSES = 2;
export function PauseBars({ pauseCount }: Props) {
  const used = pauseCount;
  const remaining = Math.max(MAX_PAUSES - used, 0);

  return (
    <TooltipProvider>
      <div className="flex gap-2 relative">
        {Array.from({ length: MAX_PAUSES }).map((_, index) => {
          const isUsed = index < used;

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  role="img"
                  className={`h-7 w-2.5 rounded-md border border-green-400 ${isUsed ? "bg-transparent border-slate-400" : "bg-green-500"}`}
                />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-transparent border-none text-white text-xs"
              >
                {remaining} of {MAX_PAUSES} pauses left
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
