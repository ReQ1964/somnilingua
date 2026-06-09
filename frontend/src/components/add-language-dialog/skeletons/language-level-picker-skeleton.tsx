import { Skeleton } from '@/components/ui/skeleton';

export default function LanguageLevelPickerSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-10 rounded-md" />
        <Skeleton className="h-10 rounded-md" />
      </div>

      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-full rounded-xl border p-3 flex items-center justify-between"
          >
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-3 w-40" />
            </div>

            <Skeleton className="h-4 w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}