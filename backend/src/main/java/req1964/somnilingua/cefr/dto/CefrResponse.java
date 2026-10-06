package req1964.somnilingua.cefr.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class CefrResponse {
  Long id;

  String level;

  int minutes;

  int hours;

  int words;

  String descriptionKey;

  int order;
}
