package req1964.somnilingua.enrollment.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import req1964.somnilingua.enrollment.dto.CreateEnrollmentRequest;
import req1964.somnilingua.enrollment.repository.EnrollmentRepository;
import req1964.somnilingua.language.domain.Language;
import req1964.somnilingua.language.repository.LanguageRepository;
import req1964.somnilingua.shared.exception.ConflictException;
import req1964.somnilingua.shared.exception.ResourceNotFoundException;
import req1964.somnilingua.user.domain.User;
import req1964.somnilingua.user.repository.UserRepository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EnrollmentServiceTest {
  @Mock
  private EnrollmentRepository enrollmentRepository;

  @Mock
  private LanguageRepository languageRepository;

  @Mock
  private UserRepository userRepository;

  @InjectMocks
  private EnrollmentService enrollmentService;

  @Test
  void shouldEnrollUserSuccessfully() {
    // given
    User user = new User();
    Language language = new Language();

    when(userRepository.findById(1L))
        .thenReturn(Optional.of(user));

    when(languageRepository.findById(10L))
        .thenReturn(Optional.of(language));

    when(enrollmentRepository.existsByUserAndLanguage(user, language))
        .thenReturn(false);

    CreateEnrollmentRequest request = new CreateEnrollmentRequest(10L, 30, 10);
    // when
    enrollmentService.enroll(request);
    // then
    verify(enrollmentRepository).existsByUserAndLanguage(user, language);
  }

  @Test
  void shouldThrowWhenUserNotFound() {
    // given
    when(userRepository.findById(1L))
        .thenReturn(Optional.empty());

    CreateEnrollmentRequest request = new CreateEnrollmentRequest(10L, 30, 10);
    // then
    assertThatThrownBy(() -> enrollmentService.enroll(request)).isInstanceOf(ResourceNotFoundException.class);
  }

  @Test
  void shouldThrowWhenAlreadyEnrolled() {
    // given
    User user = new User();
    Language language = new Language();

    when(userRepository.findById(1L))
        .thenReturn(Optional.of(user));

    when(languageRepository.findById(10L))
        .thenReturn(Optional.of(language));

    when(enrollmentRepository.existsByUserAndLanguage(user, language)).thenReturn(true);
    CreateEnrollmentRequest request = new CreateEnrollmentRequest(10L, 30, 10);
    // then
    assertThatThrownBy(() -> enrollmentService.enroll(request)).isInstanceOf(ConflictException.class);
  }

  @Test
  void shouldThrowWhenLanguageNotFound() {
    // given
    when(userRepository.findById(1L))
        .thenReturn(Optional.of(new User()));

    when(languageRepository.findById(10L))
        .thenReturn(Optional.empty());

    CreateEnrollmentRequest request = new CreateEnrollmentRequest(10L, 30, 10);
    // then
    assertThatThrownBy(() -> enrollmentService.enroll(request)).isInstanceOf(ResourceNotFoundException.class);
  }

  @Test
  void shouldGenerateStarterActivityWhenEnrolled() {
    // given
    User user = new User();
    Language language = new Language();

    when(userRepository.findById(1L))
        .thenReturn(Optional.of(user));

    when(languageRepository.findById(10L))
        .thenReturn(Optional.of(language));

    when(enrollmentRepository.existsByUserAndLanguage(user, language))
        .thenReturn(false);

    CreateEnrollmentRequest request = new CreateEnrollmentRequest(10L, 30, 10);
    // when
    enrollmentService.enroll(request);
    // then
    verify(enrollmentRepository).existsByUserAndLanguage(user, language);
    verify(enrollmentRepository).save(argThat(userLanguage ->
        userLanguage.getActivities() != null &&
            userLanguage.getActivities().size() == 1
    ));

  }

}
