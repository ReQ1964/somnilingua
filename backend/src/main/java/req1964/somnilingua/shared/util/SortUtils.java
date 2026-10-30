package req1964.somnilingua.shared.util;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.util.StringUtils;
import req1964.somnilingua.shared.dto.SortFieldMapping;

public class SortUtils {

  public static Sort parseSort(String sort,
      Class<? extends Enum<? extends SortFieldMapping>> sortFieldMappings) {
    if (!StringUtils.hasText(sort)) {
      return Sort.unsorted();
    }

    Sort rawSort = Sort.by(parseSortString(sort));

    return applySortFieldMappings(rawSort, sortFieldMappings);
  }

  private static Order parseSortString(String item) {
    String[] parts = item.split(",");
    return new Order(parts.length > 1 ? Direction.fromString(parts[1].trim()) : Direction.ASC,
        parts[0].trim());
  }


  private static Sort applySortFieldMappings(Sort sort,
      Class<? extends Enum<? extends SortFieldMapping>> sortFieldMappings) {
    if (sortFieldMappings == null) {
      return sort;
    }

    Map<String, String> entityPathByRequestProperty = Arrays.stream(
            sortFieldMappings.getEnumConstants())
        .collect(Collectors.toMap(p -> ((SortFieldMapping) p).getRequestProperty(),
            p -> ((SortFieldMapping) p).getEntityPath()));

    List<Sort.Order> orders = sort.stream()
        .map(mapRequestPropertyToEntityPath(entityPathByRequestProperty))
        .toList();

    return Sort.by(orders);
  }


  private static Function<Order, Order> mapRequestPropertyToEntityPath(
      Map<String, String> entityPathByRequestProperty) {
    return sort -> {
      String path = entityPathByRequestProperty.get(sort.getProperty());
      if (path == null) {
        throw new IllegalArgumentException("Unsupported sort property: " + sort.getProperty());
      }
      return new Sort.Order(sort.getDirection(), path);
    };
  }

}
