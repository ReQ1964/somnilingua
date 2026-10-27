package req1964.somnilingua.enrollment.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Value;
import req1964.somnilingua.cefr.dto.CefrProgressResponse;
import req1964.somnilingua.language.dto.LanguageResponse;

@Value
@Builder
public class LanguageEnrollmentResponse {

  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  Long id;
  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  int dailyGoalMinutes;
  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  ActivityStatsResponse activityStats;
  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  LanguageResponse language;
  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  CefrProgressResponse cefrProgress;
}
