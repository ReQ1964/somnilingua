import { motion } from 'framer-motion';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Slider } from '@/components/ui/slider';
import { useTranslation } from 'react-i18next';

const DailyGoalInput = () => {
  const { control } = useFormContext();
  const { t } = useTranslation();

  const goal = useWatch({
    control,
    name: 'dailyGoalMinutes',
  });

  return (
    <motion.div
      key="s3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <p className="text-sm text-muted-foreground mb-2">{t('addLang.goalQ')}</p>
      <p className="text-xs text-muted-foreground mb-6">{t('addLang.goalDesc')}</p>

      <div className="rounded-2xl bg-gradient-hero p-6 text-center mb-6">
        <div className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {goal}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {t('common.min')}/{t('common.today').toLowerCase()}
        </div>
      </div>

      <Controller
        name="dailyGoalMinutes"
        control={control}
        render={({ field }) => (
          <Slider
            value={[field.value ?? 30]}
            min={5}
            max={180}
            step={5}
            onValueChange={(v) => field.onChange(v[0])}
          />
        )}
      />
    </motion.div>
  );
};

export default DailyGoalInput;