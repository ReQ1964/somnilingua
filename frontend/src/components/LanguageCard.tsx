import { Language, Activity, totalHours, todayKey, minutesOnDate } from "@/lib/store";
import { progressToNext } from "@/lib/cefr";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export default function LanguageCard({
  language,
  activities,
  streak,
  index,
}: {
  language: Language;
  activities: Activity[];
  streak: number;
  index: number;
}) {
  const { t } = useTranslation();
  const total = totalHours(language, activities);
  const { current, next, pct } = progressToNext(total);
  const todayMin = minutesOnDate(activities, todayKey(), language.id);
  const goalPct = Math.min(100, (todayMin / language.dailyGoalMin) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <Link to={`/language/${language.id}`}>
        <Card className="group relative overflow-hidden p-6 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border/60">
          <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{language.flag}</div>
                <div>
                  <h3 className="font-semibold text-lg">{language.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {total.toFixed(1)} {t("common.hours")}
                  </p>
                </div>
              </div>
              {streak > 0 && (
                <div className="flex items-center gap-1 text-sm font-medium text-accent">
                  <Flame className="h-4 w-4 fill-current" />
                  {streak}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold">
                    {current.level}
                    {next && <span className="text-muted-foreground"> → {next.level}</span>}
                  </span>
                  <span className="text-muted-foreground tabular-nums">{Math.round(pct)}%</span>
                </div>
                <Progress value={pct} className="h-1.5" />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">
                    {t("common.today")} • {todayMin}/{language.dailyGoalMin} {t("common.min")}
                  </span>
                  <span className="text-muted-foreground tabular-nums">{Math.round(goalPct)}%</span>
                </div>
                <Progress value={goalPct} className="h-1.5 [&>div]:bg-accent" />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}