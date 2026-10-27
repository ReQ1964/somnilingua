import { Button } from '@/shared/components/ui/button.tsx';
import { motion } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type LanguageCardsEmptyStateProps = {
  onAddLanguage: () => void;
};

export default function LanguageCardsEmptyState({ onAddLanguage }: LanguageCardsEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-3xl bg-gradient-hero border border-border/60 p-12 text-center"
    >
      <div
        className="mx-auto w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow mb-4">
        <Sparkles className="h-8 w-8 text-primary-foreground" />
      </div>
      <h2 className="text-xl font-semibold mb-2">{t('dashboard.empty')}</h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">{t('dashboard.emptyDesc')}</p>
      <Button size="lg" onClick={onAddLanguage} className="bg-gradient-primary shadow-elegant">
        <Plus className="h-5 w-5 mr-2" />
        {t('dashboard.addFirst')}
      </Button>
    </motion.div>
  );
}
