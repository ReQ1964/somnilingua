import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LanguageCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-1.5 w-full" />
        <Skeleton className="h-1.5 w-full" />
      </div>
    </Card>
  );
}