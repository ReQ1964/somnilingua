package req1964.somnilingua.shared.dto;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import req1964.somnilingua.shared.util.SortUtils;

public interface PageableRequest {


  Integer getPage();

  Integer getSize();

  String getSort();

  Class<? extends Enum<? extends SortFieldMapping>> getSortFieldMappings();

  default Pageable toPageable() {

    int p = (getPage() != null && getPage() > 0) ? getPage() : 0;
    int s = (getSize() != null && getSize() > 0) ? getSize() : 10;
    Sort sort = SortUtils.parseSort(getSort(), getSortFieldMappings());

    return PageRequest.of(p, s, sort);
  }


}
