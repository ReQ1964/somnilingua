package req1964.somnilingua.shared.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import req1964.somnilingua.shared.enums.FilterKind;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DynamicFilterValue<T> {

  private T value;

  private FilterKind kind;
}
