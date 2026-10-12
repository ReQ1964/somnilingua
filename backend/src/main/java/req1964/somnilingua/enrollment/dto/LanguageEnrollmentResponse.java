package req1964.somnilingua.enrollment.dto;

import lombok.Builder;
import lombok.Value;
import req1964.somnilingua.cefr.dto.CefrProgressResponse;
import req1964.somnilingua.language.dto.LanguageResponse;

@Value
@Builder
public class LanguageEnrollmentResponse {

  Long id;
  int dailyGoalMinutes;
  ActivityStatsResponse activityStats;
  LanguageResponse language;
  CefrProgressResponse cefrProgress;
}
