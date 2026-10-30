package req1964.somnilingua.enrollment.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import req1964.somnilingua.shared.dto.SortFieldMapping;

@Getter
@RequiredArgsConstructor
public enum LanguageEnrollmentSortFieldMapping implements SortFieldMapping {

  LANGUAGE_NAME("name", "language.name");

  private final String requestProperty;
  private final String entityPath;
}
