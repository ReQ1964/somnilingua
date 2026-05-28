package req1964.somnilingua.enrollment.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import req1964.somnilingua.enrollment.dto.CreateEnrollmentRequest;
import req1964.somnilingua.enrollment.service.EnrollmentService;

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
}
