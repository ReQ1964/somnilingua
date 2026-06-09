package req1964.somnilingua.cefr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import req1964.somnilingua.cefr.domain.CefrLevel;

@Repository
public interface CefrRepository extends JpaRepository<CefrLevel, Long> {
}
