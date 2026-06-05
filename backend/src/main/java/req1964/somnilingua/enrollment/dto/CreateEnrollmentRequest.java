package req1964.somnilingua.enrollment.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Value;

@Value
public class CreateEnrollmentRequest {

  @NotNull
  Long languageId;
  @NotNull
  @Min(1)
  Integer starterMinutes;
  @NotNull
  @Min(1)
  Integer dailyGoalMinutes;
}
