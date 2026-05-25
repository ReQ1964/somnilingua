import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { ActivityType, calcStreak, minutesOnDate, useActivities, useLanguages } from '@/lib/store';
import { Clock, Flame, Languages as LangIcon, ListChecks } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { format, subDays } from 'date-fns';
import { motion } from 'framer-motion';

const TYPE_COLORS: Record<ActivityType, string> = {
  watching: 'hsl(182 56% 42%)',
  listening: 'hsl(174 62% 55%)',
  reading: 'hsl(32 95% 58%)',
  speaking: 'hsl(14 90% 60%)',
  writing: 'hsl(280 60% 60%)',
  studying: 'hsl(220 70% 60%)',
  other: 'hsl(200 12% 55%)',
};

export default function Stats() {
  const { t } = useTranslation();
  const { languages } = useLanguages();
  const { allActivities } = useActivities();

  const totalMin = allActivities.reduce((s, a) => s + a.minutes, 0);
  const totalHours = totalMin / 60;
  const sessions = allActivities.length;
  const activeLangs = languages.length;
  const bestStreak = useMemo(
    () => languages.reduce((m, l) => Math.max(m, calcStreak(allActivities, l.dailyGoalMin, l.id)), 0),
    [languages, allActivities],
  );

  const pieData = useMemo(() => {
    const map: Record<string, number> = {};
    allActivities.forEach((a) => (map[a.type] = (map[a.type] || 0) + a.minutes));
    return Object.entries(map).map(([type, value]) => ({ name: t(`activity.types.${type}`), type, value }));
  }, [allActivities, t]);

  const langData = useMemo(() => {
    return languages.map((l) => {
      const min = allActivities.filter((a) => a.languageId === l.id).reduce((s, a) => s + a.minutes, 0);
      return { name: `${l.flag} ${l.name}`, hours: +(min / 60).toFixed(1) };
    }).filter((d) => d.hours > 0);
  }, [languages, allActivities]);

  const lineData = useMemo(() => {
    const days: { label: string; minutes: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const k = format(d, 'yyyy-MM-dd');
      days.push({ label: format(d, 'MMM d'), minutes: minutesOnDate(allActivities, k) });
    }
    return days;
  }, [allActivities]);

  const isEmpty = languages.length === 0 || sessions === 0;

  return (
    <main className="container py-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('overall.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t('overall.desc')}</p>
      </div>

      {isEmpty ? (
        <Card className="p-12 text-center text-muted-foreground">{t('overall.empty')}</Card>
      ) : (
        <>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Stat icon={<Clock className="h-4 w-4" />} label={t('overall.totalHours')} value={totalHours.toFixed(1)} />
            <Stat icon={<ListChecks className="h-4 w-4" />} label={t('overall.totalSessions')}
                  value={String(sessions)} />
            <Stat icon={<LangIcon className="h-4 w-4" />} label={t('overall.activeLangs')}
                  value={String(activeLangs)} />
            <Stat icon={<Flame className="h-4 w-4 text-accent" />} label={t('overall.bestStreak')}
                  value={`${bestStreak} ${t('common.days')}`} />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">{t('overall.byType')}</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}
                         paddingAngle={2}>
                      {pieData.map((d, i) => (
                        <Cell key={i} fill={TYPE_COLORS[d.type as ActivityType]} stroke="hsl(var(--background))"
                              strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                      }}
                      formatter={(v: any) => [`${v} ${t('common.min')}`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {pieData.map((d) => (
                  <div key={d.type} className="flex items-center gap-1.5 text-xs">
                    <span className="h-2 w-2 rounded-full"
                          style={{ background: TYPE_COLORS[d.type as ActivityType] }} />
                    {d.name}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">{t('overall.byLang')}</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={langData} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))"
                           width={110} />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                      }}
                      formatter={(v: any) => [`${v} ${t('common.hours')}`, '']}
                    />
                    <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">{t('overall.daily')}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" interval={4} />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                  }} />
                  <Line type="monotone" dataKey="minutes" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card border border-border/60 p-4">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
        {icon}<span>{label}</span>
      </div>
      <div className="font-bold text-xl">{value}</div>
    </div>
  );
}