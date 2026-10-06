package req1964.somnilingua.shared.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class PageResponse<T> {
  private List<T> data;
  private Meta meta;

  @AllArgsConstructor
  @Getter
  @Setter
  private static class Meta {
    int page;
    int size;
    long totalElements;
    int totalPages;
  }


  public static <T> PageResponse<T> of(Page<T> page) {
    return new PageResponse<>(page.getContent(), new Meta(page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages()));
  }
}
