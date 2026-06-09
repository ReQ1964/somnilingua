package req1964.somnilingua.activity.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import req1964.somnilingua.shared.enums.NamedEnum;

@Getter
@RequiredArgsConstructor
public enum ActivityType implements NamedEnum {
  WATCHING("Watching"),
  LISTENING("Listening"),
  READING("Reading"),
  SPEAKING("Speaking"),
  WRITING("Writing"),
  STUDYING("Studying"),
  OTHER("Other");

  private final String name;
}
