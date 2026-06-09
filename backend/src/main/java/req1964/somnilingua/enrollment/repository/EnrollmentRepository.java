package req1964.somnilingua.enrollment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import req1964.somnilingua.enrollment.domain.UserLanguage;
import req1964.somnilingua.language.domain.Language;
import req1964.somnilingua.user.domain.User;

@Repository
public interface EnrollmentRepository extends JpaRepository<UserLanguage, Long> {
  boolean existsByUserAndLanguage(User user, Language language);
}
