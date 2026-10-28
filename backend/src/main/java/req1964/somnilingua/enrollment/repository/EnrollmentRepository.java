package req1964.somnilingua.enrollment.repository;

import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import req1964.somnilingua.enrollment.domain.LanguageEnrollment;
import req1964.somnilingua.enrollment.dto.LanguageEnrollmentActivityStats;
import req1964.somnilingua.language.domain.Language;
import req1964.somnilingua.user.domain.User;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<LanguageEnrollment, Long> {

  boolean existsByUserAndLanguage(User user, Language language);

  Page<LanguageEnrollment> findPaginatedByUser(User user, Pageable pageable);

  List<LanguageEnrollment> findAllByUser(User user);

  @Query("""
      SELECT new req1964.somnilingua.enrollment.dto.LanguageEnrollmentActivityStats(
          a.languageEnrollment.id,
          COALESCE(SUM(CASE
              WHEN CAST(a.createdAt AS date) = :today
              THEN a.minutes ELSE 0
          END), 0L),
          COALESCE(SUM(a.minutes), 0L)
      )
          FROM Activity a
          WHERE a.languageEnrollment.id IN (:ids)
          GROUP BY a.languageEnrollment.id
      """)
  List<LanguageEnrollmentActivityStats> findActivityStatsByLanguageEnrollmentIds(List<Long> ids,
      LocalDate today);
}
