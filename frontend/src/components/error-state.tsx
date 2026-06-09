import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

const ErrorState = ({
  title = 'Something went wrong',
  message = 'Failed to load data. Please try again.',
  onRetry,
  retryLabel = 'Retry',
  className,
}: ErrorStateProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm',
        className,
      )}
    >
      <div className="font-semibold text-destructive">{title}</div>

      <div className="text-muted-foreground">{message}</div>

      {onRetry && (
        <Button
          type="button"
          variant="link"
          onClick={onRetry}
          className="h-auto p-0 text-destructive"
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
