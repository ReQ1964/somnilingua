package req1964.somnilingua.enrollment.mapper;

import req1964.somnilingua.enrollment.dto.LanguageEnrollmentActivityStats;
import req1964.somnilingua.enrollment.dto.ActivityStatsResponse;

public final class ActivityStatsMapper {

  public static ActivityStatsResponse toResponse(LanguageEnrollmentActivityStats activityStats) {
    return new ActivityStatsResponse(activityStats.todayMinutes(), activityStats.totalMinutes());
  }

}
