package req1964.somnilingua.enrollment.repository;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import req1964.somnilingua.activity.domain.Activity;
import req1964.somnilingua.config.FlywayConfig;
import req1964.somnilingua.config.JpaConfig;
import req1964.somnilingua.config.TestContainersConfig;
import req1964.somnilingua.enrollment.domain.LanguageEnrollment;
import req1964.somnilingua.enrollment.dto.LanguageEnrollmentActivityStats;
import req1964.somnilingua.language.domain.Language;
import req1964.somnilingua.language.repository.LanguageRepository;
import req1964.somnilingua.user.domain.User;
import req1964.somnilingua.user.repository.UserRepository;

@DataJpaTest
@Import({
    TestContainersConfig.class,
    FlywayConfig.class,
    JpaConfig.class
})
public class EnrollmentRepositoryTest {

  private LanguageEnrollment testEnrollment;

  @BeforeEach
  public void setUp() {
    testEnrollment = new LanguageEnrollment();

    Language language = new Language();
    language.setName("Test Language");
    language.setCode("xx");
    languageRepository.save(language);

    User user = new User();
    user.setEmail("test@example.com");
    userRepository.save(user);

    Activity activity =
        Activity.createStarterActivity(testEnrollment, 30);
    testEnrollment.setActivities(List.of(activity));

    testEnrollment.setLanguage(language);
    testEnrollment.setDailyGoalMinutes(10);
    testEnrollment.setUser(user);
    enrollmentRepository.saveAndFlush(testEnrollment);
  }

  @Autowired
  private EnrollmentRepository enrollmentRepository;
  @Autowired
  UserRepository userRepository;
  @Autowired
  LanguageRepository languageRepository;
  @Autowired
  NamedParameterJdbcTemplate jdbcTemplate;

  @Test
  void shouldReturnCorrectStats() {
    var result = enrollmentRepository
        .findActivityStatsByLanguageEnrollmentIds(
            List.of(testEnrollment.getId()),
            LocalDate.now()
        );

    assertThat(result).singleElement().satisfies(stats -> {
      assertThat(stats.todayMinutes()).isEqualTo(30L);
      assertThat(stats.totalMinutes()).isEqualTo(30L);
    });

  }

  @Test
  void shouldReturnZeroTodayMinutesWhenActivityIsOutsideDateRange() {
    jdbcTemplate.update("""
        UPDATE somnilingua.activity
        SET created_at = TIMESTAMP '2026-10-10 12:00:00'
        WHERE fk_language_enrollment_id = :language_enrollment_id
        """, Map.of("language_enrollment_id", testEnrollment.getId()));

    List<LanguageEnrollmentActivityStats> result = enrollmentRepository
        .findActivityStatsByLanguageEnrollmentIds(
            List.of(testEnrollment.getId()),
            LocalDate.of(2026, 10, 11)
        );

    assertThat(result).singleElement().satisfies(stats -> {
      assertThat(stats.todayMinutes()).isZero();
      assertThat(stats.totalMinutes()).isEqualTo(30L);
    });

  }
}
