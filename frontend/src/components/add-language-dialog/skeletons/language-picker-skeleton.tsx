import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

const LanguagePickerSkeleton = () => {
  return (
    <div className="p-2 space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 px-2 py-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-[140px]" />
        </div>
      ))}
    </div>
  );
};

export default LanguagePickerSkeleton;