package req1964.somnilingua.language.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import req1964.somnilingua.language.domain.Language;

@Repository
public interface LanguageRepository extends JpaRepository<Language, Long> {
}
