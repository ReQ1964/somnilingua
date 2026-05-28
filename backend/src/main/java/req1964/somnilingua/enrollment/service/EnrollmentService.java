package req1964.somnilingua.enrollment.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import req1964.somnilingua.activity.domain.Activity;
import req1964.somnilingua.activity.repository.ActivityRepository;
import req1964.somnilingua.enrollment.domain.UserLanguage;
import req1964.somnilingua.enrollment.dto.CreateEnrollmentRequest;
import req1964.somnilingua.enrollment.repository.EnrollmentRepository;
import req1964.somnilingua.language.domain.Language;
import req1964.somnilingua.language.repository.LanguageRepository;
import req1964.somnilingua.shared.exception.ResourceNotFoundException;
import req1964.somnilingua.user.domain.User;
import req1964.somnilingua.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class EnrollmentService {
  private final EnrollmentRepository enrollmentRepository;
  private final LanguageRepository languageRepository;
  private final UserRepository userRepository;
  private final ActivityRepository activityRepository;

  private final Long DEV_USER_ID = 1L;

  public void enroll(CreateEnrollmentRequest request) {
    User user = userRepository.findById(DEV_USER_ID).orElseThrow(() -> new ResourceNotFoundException("User not found", DEV_USER_ID));

    Language language = languageRepository.findById(request.getLanguageId()).orElseThrow(() -> new ResourceNotFoundException("Language not found", request.getLanguageId()));

    UserLanguage userLanguage = new UserLanguage();
    userLanguage.setLanguage(language);
    userLanguage.setUser(user);
    userLanguage.setDailyGoalMinutes(request.getDailyGoalMinutes());

    Activity activity = Activity.createStarterActivity(userLanguage, request.getStarterMinutes());

    enrollmentRepository.save(userLanguage);
    activityRepository.save(activity);
  }
}
