package req1964.somnilingua.cefr.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class CefrProgressResponse {

  String currentLevel;
  String nextLevel;
  long minutesUntilNextLevel;
  long progressPercent;
}
