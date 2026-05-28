package req1964.somnilingua.enrollment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import req1964.somnilingua.enrollment.domain.UserLanguage;

@Repository
public interface EnrollmentRepository extends JpaRepository<UserLanguage, Long> {
}
