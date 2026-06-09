package req1964.somnilingua.cefr.mapper;

import req1964.somnilingua.cefr.domain.CefrLevel;
import req1964.somnilingua.cefr.dto.CefrResponse;

import java.util.function.Function;

public class CefrMapper {
  public static CefrResponse toResponse(CefrLevel cefr) {
    return CefrResponse.builder()
        .id(cefr.getId())
        .order(cefr.getSortOrder())
        .descriptionKey(cefr.getDescriptionKey())
        .minutes(cefr.getMinutes())
        .level(cefr.getLevel())
        .words(cefr.getWords())
        .hours(convertToHours.apply(cefr.getMinutes()))
        .build();
  }


  private static final Function<Integer, Integer> convertToHours = minutes -> minutes / 60;
}
