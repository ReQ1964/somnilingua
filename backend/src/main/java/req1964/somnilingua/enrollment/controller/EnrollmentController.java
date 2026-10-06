package req1964.somnilingua.enrollment.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import req1964.somnilingua.enrollment.dto.CreateEnrollmentRequest;
import req1964.somnilingua.enrollment.dto.UserLanguageResponse;
import req1964.somnilingua.enrollment.service.EnrollmentService;
import req1964.somnilingua.shared.dto.PageResponse;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {
  private final EnrollmentService enrollmentService;

  @Operation(
      summary = "Enroll user into a language",
      description = "Creates a UserLanguage record linking a user and a language."
  )
  @ApiResponse(responseCode = "204", description = "Enrollment created successfully")
  @ApiResponse(responseCode = "404", description = "User or Language not found")
  @ApiResponse(responseCode = "409", description = "User already enrolled in language")
  @PostMapping
  public ResponseEntity<Void> createEnrollment(@Valid @RequestBody CreateEnrollmentRequest request) {
    enrollmentService.enroll(request);

    return ResponseEntity
        .status(HttpStatus.NO_CONTENT)
        .build();
  }

  @Operation(
      summary = "Get paginated list of user's enrollments",
      description = "Returns a paginated and filtered list of languages for a user."
  )
  @GetMapping()
  public PageResponse<UserLanguageResponse> getPaginatedUserLanguages(Pageable pageable) {
    return enrollmentService.getPaginatedUserLanguages(pageable);
  }
}
