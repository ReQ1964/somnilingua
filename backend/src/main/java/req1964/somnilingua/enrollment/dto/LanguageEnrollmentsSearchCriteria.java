package req1964.somnilingua.enrollment.dto;

import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;
import req1964.somnilingua.shared.dto.DynamicFilterValue;

@Data
@NoArgsConstructor
public class LanguageEnrollmentsSearchCriteria {

  private DynamicFilterValue name;
  private List<Long> languageIds;
  private List<String> currentLevels;
  private Boolean goalDoneToday;
  private Boolean hasActivityToday;
  private Integer minProgressPercent;
  private Integer maxProgressPercent;

}
