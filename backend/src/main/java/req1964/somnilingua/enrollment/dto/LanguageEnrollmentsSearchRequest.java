package req1964.somnilingua.enrollment.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;
import req1964.somnilingua.shared.dto.PageableRequest;
import req1964.somnilingua.shared.dto.SortFieldMapping;

@Data
@NoArgsConstructor
public class LanguageEnrollmentsSearchRequest implements PageableRequest {

  private List<LanguageEnrollmentsSearchCriteria> criteria;
  
  @NotNull
  @Min(0)
  private Integer page;

  @NotNull
  @Min(1)
  private Integer size;

  private List<String> sort;

  @Override
  public Class<? extends Enum<? extends SortFieldMapping>> getSortFieldMappings() {
    return null;
  }
}
