import AddLanguageDialog
  from '@/pages/index/_components/add-language-dialog/add-language-dialog.tsx';
import DashboardHeader from '@/pages/index/_components/dashboard-header.tsx';
import LanguageCardsEmptyState from '@/pages/index/_components/language-cards-empty-state.tsx';
import LanguageCardsGrid from '@/pages/index/_components/language-cards-grid.tsx';
import LanguageCardsLoading from '@/pages/index/_components/language-cards-loading.tsx';
import { EnrollmentControllerApi } from '@/api/api.ts';
import Paginator from '@/shared/components/paginator.tsx';
import { useApiClient } from '@/shared/hooks/use-api-client.ts';
import { usePageState } from '@/shared/hooks/use-page-state.ts';
import { usePaginator } from '@/shared/hooks/use-paginator.ts';
import { useQueryParams } from '@/shared/hooks/use-query-params.ts';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ENROLLMENTS_LIST, USER_LANGUAGES_LIST } from '@/shared/constants/queryKeys.ts';


export default function DashboardContent() {
  const [open, setOpen] = useState(false);
  const enrollmentApi = useApiClient(EnrollmentControllerApi);
  const pagination = usePageState();
  const queryParams = useQueryParams({
    pagination,
  });

  const { data: userEnrolledLanguageIds } = useQuery({
    queryKey: [USER_LANGUAGES_LIST],
    queryFn: () =>
      enrollmentApi.getLanguageEnrollmentsByUser(),
    select: (response) => response.data.map(item => item.id),
  });

  const { data: enrollmentsPage, isLoading } = useQuery({
    queryKey: [ENROLLMENTS_LIST, queryParams],
    queryFn: () =>
      enrollmentApi.getPaginatedLanguageEnrollments(queryParams),
    select: (response) => response.data,
  });
  const { data: enrollments = [], meta } = enrollmentsPage ?? {};
  const { totalElements = 0, totalPages = 0 } = meta ?? {};

  const paginator = usePaginator({
    totalPages,
    pagination,
  });

  const openAddLanguageDialog = () => setOpen(true);

  return (
    <main className="container py-10">
      <DashboardHeader
        showAddLanguageButton={totalElements > 0}
        onAddLanguage={openAddLanguageDialog}
      />
      <Paginator {...paginator} />

      {isLoading ? (
        <LanguageCardsLoading />
      ) : totalElements === 0 ? (
        <LanguageCardsEmptyState onAddLanguage={openAddLanguageDialog} />
      ) : (
        <LanguageCardsGrid enrollments={enrollments} />
      )}

      <AddLanguageDialog open={open} onOpenChange={setOpen}
                         userEnrolledLanguagesIds={userEnrolledLanguageIds} />
    </main>
  );
}
