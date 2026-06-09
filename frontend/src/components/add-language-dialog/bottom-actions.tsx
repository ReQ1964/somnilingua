import { Button } from '@/components/ui/button.tsx';
import { Check, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BottomActionsProps {
  step: number;
  setStep: (step: number) => void;
  onCancel: () => void;
  canNext: boolean;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const BottomActions = ({
  step,
  setStep,
  canNext,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: BottomActionsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between gap-2 mt-6">
      <Button
        variant="ghost"
        onClick={() =>
          step === 0 ? onCancel() : setStep(step - 1)
        }
        type="button"
        disabled={isSubmitting}
      >
        {step === 0 ? t('common.cancel') : t('common.back')}
      </Button>

      {step < 2 ? (
        <Button
          disabled={!canNext}
          onClick={() => setStep(step + 1)}
          className="bg-gradient-primary"
          type="button"
        >
          {t('common.next')}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-gradient-primary"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Check className="h-4 w-4 mr-2" />
          )}
          {t('addLang.create')}
        </Button>
      )}
    </div>
  );
};

export default BottomActions;
