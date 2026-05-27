package req1964.somnilingua.language.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Value
@Builder
public class LanguageResponse {

  @NotNull
  @Schema(description = "Internal id", example = "1")
  Long id;

  @NotNull
  @Schema(description = "Display name", example = "Spanish")
  String name;

  @NotNull
  @Schema(description = "Language code", example = "es", maxLength = 10)
  String code;

}
