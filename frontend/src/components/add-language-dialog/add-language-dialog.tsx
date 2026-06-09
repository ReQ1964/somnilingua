import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils.ts';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/hooks/use-api-client.ts';
import { EnrollmentControllerApi, LanguageApi, CefrControllerApi } from '@/api';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import LanguagePicker from '@/components/add-language-dialog/language-picker.tsx';
import { toast } from 'sonner';
import LanguageLevelPicker, {
  TAB,
} from '@/components/add-language-dialog/language-level-picker.tsx';
import DailyGoalInput from '@/components/add-language-dialog/daily-goal-input.tsx';
import BottomActions from '@/components/add-language-dialog/bottom-actions.tsx';
import { getApiErrorMessage } from '@/utils/api-error.ts';

interface AddLanguageDialogValues {
  languageId: number | null;
  starterLevel: string | null;
  manualHours: number;
  dailyGoalMinutes: number | null;
}

export default function AddLanguageDialog({
                                            open,
                                            onOpenChange,
                                          }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState<keyof typeof TAB>(TAB.LEVEL);

  const languagesApi = useApiClient(LanguageApi);
  const enrollmentApi = useApiClient(EnrollmentControllerApi);
  const cefrApi = useApiClient(CefrControllerApi);

  const {
    data: languages,
    isLoading: languagesIsLoading,
    isError: languagesIsError,
    refetch: refetchLanguages,
  } = useQuery({
    queryFn: languagesApi.getLanguages,
    queryKey: ['languagesApi.getLanguages'],
    select: (data) => data.data,
    enabled: open,
  });

  const {
    data: levels,
    isLoading: levelsIsLoading,
    isError: levelsIsError,
    refetch: refetchLevels,
  } = useQuery({
    queryFn: cefrApi.getAllCefrs,
    queryKey: ['cefrApi.getAllCefrs'],
    select: (data) => data.data,
    enabled: open,
  });

  const form = useForm<AddLanguageDialogValues>({
    defaultValues: {
      languageId: null,
      starterLevel: null,
      manualHours: 0,
      dailyGoalMinutes: 30,
    },
  });

  const reset = () => {
    onOpenChange(false);
    setStep(0);
    setTab(TAB.LEVEL);
    form.reset({
      languageId: null,
      starterLevel: null,
      manualHours: 0,
      dailyGoalMinutes: 30,
    });
  };

  const mutation = useMutation({
    mutationFn: (data: AddLanguageDialogValues) => {
      const starterMinutes =
        tab === TAB.LEVEL
          ? levels?.find((l) => l.level === data.starterLevel)?.minutes ?? 0
          : data.manualHours * 60;

      return enrollmentApi.createEnrollment({
        createEnrollmentRequest: {
          languageId: data.languageId,
          dailyGoalMinutes: data.dailyGoalMinutes,
          starterMinutes,
        },
      });
    },
    mutationKey: ['enrollmentApi.createEnrollment'],
    onSuccess: () => {
      toast.success(t('addLang.success'));
      reset();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t));
      console.error(error);
    },
  });

  const languageId = useWatch({
    control: form.control,
    name: 'languageId',
  });

  const starterLevel = useWatch({
    control: form.control,
    name: 'starterLevel',
  });

  const manualHours = useWatch({
    control: form.control,
    name: 'manualHours',
  });

  const canNext =
    step === 0
      ? !!languageId && !languagesIsError
      : step === 1
        ? levelsIsError
          ? false
          : tab === TAB.LEVEL
            ? !!starterLevel
            : Number(manualHours) >= 0
        : true;

  const onSubmit = form.handleSubmit((data) => mutation.mutate(data));

  return (
    <FormProvider {...form}>
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v) reset();
          onOpenChange(v);
        }}
      >
        <DialogTrigger>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('addLang.title')}</DialogTitle>
          </DialogHeader>

          <div className="flex gap-2 mb-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors',
                  i <= step ? 'bg-gradient-primary' : 'bg-muted',
                )}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <LanguagePicker
                languages={languages}
                languagesIsLoading={languagesIsLoading}
                languagesIsError={languagesIsError}
                onRetry={refetchLanguages}
              />
            )}

            {step === 1 && (
              <LanguageLevelPicker
                tab={tab}
                setTab={setTab}
                levels={levels}
                levelsIsLoading={levelsIsLoading}
                levelsIsError={levelsIsError}
                onRetry={refetchLevels}
              />
            )}

            {step === 2 && <DailyGoalInput />}
          </AnimatePresence>

          <BottomActions
            step={step}
            onCancel={reset}
            setStep={setStep}
            canNext={canNext}
            onSubmit={onSubmit}
            isSubmitting={mutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}
