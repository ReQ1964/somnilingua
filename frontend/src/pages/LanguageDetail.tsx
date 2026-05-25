import { useNavigate, useParams } from "react-router-dom";
import { useLanguages, useActivities, totalHours, calcStreak, todayKey, minutesOnDate, ActivityType, Activity } from "@/lib/store";
import { LEVELS, levelFromHours, progressToNext } from "@/lib/cefr";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import AddActivityDialog from "@/components/AddActivityDialog";
import StreakCalendar from "@/components/StreakCalendar";
import { ArrowLeft, Plus, Flame, Clock, Target, Trash2, Pencil, MoreVertical, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { format, subDays } from "date-fns";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TYPE_COLORS: Record<ActivityType, string> = {
  watching: "hsl(182 56% 42%)",
  listening: "hsl(174 62% 55%)",
  reading: "hsl(32 95% 58%)",
  speaking: "hsl(14 90% 60%)",
  writing: "hsl(280 60% 60%)",
  studying: "hsl(220 70% 60%)",
  other: "hsl(200 12% 55%)",
};

export default function LanguageDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { t } = useTranslation();
  const { languages, remove: removeLang } = useLanguages();
  const { activities, allActivities, remove } = useActivities(id);
  const lang = languages.find((l) => l.id === id);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Activity | null>(null);

  const sorted = useMemo(
    () => [...activities].sort((a, b) => (a.date < b.date ? 1 : -1) || b.createdAt - a.createdAt),
    [activities]
  );

  const pieData = useMemo(() => {
    const map: Record<string, number> = {};
    activities.forEach((a) => (map[a.type] = (map[a.type] || 0) + a.minutes));
    return Object.entries(map).map(([type, value]) => ({ name: t(`activity.types.${type}`), type, value }));
  }, [activities, t]);

  const lineData = useMemo(() => {
    const days: { date: string; label: string; minutes: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const k = format(d, "yyyy-MM-dd");
      days.push({ date: k, label: format(d, "MMM d"), minutes: minutesOnDate(allActivities, k, id || "") });
    }
    return days;
  }, [allActivities, id]);

  if (!lang) {
    return (
      <main className="container py-10">
        <p className="text-muted-foreground">Language not found.</p>
        <Button variant="link" onClick={() => nav("/")}>
          ← Back
        </Button>
      </main>
    );
  }

  const total = totalHours(lang, allActivities);
  const { current, next, pct } = progressToNext(total);
  const streak = calcStreak(allActivities, lang.dailyGoalMin, lang.id);
  const todayMin = minutesOnDate(allActivities, todayKey(), lang.id);
  const remainMin = Math.max(0, lang.dailyGoalMin - todayMin);

  const daysToNext = next
    ? Math.ceil(((next.hours - total) * 60) / Math.max(1, lang.dailyGoalMin))
    : 0;

  const openEdit = (a: Activity) => {
    setEditing(a);
    setAddOpen(true);
  };
  const onClose = (v: boolean) => {
    setAddOpen(v);
    if (!v) setEditing(null);
  };

  return (
    <main className="container py-8 max-w-5xl">
      <Button variant="ghost" size="sm" onClick={() => nav("/")} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t("nav.dashboard")}
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-hero border border-border/60 p-6 md:p-8 mb-6"
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="text-5xl md:text-6xl">{lang.flag}</div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{lang.name}</h1>
              <p className="text-muted-foreground text-sm">
                {total.toFixed(1)} {t("common.hours")} • {current.level}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setAddOpen(true)} className="bg-gradient-primary shadow-soft">
              <Plus className="h-4 w-4 mr-2" />
              {t("detail.addActivity")}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => {
                    removeLang(lang.id);
                    nav("/");
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> {t("common.delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <Stat icon={<Clock className="h-4 w-4" />} label={t("detail.totalTime")} value={`${total.toFixed(1)}h`} />
          <Stat icon={<Target className="h-4 w-4" />} label={t("common.today")} value={`${todayMin}/${lang.dailyGoalMin} ${t("common.min")}`} />
          <Stat
            icon={remainMin === 0 ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Target className="h-4 w-4" />}
            label={t("detail.untilGoal")}
            value={remainMin === 0 ? t("detail.goalReached") : `${remainMin} ${t("common.min")}`}
          />
          <Stat icon={<Flame className="h-4 w-4 text-accent" />} label={t("common.streak")} value={`${streak} ${t("common.days")}`} />
        </div>
      </motion.div>

      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="overview">{t("detail.tabs.overview")}</TabsTrigger>
          <TabsTrigger value="history">{t("detail.tabs.history")}</TabsTrigger>
          <TabsTrigger value="stats">{t("detail.tabs.stats")}</TabsTrigger>
          <TabsTrigger value="roadmap">{t("detail.tabs.roadmap")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">
                  {current.level}
                  {next && <span className="text-muted-foreground"> → {next.level}</span>}
                </h3>
                <span className="text-sm text-muted-foreground tabular-nums">{Math.round(pct)}%</span>
              </div>
              <Progress value={pct} className="h-2 mb-3" />
              {next && (
                <p className="text-sm text-muted-foreground">
                  {(next.hours - total).toFixed(1)} {t("common.hours")} → {next.level}
                </p>
              )}
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">{t("common.streak")}</h3>
              <StreakCalendar activities={allActivities} goal={lang.dailyGoalMin} languageId={lang.id} />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="divide-y divide-border">
            {sorted.length === 0 && (
              <p className="p-8 text-center text-sm text-muted-foreground">{t("detail.noActivities")}</p>
            )}
            {sorted.map((a) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-xs font-semibold shrink-0"
                    style={{ backgroundColor: TYPE_COLORS[a.type] + "33", color: TYPE_COLORS[a.type] }}
                  >
                    {a.minutes}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm">{t(`activity.types.${a.type}`)}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(a.date), "MMM d, yyyy")}
                      {a.notes ? ` • ${a.notes}` : ""}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(a)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      remove(a.id);
                      toast.success(t("activity.deleted"));
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">{t("detail.timeByType")}</h3>
              {pieData.length === 0 ? (
                <p className="text-sm text-muted-foreground py-12 text-center">{t("detail.noActivities")}</p>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                        {pieData.map((d, i) => (
                          <Cell key={i} fill={TYPE_COLORS[d.type as ActivityType]} stroke="hsl(var(--background))" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px",
                        }}
                        formatter={(v: any) => [`${v} ${t("common.min")}`, ""]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {pieData.map((d) => (
                  <div key={d.type} className="flex items-center gap-1.5 text-xs">
                    <span className="h-2 w-2 rounded-full" style={{ background: TYPE_COLORS[d.type as ActivityType] }} />
                    {d.name}
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">{t("detail.dailyMinutes")}</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" interval={4} />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                      }}
                    />
                    <Line type="monotone" dataKey="minutes" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="roadmap" className="mt-6">
          <div className="space-y-3">
            {LEVELS.map((l) => {
              const reached = total >= l.hours;
              const isCurrent = levelFromHours(total) === l.level && !reached;
              const isCurrentReached = current.level === l.level && reached;
              const remaining = Math.max(0, l.hours - total);
              const days = lang.dailyGoalMin > 0 ? Math.ceil((remaining * 60) / lang.dailyGoalMin) : 0;
              return (
                <motion.div
                  key={l.level}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * LEVELS.indexOf(l) }}
                >
                  <Card
                    className={cn(
                      "p-5 flex items-center gap-4 border-2 transition-colors",
                      reached && "border-success/40 bg-success/5",
                      isCurrentReached && "border-primary",
                      !reached && !isCurrentReached && "border-border"
                    )}
                  >
                    <div
                      className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center font-bold shrink-0",
                        reached ? "bg-gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {l.level}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="text-sm">{t(l.descKey)}</p>
                        {reached ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {days} {t("common.days")} • {t("detail.atGoal")}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                        <span>{l.hours} {t("common.hours")}</span>
                        <span>•</span>
                        <span>~{l.words.toLocaleString()} {t("common.words")}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      <AddActivityDialog open={addOpen} onOpenChange={onClose} languageId={lang.id} edit={editing} />
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card/60 backdrop-blur border border-border/60 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <div className="font-semibold text-sm">{value}</div>
    </div>
  );
}