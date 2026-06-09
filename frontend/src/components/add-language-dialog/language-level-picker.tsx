import { cn } from '@/lib/utils.ts';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import { CefrResponse } from '@/api';
import LanguageLevelPickerSkeleton from '@/components/add-language-dialog/skeletons/language-level-picker-skeleton.tsx';
import ErrorState from '@/components/error-state.tsx';

export const TAB = {
  LEVEL: 'LEVEL',
  MANUAL: 'MANUAL',
} as const;

interface LanguageLevelPickerProps {
  tab: keyof typeof TAB;
  setTab: (tab: keyof typeof TAB) => void;
  levels?: CefrResponse[];
  levelsIsLoading: boolean;
  levelsIsError: boolean;
  onRetry: () => void;
}

const LanguageLevelPicker = ({
  tab,
  setTab,
  levels,
  levelsIsLoading,
  levelsIsError,
  onRetry,
}: LanguageLevelPickerProps) => {
  const { setValue, control } = useFormContext();
  const { t } = useTranslation();
  const levelList = levels ?? [];

  const starterLevel = useWatch({
    control,
    name: 'starterLevel',
  });

  return (
    <motion.div
      key="s2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {levelsIsError ? (
        <ErrorState
          title={t('addLang.errors.loadLevels.title')}
          message={t('addLang.errors.loadLevels.message')}
          retryLabel={t('addLang.errors.retry')}
          onRetry={onRetry}
        />
      ) : levelsIsLoading ? (
        <LanguageLevelPickerSkeleton />
      ) : (
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value={TAB.LEVEL}>
              {t('addLang.pickLevel')}
            </TabsTrigger>
            <TabsTrigger value={TAB.MANUAL}>
              {t('addLang.orManual')}
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value={TAB.LEVEL}
            className="space-y-3 mt-4 max-h-[50vh] overflow-y-auto pr-3 py-2"
          >
            {levelList.map((l) => (
              <button
                key={l.level}
                type="button"
                onClick={() => setValue('starterLevel', l.level)}
                className={cn(
                  'w-full rounded-xl border-2 p-3 text-left transition-all flex items-center justify-between',
                  starterLevel === l.level
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-secondary',
                )}
              >
                <div>
                  <div className="font-semibold">{l.level}</div>
                  <div className="text-xs text-muted-foreground">
                    {t(l.descriptionKey)}
                  </div>
                </div>
                <div className="text-sm tabular-nums text-muted-foreground">
                  {l.hours}h
                </div>
              </button>
            ))}
          </TabsContent>
          <TabsContent value={TAB.MANUAL} className="space-y-2 mt-4">
            <Label>{t('addLang.manualHours')}</Label>

            <Controller
              name="manualHours"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  min={0}
                  aria-label="Set manual hours spent on the selected language."
                  placeholder="0"
                  onChange={(e) =>
                    field.onChange(Number(e.target.value))
                  }
                />
              )}
            />
          </TabsContent>
        </Tabs>
      )}
    </motion.div>
  );
};

export default LanguageLevelPicker;
