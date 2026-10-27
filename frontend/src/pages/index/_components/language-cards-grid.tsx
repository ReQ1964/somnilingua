import LanguageCard from '@/pages/index/_components/language-card.tsx';
import { LanguageEnrollmentResponse } from '@/api';

type LanguageCardsGridProps = {
  enrollments: LanguageEnrollmentResponse[];
};

export default function LanguageCardsGrid({ enrollments }: LanguageCardsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {enrollments.map((enrollment, index) => (
        <LanguageCard
          key={enrollment.id}
          enrollment={enrollment}
          index={index}
        />
      ))}
    </div>
  );
}
