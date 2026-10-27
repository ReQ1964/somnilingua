import LanguageCardSkeleton from '@/pages/index/_components/language-card-skeleton.tsx';

export default function LanguageCardsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[0, 1, 2].map((index) => (
        <LanguageCardSkeleton key={index} />
      ))}
    </div>
  );
}
