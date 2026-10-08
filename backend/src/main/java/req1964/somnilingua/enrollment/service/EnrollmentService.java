package req1964.somnilingua.enrollment.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import req1964.somnilingua.activity.domain.Activity;
import req1964.somnilingua.enrollment.domain.LanguageEnrollment;
import req1964.somnilingua.enrollment.dto.LanguageEnrollmentActivityStats;
import req1964.somnilingua.enrollment.dto.ActivityStatsResponse;
import req1964.somnilingua.enrollment.dto.CreateEnrollmentRequest;
import req1964.somnilingua.enrollment.dto.LanguageEnrollmentResponse;
import req1964.somnilingua.enrollment.mapper.ActivityStatsMapper;
import req1964.somnilingua.enrollment.mapper.LanguageEnrollmentMapper;
import req1964.somnilingua.enrollment.repository.EnrollmentRepository;
import req1964.somnilingua.language.domain.Language;
import req1964.somnilingua.language.repository.LanguageRepository;
import req1964.somnilingua.shared.dto.PageResponse;
import req1964.somnilingua.shared.exception.ConflictException;
import req1964.somnilingua.shared.exception.ResourceNotFoundException;
import req1964.somnilingua.user.domain.User;
import req1964.somnilingua.user.repository.UserRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Transactional
@Service
@RequiredArgsConstructor
public class EnrollmentService {
  private final EnrollmentRepository enrollmentRepository;
  private final LanguageRepository languageRepository;
  private final UserRepository userRepository;

  private static final Long DEV_USER_ID = 1L;

  public void enroll(CreateEnrollmentRequest request) {
    User user = userRepository.findById(DEV_USER_ID).orElseThrow(() -> new ResourceNotFoundException("User", DEV_USER_ID));

    Language language = languageRepository.findById(request.getLanguageId()).orElseThrow(() -> new ResourceNotFoundException("Language", request.getLanguageId()));

    assertNotAlreadyEnrolled(user, language);

    LanguageEnrollment languageEnrollment = new LanguageEnrollment();
    languageEnrollment.setLanguage(language);
    languageEnrollment.setUser(user);
    languageEnrollment.setDailyGoalMinutes(request.getDailyGoalMinutes());

    if (request.getStarterMinutes() > 0) {
      Activity activity = Activity.createStarterActivity(languageEnrollment, request.getStarterMinutes());
      languageEnrollment.setActivities(List.of(activity));
    }

    enrollmentRepository.save(languageEnrollment);
  }

  public PageResponse<LanguageEnrollmentResponse> getPaginatedLanguageEnrollments(Pageable pageable) {
    User user = userRepository.findById(DEV_USER_ID).orElseThrow(() -> new ResourceNotFoundException("User", DEV_USER_ID));
    Page<LanguageEnrollment> languageEnrollments = enrollmentRepository.findAllByUser(user, pageable);
    List<Long> ids = languageEnrollments.stream().map(LanguageEnrollment::getId).toList();


    List<LanguageEnrollmentActivityStats> stats = ids.isEmpty() ? List.of() : enrollmentRepository.findActivityStatsByLanguageEnrollmentIds(ids);

    Map<Long, ActivityStatsResponse> statsByLanguageEnrollmentId = stats.stream().collect(Collectors.toMap(LanguageEnrollmentActivityStats::languageEnrollmentId, ActivityStatsMapper::toResponse));


    return PageResponse.of(languageEnrollments
        .map(languageEnrollment -> {
          ActivityStatsResponse activityStats = statsByLanguageEnrollmentId.getOrDefault(languageEnrollment.getId(), new ActivityStatsResponse(0, 0));

          return LanguageEnrollmentMapper.toResponse(languageEnrollment, activityStats);
        }));
  }

  private void assertNotAlreadyEnrolled(User user, Language language) {
    if (enrollmentRepository.existsByUserAndLanguage(user, language)) {
      throw new ConflictException("User already enrolled in this language");
    }
  }
}
