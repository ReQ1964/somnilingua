package req1964.somnilingua.activity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import req1964.somnilingua.activity.domain.Activity;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
}
