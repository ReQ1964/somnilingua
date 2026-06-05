package req1964.somnilingua.enrollment.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import req1964.somnilingua.activity.domain.Activity;
import req1964.somnilingua.enrollment.domain.UserLanguage;
import req1964.somnilingua.enrollment.dto.CreateEnrollmentRequest;
import req1964.somnilingua.enrollment.repository.EnrollmentRepository;
import req1964.somnilingua.language.domain.Language;
import req1964.somnilingua.language.repository.LanguageRepository;
import req1964.somnilingua.shared.exception.ConflictException;
import req1964.somnilingua.shared.exception.ResourceNotFoundException;
import req1964.somnilingua.user.domain.User;
import req1964.somnilingua.user.repository.UserRepository;

import java.util.List;

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

    UserLanguage userLanguage = new UserLanguage();
    userLanguage.setLanguage(language);
    userLanguage.setUser(user);
    userLanguage.setDailyGoalMinutes(request.getDailyGoalMinutes());

    Activity activity = Activity.createStarterActivity(userLanguage, request.getStarterMinutes());
    userLanguage.setActivities(List.of(activity));

    enrollmentRepository.save(userLanguage);
  }

  private void assertNotAlreadyEnrolled(User user, Language language) {
    if (enrollmentRepository.existsByUserAndLanguage(user, language)) {
      throw new ConflictException("User already enrolled in this language");
    }
  }
}
