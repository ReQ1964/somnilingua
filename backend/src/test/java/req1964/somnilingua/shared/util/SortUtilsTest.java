package req1964.somnilingua.shared.util;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

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
    String sort = "notAllowed,asc";

    assertThatThrownBy(() -> SortUtils.parseSort(sort, TestSortFieldMapping.class)).isInstanceOf(
        IllegalArgumentException.class);
  }


  @Test
  void shouldMapRequestPropertyToEntityPath() {
    String sort = "name,desc";

    Sort result = SortUtils.parseSort(sort, TestSortFieldMapping.class);

    List<Sort.Order> orders = result.toList();

    assertThat(orders.getFirst().getProperty()).isEqualTo(
        TestSortFieldMapping.NAME.getEntityPath());
    assertThat(orders.getFirst().getDirection()).isEqualTo(Direction.DESC);
  }

  @Test
  void shouldKeepRequestPropertyWhenSortFieldMappingsAreNotProvided() {
    String sort = "name,desc";

    Sort result = SortUtils.parseSort(sort, null);

    List<Sort.Order> orders = result.toList();

    assertThat(orders.getFirst().getProperty()).isEqualTo("name");
    assertThat(orders.getFirst().getDirection()).isEqualTo(Direction.DESC);
  }

  @Test
  void shouldReturnUnsortedWhenSortStringIsEmpty() {
    String sort = "";

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
    String sort = "name";

    Sort result = SortUtils.parseSort(sort, TestSortFieldMapping.class);

    List<Sort.Order> orders = result.toList();

    assertThat(orders.getFirst().getDirection()).isEqualTo(Direction.ASC);
  }

  @Test
  void shouldRejectInvalidSortDirection() {
    String sort = "name,invalidDirection";

    assertThatThrownBy(() -> SortUtils.parseSort(sort, TestSortFieldMapping.class)).isInstanceOf(
        IllegalArgumentException.class);
  }

  @Test
  void shouldTrimWhitespaceAroundRequestPropertyAndDirection() {
    String sort = " name ,asc ";

    Sort result = SortUtils.parseSort(sort, TestSortFieldMapping.class);

    List<Sort.Order> orders = result.toList();

    assertThat(orders.getFirst().getProperty()).isEqualTo(
        TestSortFieldMapping.NAME.getEntityPath());
    assertThat(orders.getFirst().getDirection()).isEqualTo(Direction.ASC);
  }
}
