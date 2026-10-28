package req1964.somnilingua.enrollment.mapper;

import req1964.somnilingua.cefr.dto.CefrProgressResponse;
import req1964.somnilingua.enrollment.domain.LanguageEnrollment;
import req1964.somnilingua.enrollment.dto.ActivityStatsResponse;
import req1964.somnilingua.enrollment.dto.LanguageEnrollmentResponse;
import req1964.somnilingua.language.dto.LanguageResponse;
import req1964.somnilingua.language.mapper.LanguageMapper;

public final class LanguageEnrollmentMapper {

  public static LanguageEnrollmentResponse toResponse(LanguageEnrollment languageEnrollment,
      ActivityStatsResponse activityStats, CefrProgressResponse cefrCalculation) {
    return LanguageEnrollmentResponse
        .builder()
        .id(languageEnrollment.getId())
        .dailyGoalMinutes(languageEnrollment.getDailyGoalMinutes())
        .activityStats(activityStats)
        .language(LanguageMapper.toLanguageResponse(languageEnrollment.getLanguage()))
        .cefrProgress(cefrCalculation)
        .build();
  }

  public static LanguageResponse toLanguageResponse(LanguageEnrollment languageEnrollment
  ) {
    return LanguageResponse
        .builder()
        .id(languageEnrollment.getLanguage().getId())
        .code(languageEnrollment.getLanguage().getCode())
        .name(languageEnrollment.getLanguage().getName())
        .build();
  }

}
