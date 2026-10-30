package req1964.somnilingua.enrollment.dto;

import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LanguageEnrollmentsSearchCriteria {

  private String name;
  private List<Long> languageIds;
  private List<String> languageCodes;
  private List<String> currentLevels;
  private Boolean goalDoneToday;
  private Boolean hasActivityToday;
  private Integer minProgressPercent;
  private Integer maxProgressPercent;

}
