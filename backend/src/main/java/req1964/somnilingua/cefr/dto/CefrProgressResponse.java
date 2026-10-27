package req1964.somnilingua.cefr.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class CefrProgressResponse {

  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  String currentLevel;
  @Schema(nullable = true)
  String nextLevel;
  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  long minutesUntilNextLevel;
  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  int progressPercent;
}
