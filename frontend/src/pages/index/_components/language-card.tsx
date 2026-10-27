import { LanguageEnrollmentResponse } from '@/api/api.ts';
import { Card } from '@/shared/components/ui/card.tsx';
import { Progress } from '@/shared/components/ui/progress.tsx';
import { getLanguageFlag } from '@/shared/lib/language-flags.ts';
import { useTranslation } from 'react-i18next';
import { Link } from '@/router.ts';
import { motion } from 'framer-motion';

export default function LanguageCard({
  enrollment,
  index,
}: {
  enrollment: LanguageEnrollmentResponse;
  index: number;
}) {
  const { t } = useTranslation();
  const language = enrollment.language;

  const dailyGoalMinutes = enrollment.dailyGoalMinutes;
  const totalMinutes = enrollment.activityStats.totalMinutes;
  const todayMinutes = enrollment.activityStats.todayMinutes;
  const totalHours = totalMinutes / 60;
  const currentLevel = enrollment.cefrProgress.currentLevel;
  const nextLevel = enrollment.cefrProgress.nextLevel;
  const progressPercent = enrollment.cefrProgress.progressPercent;
  const goalPercent = dailyGoalMinutes > 0
    ? Math.min(100, (todayMinutes / dailyGoalMinutes) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <Link to="/language/:id" params={{ id: String(language.id) }}>
        <Card
          className="group relative overflow-hidden p-6 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border/60">
          <div
            className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{getLanguageFlag(language.code)}</div>
                <div>
                  <h3 className="font-semibold text-lg">{language.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {totalHours.toFixed(1)} {t('common.hours')}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold">
                    {currentLevel}
                    {nextLevel && <span className="text-muted-foreground"> → {nextLevel}</span>}
                  </span>
                  <span className="text-muted-foreground tabular-nums">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <Progress value={progressPercent} className="h-1.5" />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">
                    {t('common.today')} • {todayMinutes}/{dailyGoalMinutes} {t('common.min')}
                  </span>
                  <span className="text-muted-foreground tabular-nums">
                    {Math.round(goalPercent)}%
                  </span>
                </div>
                <Progress value={goalPercent} className="h-1.5 [&>div]:bg-accent" />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}