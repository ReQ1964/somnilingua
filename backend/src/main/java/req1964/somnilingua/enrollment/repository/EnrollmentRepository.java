package req1964.somnilingua.enrollment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import req1964.somnilingua.enrollment.domain.UserLanguage;
import req1964.somnilingua.enrollment.dto.ActivityStats;
import req1964.somnilingua.language.domain.Language;
import req1964.somnilingua.user.domain.User;

@Repository
public interface EnrollmentRepository extends JpaRepository<UserLanguage, Long> {
  boolean existsByUserAndLanguage(User user, Language language);

  @Query("""
      SELECT new req1964.somnilingua.enrollment.dto.ActivityStats(
          COALESCE(SUM(CASE
              WHEN CAST(a.createdAt AS date) = CURRENT_DATE
              THEN a.minutes ELSE 0
          END), 0L),
          COALESCE(SUM(a.minutes), 0L)
      )
          FROM Activity a
          WHERE a.userLanguage.user = :user
      """)
  ActivityStats getActivityStatsByUserLanguage(User user);
}
