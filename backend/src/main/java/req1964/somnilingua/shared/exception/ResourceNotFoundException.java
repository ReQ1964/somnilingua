package req1964.somnilingua.shared.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends BaseException {

  public ResourceNotFoundException(String resource, Long id) {
    super(resource + " not found with id: " + id, HttpStatus.NOT_FOUND);
  }
}