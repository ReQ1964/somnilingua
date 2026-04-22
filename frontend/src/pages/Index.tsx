import { useLanguages, useActivities, calcStreak } from "@/lib/store";
import LanguageCard from "@/components/LanguageCard";
import LanguageCardSkeleton from "@/components/LanguageCardSkeleton";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import AddLanguageDialog from "@/components/AddLanguageDialog";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const Index = () => {
  const { t } = useTranslation();
  const { languages, loading } = useLanguages();
  const { allActivities } = useActivities();
  const [open, setOpen] = useState(false);

  return (
    <main className="container py-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            {t("dashboard.title")}
          </motion.h1>
          <p className="text-muted-foreground mt-1">{t("app.tagline")}</p>
        </div>
        {languages.length > 0 && (
          <Button onClick={() => setOpen(true)} className="bg-gradient-primary shadow-soft">
            <Plus className="h-4 w-4 mr-2" />
            {t("dashboard.addLanguage")}
          </Button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <LanguageCardSkeleton key={i} />
          ))}
        </div>
      ) : languages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl bg-gradient-hero border border-border/60 p-12 text-center"
        >
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow mb-4">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{t("dashboard.empty")}</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">{t("dashboard.emptyDesc")}</p>
          <Button size="lg" onClick={() => setOpen(true)} className="bg-gradient-primary shadow-elegant">
            <Plus className="h-5 w-5 mr-2" />
            {t("dashboard.addFirst")}
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {languages.map((l, i) => (
            <LanguageCard
              key={l.id}
              language={l}
              activities={allActivities}
              streak={calcStreak(allActivities, l.dailyGoalMin, l.id)}
              index={i}
            />
          ))}
        </div>
      )}

      <AddLanguageDialog open={open} onOpenChange={setOpen} />
    </main>
  );
};

export default Index;