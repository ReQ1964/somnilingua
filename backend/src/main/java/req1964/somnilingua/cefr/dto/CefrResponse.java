package req1964.somnilingua.cefr.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class CefrResponse {
  Long id;

  String level;

  Integer minutes;

  Integer hours;

  Integer words;

  String descriptionKey;

  Integer order;
}
