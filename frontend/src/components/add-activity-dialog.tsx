import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { Activity, ActivityType, useActivities, todayKey } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Eye, Headphones, BookOpen, MessageCircle, PenTool, GraduationCap, Sparkles } from "lucide-react";
import { toast } from "sonner";

const TYPES: { key: ActivityType; icon: React.ComponentType<any> }[] = [
  { key: "watching", icon: Eye },
  { key: "listening", icon: Headphones },
  { key: "reading", icon: BookOpen },
  { key: "speaking", icon: MessageCircle },
  { key: "writing", icon: PenTool },
  { key: "studying", icon: GraduationCap },
  { key: "other", icon: Sparkles },
];

export default function AddActivityDialog({
  open,
  onOpenChange,
  languageId,
  edit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  languageId: string;
  edit?: Activity | null;
}) {
  const { t } = useTranslation();
  const { add, update } = useActivities();
  const [type, setType] = useState<ActivityType>("watching");
  const [minutes, setMinutes] = useState<string>("30");
  const [date, setDate] = useState<string>(todayKey());
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (edit) {
      setType(edit.type);
      setMinutes(String(edit.minutes));
      setDate(edit.date);
      setNotes(edit.notes ?? "");
    } else if (open) {
      setType("watching");
      setMinutes("30");
      setDate(todayKey());
      setNotes("");
    }
  }, [edit, open]);

  const save = () => {
    const m = Number(minutes);
    if (!m || m <= 0) return;
    if (edit) {
      update(edit.id, { type, minutes: m, date, notes });
    } else {
      add({ languageId, type, minutes: m, date, notes });
    }
    toast.success(t("activity.saved"));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("activity.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div>
            <Label className="mb-2 block">{t("common.type")}</Label>
            <div className="grid grid-cols-4 gap-2">
              {TYPES.map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setType(key)}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-xl border-2 p-2.5 transition-all",
                    type === key ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"
                  )}
                >
                  <Icon className="h-4 w-4 mb-1" />
                  <span className="text-[10px] font-medium">{t(`activity.types.${key}`)}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{t("activity.durationMin")}</Label>
              <Input type="number" min={1} value={minutes} onChange={(e) => setMinutes(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t("common.date")}</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>{t("common.notes")}</Label>
            <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("activity.notesPh")} />
          </div>
          <Button onClick={save} className="w-full bg-gradient-primary">
            {t("common.save")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}