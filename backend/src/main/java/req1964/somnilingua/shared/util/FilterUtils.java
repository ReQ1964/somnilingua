package req1964.somnilingua.shared.util;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import java.util.Collection;
import java.util.List;
import org.flywaydb.core.internal.util.StringUtils;
import req1964.somnilingua.shared.dto.DynamicFilterValue;

public class FilterUtils {

  public static Predicate textFilter(CriteriaBuilder cb,
      Expression<String> field, DynamicFilterValue filter) {
    if (filter == null || !StringUtils.hasText(filter.getValue())) {
      return null;
    }

    String value = escapeLike(filter.getValue().trim().toLowerCase());
    Expression<String> lowerField = cb.lower(field);

    return switch (filter.getKind()) {
      case STARTS_WITH -> cb.like(lowerField, value + "%");
      case LIKE -> cb.like(lowerField, "%" + value + "%");
    };
  }

  public static <T> Predicate equalFilter(CriteriaBuilder cb, Expression<?> field, T filter) {
    if (filter == null) {
      return null;
    }

    return cb.equal(field, filter);
  }

  public static <T> Predicate inFilter(Expression<?> field, Collection<T> filter) {
    if (filter == null || filter.isEmpty()) {
      return null;
    }

    return field.in(filter);
  }

  private <Y extends Comparable<? super Y>> Predicate between(
      CriteriaBuilder cb,
      Expression<Y> field,
      Y from,
      Y to
  ) {
    return cb.between(field, from, to);
  }

  private static String escapeLike(String value) {
    return value
        .replace("\\", "\\\\")
        .replace("%", "\\%")
        .replace("_", "\\_");
  }

  public static void addIfNotNull(List<Predicate> predicates, Predicate predicate) {
    if (predicate != null) {
      predicates.add(predicate);
    }
  }

}
