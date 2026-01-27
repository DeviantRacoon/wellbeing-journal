import { cn } from "@/commons/libs/cn";
import { MOODS } from "@/commons/libs/constants";

interface MoodSelectorProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export default function MoodSelector({
  value,
  onChange,
  className,
}: MoodSelectorProps) {
  return (
    <div
      className={cn(
        "flex w-full justify-between items-center gap-2",
        className,
      )}
    >
      {MOODS.map((mood) => {
        const Icon = mood.icon;
        const isSelected = value === mood.value;

        return (
          <button
            key={mood.value}
            type="button"
            onClick={() => onChange(mood.value)}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 group",
              isSelected
                ? "bg-white/15 scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-white/20"
                : "hover:bg-white/5 hover:scale-105 border border-transparent",
            )}
          >
            <Icon
              className={cn(
                "w-8 h-8 mb-2 transition-colors",
                isSelected
                  ? mood.color
                  : "text-white/40 group-hover:text-white/60",
              )}
              strokeWidth={isSelected ? 2 : 1.5}
            />
            <span
              className={cn(
                "text-xs font-medium transition-colors",
                isSelected ? "text-white" : "text-white/30",
              )}
            >
              {mood.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
