import { Button } from '@/shared/components/ui/button.tsx';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type DashboardHeaderProps = {
  showAddLanguageButton: boolean;
  onAddLanguage: () => void;
};

export default function DashboardHeader({
  showAddLanguageButton,
  onAddLanguage,
}: DashboardHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold tracking-tight"
        >
          {t('dashboard.title')}
        </motion.h1>
        <p className="text-muted-foreground mt-1">{t('app.tagline')}</p>
      </div>
      {showAddLanguageButton && (
        <Button onClick={onAddLanguage} className="bg-gradient-primary shadow-soft">
          <Plus className="h-4 w-4 mr-2" />
          {t('dashboard.addLanguage')}
        </Button>
      )}
    </div>
  );
}
