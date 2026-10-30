package req1964.somnilingua.shared.util;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

public class DateUtils {


  public static Instant atStartOfDay(LocalDate localDate) {
    return localDate
        .atStartOfDay(ZoneId.systemDefault())
        .toInstant();
  }

  public static Instant atStartOfDay() {
    return LocalDate.now()
        .atStartOfDay(ZoneId.systemDefault())
        .toInstant();
  }

  public static Instant atEndOfDay(LocalDate localDate) {
    return localDate
        .plusDays(1)
        .atStartOfDay(ZoneId.systemDefault())
        .toInstant();
  }

  public static Instant atEndOfDay() {
    return LocalDate.now()
        .plusDays(1)
        .atStartOfDay(ZoneId.systemDefault())
        .toInstant();
  }


}
