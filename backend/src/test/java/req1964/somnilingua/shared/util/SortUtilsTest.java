package req1964.somnilingua.shared.util;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

import java.util.Collections;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import req1964.somnilingua.shared.dto.SortFieldMapping;

public class SortUtilsTest {

  @AllArgsConstructor
  @Getter
  enum TestSortFieldMapping implements SortFieldMapping {
    NAME("name", "language.name"),
    CREATED_AT("createdAt", "createdAt");
    private final String requestProperty;
    private final String entityPath;
  }


  @Test
  void shouldRejectUnsupportedRequestProperty() {
    List<String> sort = List.of("notAllowed,asc");

    assertThatThrownBy(() -> SortUtils.parseSort(sort, TestSortFieldMapping.class)).isInstanceOf(
        IllegalArgumentException.class);
  }


  @Test
  void shouldMapRequestPropertyToEntityPath() {
    List<String> sort = List.of("name,desc");

    Sort result = SortUtils.parseSort(sort, TestSortFieldMapping.class);

    List<Sort.Order> orders = result.toList();

    assertThat(orders.getFirst().getProperty()).isEqualTo(
        TestSortFieldMapping.NAME.getEntityPath());
    assertThat(orders.getFirst().getDirection()).isEqualTo(Direction.DESC);
  }

  @Test
  void shouldKeepRequestPropertyWhenSortFieldMappingsAreNotProvided() {
    List<String> sort = List.of("name,desc");

    Sort result = SortUtils.parseSort(sort, null);

    List<Sort.Order> orders = result.toList();

    assertThat(orders.getFirst().getProperty()).isEqualTo("name");
    assertThat(orders.getFirst().getDirection()).isEqualTo(Direction.DESC);
  }

  @Test
  void shouldReturnUnsortedWhenSortListIsEmpty() {
    List<String> sort = Collections.emptyList();

    Sort result = SortUtils.parseSort(sort, TestSortFieldMapping.class);

    assertThat(result.isUnsorted()).isTrue();
  }

  @Test
  void shouldReturnUnsortedWhenSortListIsNull() {

    Sort result = SortUtils.parseSort(null, TestSortFieldMapping.class);

    assertThat(result.isUnsorted()).isTrue();
  }

  @Test
  void shouldDefaultDirectionToAscendingWhenDirectionIsMissing() {
    List<String> sort = List.of("name");

    Sort result = SortUtils.parseSort(sort, TestSortFieldMapping.class);

    List<Sort.Order> orders = result.toList();

    assertThat(orders.getFirst().getDirection()).isEqualTo(Direction.ASC);
  }

  @Test
  void shouldRejectInvalidSortDirection() {
    List<String> sort = List.of("name,invalidDirection");

    assertThatThrownBy(() -> SortUtils.parseSort(sort, TestSortFieldMapping.class)).isInstanceOf(
        IllegalArgumentException.class);
  }

  @Test
  void shouldRejectUnsupportedRequestPropertyWhenMultipleSortsAreProvided() {
    List<String> sort = List.of("name,asc", "notAllowed,desc");

    assertThatThrownBy(() -> SortUtils.parseSort(sort, TestSortFieldMapping.class)).isInstanceOf(
        IllegalArgumentException.class);
  }

  @Test
  void shouldMapMultipleRequestPropertiesToEntityPaths() {
    List<String> sort = List.of("name,asc", "createdAt,desc");

    Sort result = SortUtils.parseSort(sort, TestSortFieldMapping.class);

    List<Sort.Order> orders = result.toList();

    assertThat(orders.getFirst().getProperty()).isEqualTo(
        TestSortFieldMapping.NAME.getEntityPath());
    assertThat(orders.getFirst().getDirection()).isEqualTo(Direction.ASC);
    assertThat(orders.get(1).getProperty()).isEqualTo(
        TestSortFieldMapping.CREATED_AT.getEntityPath());
    assertThat(orders.get(1).getDirection()).isEqualTo(Direction.DESC);
  }

  @Test
  void shouldTrimWhitespaceAroundRequestPropertyAndDirection() {
    List<String> sort = List.of(" name ,asc ");

    Sort result = SortUtils.parseSort(sort, TestSortFieldMapping.class);

    List<Sort.Order> orders = result.toList();

    assertThat(orders.getFirst().getProperty()).isEqualTo(
        TestSortFieldMapping.NAME.getEntityPath());
    assertThat(orders.getFirst().getDirection()).isEqualTo(Direction.ASC);
  }
}
