package req1964.somnilingua.shared.exception;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.util.Map;

@Value
@Builder
@Schema(description = "Standard error response returned by the API")
public class ApiError {

  @NotNull
  @Schema(description = "Error message", example = "Validation failed")
  String message;

  @NotNull
  @Schema(description = "Timestamp of error occurrence", example = "2026-05-29T10:15:30Z")
  Instant timestamp;

  @NotNull
  @Schema(description = "HTTP status code", example = "400")
  int status;

  @Schema(
      description = "Field validation errors (only present for validation errors)",
      example = "{\"email\": \"must not be blank\"}"
  )
  Map<String, String> fieldErrors;
}