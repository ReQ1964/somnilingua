package req1964.somnilingua.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import req1964.somnilingua.user.domain.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
