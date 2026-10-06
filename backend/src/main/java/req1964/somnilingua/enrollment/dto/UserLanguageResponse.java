package req1964.somnilingua.enrollment.dto;

import lombok.Builder;
import lombok.Value;
import req1964.somnilingua.language.dto.LanguageResponse;

@Value
@Builder
public class UserLanguageResponse {
  Long id;
  ActivityStats activityStats;
  LanguageResponse language;
}
