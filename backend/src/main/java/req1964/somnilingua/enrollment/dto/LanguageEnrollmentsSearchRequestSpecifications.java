package req1964.somnilingua.enrollment.dto;

import static req1964.somnilingua.shared.util.FilterUtils.addIfNotNull;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import req1964.somnilingua.activity.domain.Activity;
import req1964.somnilingua.cefr.domain.CefrLevel;
import req1964.somnilingua.enrollment.domain.LanguageEnrollment;
import req1964.somnilingua.shared.util.DateUtils;
import req1964.somnilingua.shared.util.FilterUtils;
import req1964.somnilingua.user.domain.User;

public class LanguageEnrollmentsSearchRequestSpecifications {

  public static Specification<LanguageEnrollment> build(
      LanguageEnrollmentsSearchCriteria criteria, List<CefrLevel> cefrLevels, User user) {

    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();
      predicates.add(cb.equal(root.get("user"), user));

      if (criteria == null) {
        return cb.and(predicates.toArray(new Predicate[0]));
      }

      addIfNotNull(predicates, FilterUtils.textFilter(cb, root.get("language").get("name"),
          criteria.getName()));
      addIfNotNull(predicates, FilterUtils.inFilter(root.get("language").get("id"),
          criteria.getLanguageIds()));
      addIfNotNull(predicates, hasActivityToday(criteria.getHasActivityToday(), root, query, cb,
          DateUtils.atStartOfDay(),
          DateUtils.atEndOfDay()));
      addIfNotNull(predicates,
          hasReachedGoalToday(criteria.getGoalDoneToday(), root, query, cb,
              DateUtils.atStartOfDay(),
              DateUtils.atEndOfDay()));
      addIfNotNull(predicates,
          currentLevelsIn(criteria.getCurrentLevels(), cefrLevels, root, query, cb));

      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }

  private static Predicate hasActivityToday(
      Boolean value,
      Root<LanguageEnrollment> root,
      CriteriaQuery<?> query,
      CriteriaBuilder cb,
      Instant startOfDay,
      Instant endOfDay
  ) {
    if (value == null) {
      return null;
    }

    Subquery<Integer> subquery = query.subquery(Integer.class);
    Root<Activity> activity = subquery.from(Activity.class);
    subquery.select(cb.literal(1));
    subquery.where(
        cb.equal(activity.get("languageEnrollment"), root),
        cb.greaterThanOrEqualTo(activity.get("createdAt"), startOfDay),
        cb.lessThan(activity.get("createdAt"), endOfDay)
    );

    Predicate exists = cb.exists(subquery);
    return value ? exists : cb.not(exists);
  }

  private static Predicate hasReachedGoalToday(
      Boolean value,
      Root<LanguageEnrollment> root,
      CriteriaQuery<?> query,
      CriteriaBuilder cb,
      Instant startOfDay,
      Instant endOfDay
  ) {
    if (value == null) {
      return null;
    }
    Subquery<Long> totalMinutes = query.subquery(Long.class);
    Root<Activity> activity = totalMinutes.from(Activity.class);

    totalMinutes.select(cb.coalesce(cb.sumAsLong(activity.get("minutes")), 0L));

    totalMinutes.where(
        cb.equal(activity.get("languageEnrollment"), root),
        cb.greaterThanOrEqualTo(activity.get("createdAt"), startOfDay),
        cb.lessThan(activity.get("createdAt"), endOfDay)
    );

    Predicate done = cb.greaterThanOrEqualTo(totalMinutes, cb.toLong(root.get("dailyGoalMinutes")));

    return value ? done : cb.not(done);
  }

  private static Predicate currentLevelsIn(
      List<String> levels,
      List<CefrLevel> cefrLevels,
      Root<LanguageEnrollment> root,
      CriteriaQuery<?> query,
      CriteriaBuilder cb
  ) {
    if (levels == null || levels.isEmpty()) {
      return null;
    }

    Subquery<Long> totalMinutes = query.subquery(Long.class);
    Root<Activity> activity = totalMinutes.from(Activity.class);

    totalMinutes.select(cb.coalesce(cb.sumAsLong(activity.get("minutes")), 0L));

    totalMinutes.where(
        cb.equal(activity.get("languageEnrollment"), root)
    );

    List<Predicate> ranges = new ArrayList<>();

    for (int i = 0; cefrLevels.size() > i; i++) {
      CefrLevel level = cefrLevels.get(i);

      if (!levels.contains(level.getLevel())) {
        continue;
      }

      boolean isLast = i == cefrLevels.size() - 1;

      if (isLast) {
        ranges.add(cb.greaterThanOrEqualTo(totalMinutes, (long) level.getMinutes()));
      } else {
        CefrLevel next = cefrLevels.get(i + 1);
        ranges.add(
            cb.between(totalMinutes, (long) level.getMinutes(), (long) next.getMinutes() - 1));
      }
    }

    return ranges.isEmpty() ? null : cb.or(ranges);

  }

}