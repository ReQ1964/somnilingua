package req1964.somnilingua.language.mapper;

import req1964.somnilingua.language.domain.Language;
import req1964.somnilingua.language.dto.LanguageResponse;

public final class LanguageMapper {

  public static LanguageResponse toLanguageResponse(Language language) {
    return LanguageResponse.builder()
        .id(language.getId())
        .name(language.getName())
        .code(language.getCode())
        .build();
  }
}
