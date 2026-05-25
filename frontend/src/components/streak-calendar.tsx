import { Activity, minutesOnDate } from "@/lib/store";
import { eachDayOfInterval, endOfMonth, format, startOfMonth, getDay } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function StreakCalendar({
  activities,
  goal,
  languageId,
}: {
  activities: Activity[];
  goal: number;
  languageId: string;
}) {
  const [cursor, setCursor] = useState(new Date());
  const days = eachDayOfInterval({ start: startOfMonth(cursor), end: endOfMonth(cursor) });
  const offset = getDay(startOfMonth(cursor));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm">{format(cursor, "MMMM yyyy")}</h4>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] text-muted-foreground mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`e${i}`} />
        ))}
        {days.map((d) => {
          const k = format(d, "yyyy-MM-dd");
          const m = minutesOnDate(activities, k, languageId);
          const hit = m >= goal && goal > 0;
          const partial = m > 0 && !hit;
          return (
            <div
              key={k}
              title={`${m} min`}
              className={cn(
                "aspect-square rounded-md text-[10px] flex items-center justify-center border",
                hit && "bg-gradient-primary text-primary-foreground border-transparent shadow-soft",
                partial && "bg-accent/20 border-accent/40 text-foreground",
                !hit && !partial && "border-border/60 text-muted-foreground"
              )}
            >
              {d.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}