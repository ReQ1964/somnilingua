import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, ActivityType, useActivities, useLanguages } from "@/lib/store";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { toast } from "sonner";
import AddActivityDialog from "@/components/AddActivityDialog";

const TYPE_COLORS: Record<ActivityType, string> = {
  watching: "hsl(182 56% 42%)",
  listening: "hsl(174 62% 55%)",
  reading: "hsl(32 95% 58%)",
  speaking: "hsl(14 90% 60%)",
  writing: "hsl(280 60% 60%)",
  studying: "hsl(220 70% 60%)",
  other: "hsl(200 12% 55%)",
};

const TYPE_KEYS: ActivityType[] = ["watching", "listening", "reading", "speaking", "writing", "studying", "other"];

export default function History() {
  const { t } = useTranslation();
  const { languages } = useLanguages();
  const { allActivities, remove } = useActivities();
  const [langFilter, setLangFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Activity | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(
    () =>
      allActivities
        .filter((a) => (langFilter === "all" ? true : a.languageId === langFilter))
        .filter((a) => (typeFilter === "all" ? true : a.type === typeFilter))
        .sort((a, b) => (a.date < b.date ? 1 : -1) || b.createdAt - a.createdAt),
    [allActivities, langFilter, typeFilter]
  );

  const langById = (id: string) => languages.find((l) => l.id === id);

  return (
    <main className="container py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t("history.title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("history.desc")}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Select value={langFilter} onValueChange={setLangFilter}>
          <SelectTrigger className="sm:w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("history.filterAll")}</SelectItem>
            {languages.map((l) => (
              <SelectItem key={l.id} value={l.id}>{l.flag} {l.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="sm:w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("history.filterType")}</SelectItem>
            {TYPE_KEYS.map((k) => (
              <SelectItem key={k} value={k}>{t(`activity.types.${k}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="divide-y divide-border">
        {filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">{t("history.empty")}</p>
        )}
        {filtered.map((a) => {
          const lang = langById(a.languageId);
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between p-4 gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-xs font-semibold shrink-0 tabular-nums"
                  style={{ backgroundColor: TYPE_COLORS[a.type] + "33", color: TYPE_COLORS[a.type] }}
                >
                  {a.minutes}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm flex items-center gap-1.5">
                    {lang && <span className="text-base leading-none">{lang.flag}</span>}
                    <span>{t(`activity.types.${a.type}`)}</span>
                    {lang && <span className="text-muted-foreground text-xs">· {lang.name}</span>}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {format(new Date(a.date), "MMM d, yyyy")}
                    {a.notes ? ` • ${a.notes}` : ""}
                  </div>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => { setEditing(a); setOpen(true); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => { remove(a.id); toast.success(t("activity.deleted")); }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </Card>

      {editing && (
        <AddActivityDialog
          open={open}
          onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
          languageId={editing.languageId}
          edit={editing}
        />
      )}
    </main>
  );
}