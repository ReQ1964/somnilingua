package req1964.somnilingua.shared.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class PageResponse<T> {

  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  private List<T> data;
  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  private Meta meta;

  @AllArgsConstructor
  @Getter
  @Setter
  public static class Meta {

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    int page;
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    int size;
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    long totalElements;
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    int totalPages;
  }


  public static <T> PageResponse<T> of(Page<T> page) {
    return new PageResponse<>(page.getContent(),
        new Meta(page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages()));
  }
}
