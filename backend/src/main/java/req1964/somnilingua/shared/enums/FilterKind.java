package req1964.somnilingua.shared.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum FilterKind implements NamedEnum {
  STARTS_WITH("Starts with"),
  LIKE("Like");

  private final String name;
}
