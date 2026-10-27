package req1964.somnilingua.cefr.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class CefrResponse {
  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  Long id;

  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  String level;

  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  int minutes;

  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  int hours;

  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  int words;

  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  String descriptionKey;

  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  int order;
}
