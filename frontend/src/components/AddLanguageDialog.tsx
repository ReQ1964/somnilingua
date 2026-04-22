import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LANGUAGE_OPTIONS } from "@/lib/languages-data";
import { LEVELS } from "@/lib/cefr";
import { useLanguages } from "@/lib/store";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

export default function AddLanguageDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { t } = useTranslation();
  const { add } = useLanguages();
  const [step, setStep] = useState(0);
  const [pickedCode, setPickedCode] = useState<string | null>(null);
  const [pickedLevel, setPickedLevel] = useState<string | null>(null);
  const [manualHours, setManualHours] = useState<string>("");
  const [goal, setGoal] = useState<number>(30);
  const [tab, setTab] = useState("level");
  const [comboOpen, setComboOpen] = useState(false);

  const picked = LANGUAGE_OPTIONS.find((l) => l.code === pickedCode);

  const reset = () => {
    setStep(0);
    setPickedCode(null);
    setPickedLevel(null);
    setManualHours("");
    setGoal(30);
    setTab("level");
  };

  const finish = () => {
    const opt = LANGUAGE_OPTIONS.find((l) => l.code === pickedCode)!;
    let hrs = 0;
    if (tab === "manual") hrs = Number(manualHours) || 0;
    else if (pickedLevel) hrs = LEVELS.find((l) => l.level === pickedLevel)!.hours;
    add({ name: opt.name, flag: opt.flag, startingHours: hrs, dailyGoalMin: goal });
    reset();
    onOpenChange(false);
  };

  const canNext = step === 0 ? !!pickedCode : step === 1 ? (tab === "level" ? !!pickedLevel : Number(manualHours) >= 0) : true;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("addLang.title")}</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i <= step ? "bg-gradient-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <p className="text-sm text-muted-foreground mb-3">{t("addLang.pickLang")}</p>
              <Popover open={comboOpen} onOpenChange={setComboOpen}>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "w-full rounded-xl border-2 px-4 py-3 flex items-center justify-between transition-colors",
                      picked ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"
                    )}
                  >
                    {picked ? (
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <span className="text-xl">{picked.flag}</span>
                        {picked.name}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">{t("addLang.pickLangPh")}</span>
                    )}
                    <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command>
                    <CommandInput placeholder={t("addLang.pickLangPh")} />
                    <CommandList>
                      <CommandEmpty>—</CommandEmpty>
                      <CommandGroup>
                        {LANGUAGE_OPTIONS.map((l) => (
                          <CommandItem
                            key={l.code}
                            value={`${l.name} ${l.code}`}
                            onSelect={() => { setPickedCode(l.code); setComboOpen(false); }}
                          >
                            <span className="text-lg mr-2">{l.flag}</span>
                            <span className="flex-1">{l.name}</span>
                            {pickedCode === l.code && <Check className="h-4 w-4 text-primary" />}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="level">{t("addLang.pickLevel")}</TabsTrigger>
                  <TabsTrigger value="manual">{t("addLang.orManual")}</TabsTrigger>
                </TabsList>
                <TabsContent value="level" className="space-y-2 mt-4">
                  {LEVELS.map((l) => (
                    <button
                      key={l.level}
                      onClick={() => setPickedLevel(l.level)}
                      className={cn(
                        "w-full rounded-xl border-2 p-3 text-left transition-all flex items-center justify-between",
                        pickedLevel === l.level ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"
                      )}
                    >
                      <div>
                        <div className="font-semibold">{l.level}</div>
                        <div className="text-xs text-muted-foreground">{t(l.descKey)}</div>
                      </div>
                      <div className="text-sm tabular-nums text-muted-foreground">{l.hours}h</div>
                    </button>
                  ))}
                </TabsContent>
                <TabsContent value="manual" className="space-y-2 mt-4">
                  <Label>{t("addLang.manualHours")}</Label>
                  <Input
                    type="number"
                    min={0}
                    value={manualHours}
                    onChange={(e) => setManualHours(e.target.value)}
                    placeholder="0"
                  />
                </TabsContent>
              </Tabs>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <p className="text-sm text-muted-foreground mb-2">{t("addLang.goalQ")}</p>
              <p className="text-xs text-muted-foreground mb-6">{t("addLang.goalDesc")}</p>
              <div className="rounded-2xl bg-gradient-hero p-6 text-center mb-6">
                <div className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">{goal}</div>
                <div className="text-sm text-muted-foreground mt-1">{t("common.min")}/{t("common.today").toLowerCase()}</div>
              </div>
              <Slider value={[goal]} min={5} max={180} step={5} onValueChange={(v) => setGoal(v[0])} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between gap-2 mt-6">
          <Button variant="ghost" onClick={() => (step === 0 ? onOpenChange(false) : setStep(step - 1))}>
            {step === 0 ? t("common.cancel") : t("common.back")}
          </Button>
          {step < 2 ? (
            <Button disabled={!canNext} onClick={() => setStep(step + 1)} className="bg-gradient-primary">
              {t("common.next")}
            </Button>
          ) : (
            <Button onClick={finish} className="bg-gradient-primary">
              <Check className="h-4 w-4 mr-2" />
              {t("addLang.create")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}