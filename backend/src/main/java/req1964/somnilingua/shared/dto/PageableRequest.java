package req1964.somnilingua.shared.dto;

import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import req1964.somnilingua.shared.util.SortUtils;

public interface PageableRequest {


  Integer getPage();

  Integer getSize();

  List<String> getSort();

  Class<? extends Enum<? extends SortFieldMapping>> getSortFieldMappings();

  default Pageable toPageable() {

    int p = (getPage() != null && getPage() > 0) ? getPage() : 1;
    int s = (getSize() != null && getSize() > 0) ? getSize() : 10;
    Sort sort = SortUtils.parseSort(getSort(), getSortFieldMappings());

    return PageRequest.of(p, s, sort);
  }


}
