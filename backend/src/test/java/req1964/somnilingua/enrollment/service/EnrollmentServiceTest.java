package req1964.somnilingua.enrollment.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.assertArg;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import req1964.somnilingua.activity.domain.Activity;
import req1964.somnilingua.activity.dto.ActivityType;
import req1964.somnilingua.cefr.domain.CefrLevel;
import req1964.somnilingua.cefr.dto.CefrProgressResponse;
import req1964.somnilingua.cefr.repository.CefrRepository;
import req1964.somnilingua.cefr.service.CefrService;
import req1964.somnilingua.enrollment.domain.LanguageEnrollment;
import req1964.somnilingua.enrollment.dto.CreateEnrollmentRequest;
import req1964.somnilingua.enrollment.dto.LanguageEnrollmentActivityStats;
import req1964.somnilingua.enrollment.dto.LanguageEnrollmentResponse;
import req1964.somnilingua.enrollment.repository.EnrollmentRepository;
import req1964.somnilingua.language.domain.Language;
import req1964.somnilingua.language.repository.LanguageRepository;
import req1964.somnilingua.shared.dto.PageResponse;
import req1964.somnilingua.shared.exception.ConflictException;
import req1964.somnilingua.shared.exception.ResourceNotFoundException;
import req1964.somnilingua.user.domain.User;
import req1964.somnilingua.user.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class EnrollmentServiceTest {

  private static final long USER_ID = 1L;
  private static final long LANGUAGE_ID = 10L;
  private static final long ENROLLMENT_ID = 100L;
  private static final int STARTER_MINUTES = 30;
  private static final int DAILY_GOAL_MINUTES = 10;
  private static final Pageable PAGEABLE = PageRequest.of(0, 10);

  @Mock
  private EnrollmentRepository enrollmentRepository;

  @Mock
  private LanguageRepository languageRepository;

  @Mock
  private UserRepository userRepository;

  @Mock
  private CefrRepository cefrRepository;

  @Mock
  private CefrService cefrService;

  @InjectMocks
  private EnrollmentService enrollmentService;

  private User user;
  private Language language;

  @BeforeEach
  void setUp() {
    user = createUser();
    language = createLanguage();
  }

  @Test
  void shouldEnrollUserSuccessfullyWithCorrectData() {
    // given
    when(userRepository.findById(USER_ID))
        .thenReturn(Optional.of(user));

    when(languageRepository.findById(LANGUAGE_ID))
        .thenReturn(Optional.of(language));

    when(enrollmentRepository.existsByUserAndLanguage(user, language))
        .thenReturn(false);

    CreateEnrollmentRequest request = createValidRequest();
    // when
    enrollmentService.enroll(request);
    // then
    verify(enrollmentRepository).existsByUserAndLanguage(user, language);
    verify(enrollmentRepository).save(assertArg(enrollment -> {
      assertThat(enrollment.getUser()).isEqualTo(user);
      assertThat(enrollment.getLanguage()).isEqualTo(language);
      assertThat(enrollment.getDailyGoalMinutes()).isEqualTo(DAILY_GOAL_MINUTES);
      assertThat(enrollment.getActivities()).hasSize(1);
      Activity activity = enrollment.getActivities().getFirst();
      assertThat(activity.getType()).isEqualTo(ActivityType.OTHER);
    }));

  }

  @Test
  void shouldThrowWhenUserNotFound() {
    // given
    when(userRepository.findById(USER_ID))
        .thenReturn(Optional.empty());

    CreateEnrollmentRequest request = createValidRequest();
    // then
    assertThatThrownBy(() -> enrollmentService.enroll(request)).isInstanceOf(
        ResourceNotFoundException.class);

    verify(enrollmentRepository, never()).save(any());
    verifyNoInteractions(languageRepository);
  }

  @Test
  void shouldThrowWhenAlreadyEnrolled() {
    // given
    when(userRepository.findById(USER_ID))
        .thenReturn(Optional.of(user));

    when(languageRepository.findById(LANGUAGE_ID))
        .thenReturn(Optional.of(language));

    when(enrollmentRepository.existsByUserAndLanguage(user, language)).thenReturn(true);
    CreateEnrollmentRequest request = createValidRequest();
    // then
    assertThatThrownBy(() -> enrollmentService.enroll(request)).isInstanceOf(
        ConflictException.class);
    verify(enrollmentRepository, never()).save(any());

  }

  @Test
  void shouldThrowWhenLanguageNotFound() {
    // given
    when(userRepository.findById(USER_ID))
        .thenReturn(Optional.of(user));

    when(languageRepository.findById(LANGUAGE_ID))
        .thenReturn(Optional.empty());

    CreateEnrollmentRequest request = createValidRequest();
    // then
    assertThatThrownBy(() -> enrollmentService.enroll(request)).isInstanceOf(
        ResourceNotFoundException.class);

    verify(enrollmentRepository, never()).save(any());
    verify(enrollmentRepository, never())
        .existsByUserAndLanguage(any(), any());
  }

  @Test
  void shouldGenerateStarterActivityWithCorrectDataWhenEnrolled() {
    // given
    when(userRepository.findById(USER_ID))
        .thenReturn(Optional.of(user));

    when(languageRepository.findById(LANGUAGE_ID))
        .thenReturn(Optional.of(language));

    when(enrollmentRepository.existsByUserAndLanguage(user, language))
        .thenReturn(false);

    CreateEnrollmentRequest request = createValidRequest();
    // when
    enrollmentService.enroll(request);
    // then
    verify(enrollmentRepository).existsByUserAndLanguage(user, language);
    verify(enrollmentRepository).save(assertArg(languageEnrollment -> {
      assertThat(languageEnrollment.getUser()).isEqualTo(user);
      assertThat(languageEnrollment.getActivities().getFirst().getMinutes()).isEqualTo(
          STARTER_MINUTES);
    }));

  }

  @Test
  void shouldNotGenerateStarterActivityIfMinutes0() {
    // given
    when(userRepository.findById(USER_ID))
        .thenReturn(Optional.of(user));

    when(languageRepository.findById(LANGUAGE_ID))
        .thenReturn(Optional.of(language));

    when(enrollmentRepository.existsByUserAndLanguage(user, language))
        .thenReturn(false);

    CreateEnrollmentRequest request = new CreateEnrollmentRequest(LANGUAGE_ID, 0,
        DAILY_GOAL_MINUTES);
    // when
    enrollmentService.enroll(request);
    // then
    verify(enrollmentRepository).existsByUserAndLanguage(user, language);
    verify(enrollmentRepository).save(
        assertArg(languageEnrollment -> assertThat(languageEnrollment.getActivities()).isNull()
        ));
  }

  @Test
  void shouldGetPaginatedEnrollments() {
    //given
    LanguageEnrollment enrollment = createEnrollment();

    List<LanguageEnrollmentActivityStats> stats = List.of(
        new LanguageEnrollmentActivityStats(ENROLLMENT_ID, 10L, 100L));

    List<CefrLevel> levels = List.of();
    CefrProgressResponse progress = CefrProgressResponse.builder()
        .currentLevel("A0")
        .nextLevel("A1")
        .minutesUntilNextLevel(2900L)
        .progressPercent(3)
        .build();

    Page<LanguageEnrollment> page = new PageImpl<>(List.of(enrollment), PAGEABLE, 1);

    when(userRepository.findById(USER_ID))
        .thenReturn(Optional.of(user));
    when(enrollmentRepository.findAllByUser(user, PAGEABLE))
        .thenReturn(page);
    when(enrollmentRepository.findActivityStatsByLanguageEnrollmentIds(
        eq(List.of(ENROLLMENT_ID)), any(LocalDate.class)))
        .thenReturn(stats);
    when(cefrRepository.findAll())
        .thenReturn(levels);
    when(cefrService.calculateCefrLevel(100L, levels))
        .thenReturn(progress);

    //when
    PageResponse<LanguageEnrollmentResponse> result =
        enrollmentService.getPaginatedLanguageEnrollments(PAGEABLE);

    //then
    assertThat(result).isNotNull();
    assertThat(result.getData()).hasSize(1);
    LanguageEnrollmentResponse response = result.getData().getFirst();
    assertThat(response.getDailyGoalMinutes()).isEqualTo(DAILY_GOAL_MINUTES);
    assertThat(response.getId()).isEqualTo(ENROLLMENT_ID);
    assertThat(response.getLanguage().getCode()).isEqualTo("en");
    assertThat(response.getActivityStats().totalMinutes()).isEqualTo(100L);
    assertThat(response.getActivityStats().todayMinutes()).isEqualTo(10L);
    assertThat(response.getCefrProgress().getCurrentLevel()).isEqualTo("A0");
    assertThat(response.getCefrProgress().getNextLevel()).isEqualTo("A1");
    assertThat(response.getCefrProgress().getProgressPercent()).isEqualTo(3L);

    verify(enrollmentRepository).findAllByUser(user, PAGEABLE);
    verify(enrollmentRepository)
        .findActivityStatsByLanguageEnrollmentIds(
            eq(List.of(ENROLLMENT_ID)), any(LocalDate.class));
    verify(cefrService).calculateCefrLevel(100L, levels);

  }

  @Test
  void shouldReturnMultipleEnrollmentsWithCorrectStats() {
//given
    LanguageEnrollment enrollment = createEnrollment();
    LanguageEnrollment enrollment2 = createEnrollment(2L);

    List<LanguageEnrollmentActivityStats> stats = List.of(
        new LanguageEnrollmentActivityStats(ENROLLMENT_ID, 10L, 100L),
        new LanguageEnrollmentActivityStats(2L, 20L, 500L));

    List<CefrLevel> levels = List.of();
    CefrProgressResponse progress = CefrProgressResponse.builder()
        .currentLevel("A0")
        .nextLevel("A1")
        .minutesUntilNextLevel(2900L)
        .progressPercent(3)
        .build();
    CefrProgressResponse progress2 = CefrProgressResponse.builder()
        .currentLevel("A1")
        .nextLevel("A2")
        .minutesUntilNextLevel(4000L)
        .progressPercent(50)
        .build();

    Page<LanguageEnrollment> page = new PageImpl<>(List.of(enrollment, enrollment2), PAGEABLE, 1);

    when(userRepository.findById(USER_ID))
        .thenReturn(Optional.of(user));
    when(enrollmentRepository.findAllByUser(user, PAGEABLE))
        .thenReturn(page);
    when(enrollmentRepository.findActivityStatsByLanguageEnrollmentIds(
        eq(List.of(ENROLLMENT_ID, 2L)), any(LocalDate.class)))
        .thenReturn(stats);
    when(cefrRepository.findAll())
        .thenReturn(levels);
    when(cefrService.calculateCefrLevel(100L, levels))
        .thenReturn(progress);
    when(cefrService.calculateCefrLevel(500L, levels))
        .thenReturn(progress2);

    //when
    PageResponse<LanguageEnrollmentResponse> result =
        enrollmentService.getPaginatedLanguageEnrollments(PAGEABLE);

    //then
    assertThat(result).isNotNull();
    assertThat(result.getData()).hasSize(2);
    LanguageEnrollmentResponse response = result.getData().getFirst();
    assertThat(response.getDailyGoalMinutes()).isEqualTo(10);
    assertThat(response.getId()).isEqualTo(ENROLLMENT_ID);
    assertThat(response.getLanguage().getCode()).isEqualTo("en");
    assertThat(response.getActivityStats().totalMinutes()).isEqualTo(100L);
    assertThat(response.getActivityStats().todayMinutes()).isEqualTo(10L);
    assertThat(response.getCefrProgress().getCurrentLevel()).isEqualTo("A0");
    assertThat(response.getCefrProgress().getNextLevel()).isEqualTo("A1");
    assertThat(response.getCefrProgress().getProgressPercent()).isEqualTo(3L);

    LanguageEnrollmentResponse response2 = result.getData().get(1);
    assertThat(response2.getDailyGoalMinutes()).isEqualTo(10);
    assertThat(response2.getId()).isEqualTo(2L);
    assertThat(response2.getLanguage().getCode()).isEqualTo("en");
    assertThat(response2.getActivityStats().totalMinutes()).isEqualTo(500L);
    assertThat(response2.getActivityStats().todayMinutes()).isEqualTo(20L);
    assertThat(response2.getCefrProgress().getCurrentLevel()).isEqualTo("A1");
    assertThat(response2.getCefrProgress().getNextLevel()).isEqualTo("A2");
    assertThat(response2.getCefrProgress().getProgressPercent()).isEqualTo(50L);

    verify(enrollmentRepository).findAllByUser(user, PAGEABLE);
    verify(cefrService).calculateCefrLevel(100L, levels);
    verify(cefrService).calculateCefrLevel(500L, levels);
    verify(enrollmentRepository)
        .findActivityStatsByLanguageEnrollmentIds(
            eq(List.of(ENROLLMENT_ID, 2L)), any(LocalDate.class));
  }


  @Test
  void shouldFetchActivityStatsOnlyOnceForGetPaginatedEnrollments() {
    //given
    LanguageEnrollment enrollment = createEnrollment();
    LanguageEnrollment enrollment2 = createEnrollment(2L);

    List<LanguageEnrollmentActivityStats> stats = List.of(
        new LanguageEnrollmentActivityStats(ENROLLMENT_ID, 10L, 100L),
        new LanguageEnrollmentActivityStats(2L, 10L, 100L));

    Page<LanguageEnrollment> page = new PageImpl<>(List.of(enrollment, enrollment2), PAGEABLE, 1);

    when(userRepository.findById(USER_ID))
        .thenReturn(Optional.of(user));
    when(enrollmentRepository.findAllByUser(user, PAGEABLE))
        .thenReturn(page);
    when(enrollmentRepository.findActivityStatsByLanguageEnrollmentIds(
        eq(List.of(ENROLLMENT_ID, 2L)), any(LocalDate.class)))
        .thenReturn(stats);

    //when
    enrollmentService.getPaginatedLanguageEnrollments(PAGEABLE);

    //then
    verify(enrollmentRepository, times(1))
        .findActivityStatsByLanguageEnrollmentIds(
            eq(List.of(ENROLLMENT_ID, 2L)), any(LocalDate.class));
  }

  @Test
  void shouldReturnEmptyPageWhenUserHasNoEnrollments() {
    // given
    Page<LanguageEnrollment> page = Page.empty(PAGEABLE);

    when(userRepository.findById(USER_ID))
        .thenReturn(Optional.of(user));
    when(enrollmentRepository.findAllByUser(user, PAGEABLE))
        .thenReturn(page);

    //when
    PageResponse<LanguageEnrollmentResponse> result =
        enrollmentService.getPaginatedLanguageEnrollments(PAGEABLE);

    //then
    assertThat(result.getData()).isEmpty();
    assertThat(result.getMeta().getTotalElements()).isEqualTo(0);
    verify(enrollmentRepository, never())
        .findActivityStatsByLanguageEnrollmentIds(any(), any(LocalDate.class));
    verify(cefrRepository, never()).findAll();
    verifyNoInteractions(cefrService);

  }

  @Test
  void shouldReturnZeroStatsWhenEnrollmentHasNoActivities() {
    //given
    LanguageEnrollment enrollment = createEnrollment();

    List<LanguageEnrollmentActivityStats> stats = List.of();

    Page<LanguageEnrollment> page = new PageImpl<>(List.of(enrollment), PAGEABLE, 1);

    List<CefrLevel> levels = List.of();
    CefrProgressResponse progress = CefrProgressResponse.builder()
        .currentLevel("A0")
        .nextLevel("A1")
        .minutesUntilNextLevel(2900L)
        .progressPercent(0)
        .build();

    when(userRepository.findById(USER_ID))
        .thenReturn(Optional.of(user));
    when(enrollmentRepository.findAllByUser(user, PAGEABLE))
        .thenReturn(page);
    when(enrollmentRepository.findActivityStatsByLanguageEnrollmentIds(
        eq(List.of(ENROLLMENT_ID)), any(LocalDate.class)))
        .thenReturn(stats);
    when(cefrRepository.findAll()).thenReturn(levels);
    when(cefrService.calculateCefrLevel(0L, levels))
        .thenReturn(progress);

    //when
    PageResponse<LanguageEnrollmentResponse> response = enrollmentService.getPaginatedLanguageEnrollments(
        PAGEABLE);

    //then
    assertThat(response).isNotNull();
    LanguageEnrollmentResponse result = response.getData().getFirst();
    assertThat(result.getActivityStats().todayMinutes()).isEqualTo(0);
    assertThat(result.getActivityStats().totalMinutes()).isEqualTo(0);
    verify(cefrService).calculateCefrLevel(0L, levels);
    assertThat(result.getCefrProgress()).isEqualTo(progress);

  }

  @Test
  void shouldThrowWhenGettingEnrollmentsAndUserNotFound() {
    //given
    when(userRepository.findById(USER_ID))
        .thenReturn(Optional.empty());

    //then
    assertThatThrownBy(
        () -> enrollmentService.getPaginatedLanguageEnrollments(PAGEABLE)).isInstanceOf(
        ResourceNotFoundException.class);
    verifyNoInteractions(enrollmentRepository, cefrRepository, cefrService);
  }

  private User createUser() {
    User testUser = new User();
    testUser.setId(USER_ID);
    testUser.setEmail("john@example.com");
    return testUser;
  }

  private Language createLanguage() {
    Language testLanguage = new Language();
    testLanguage.setId(LANGUAGE_ID);
    testLanguage.setName("English");
    testLanguage.setCode("en");
    return testLanguage;
  }

  private LanguageEnrollment createEnrollment() {
    return createEnrollment(ENROLLMENT_ID);
  }

  private LanguageEnrollment createEnrollment(long enrollmentId) {
    LanguageEnrollment enrollment = new LanguageEnrollment();
    enrollment.setId(enrollmentId);
    enrollment.setUser(user);
    enrollment.setLanguage(language);
    enrollment.setDailyGoalMinutes(DAILY_GOAL_MINUTES);
    return enrollment;
  }

  private CreateEnrollmentRequest createValidRequest() {
    return new CreateEnrollmentRequest(LANGUAGE_ID, STARTER_MINUTES, DAILY_GOAL_MINUTES);
  }

}
