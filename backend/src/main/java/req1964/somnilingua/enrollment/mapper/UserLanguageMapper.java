package req1964.somnilingua.enrollment.mapper;

import req1964.somnilingua.enrollment.domain.UserLanguage;
import req1964.somnilingua.enrollment.dto.ActivityStats;
import req1964.somnilingua.enrollment.dto.UserLanguageResponse;
import req1964.somnilingua.language.mapper.LanguageMapper;

public final class UserLanguageMapper {

  public static UserLanguageResponse toResponse(UserLanguage userLanguage, ActivityStats activityStats) {
    return UserLanguageResponse
        .builder()
        .activityStats(activityStats)
        .id(userLanguage.getId())
        .language(LanguageMapper.toLanguageResponse(userLanguage.getLanguage()))
        .build();
  }

}
