package req1964.somnilingua.shared.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<ApiError> handleRuntimeException(RuntimeException e) {

    ApiError error = ApiError.builder()
        .message(e.getMessage())
        .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .timestamp(Instant.now())
        .build();
    
    return ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(error);
  }

  @ExceptionHandler(BaseException.class)
  public ResponseEntity<ApiError> handleBaseException(BaseException ex) {

    ApiError error = ApiError.builder()
        .message(ex.getMessage())
        .status(ex.getStatus().value())
        .timestamp(Instant.now())
        .build();

    return ResponseEntity
        .status(ex.getStatus())
        .body(error);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {

    Map<String, String> errors = new HashMap<>();

    ex.getBindingResult().getFieldErrors()
        .forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );

    ApiError apiError = ApiError.builder()
        .message("Validation failed")
        .status(HttpStatus.BAD_REQUEST.value())
        .timestamp(Instant.now())
        .fieldErrors(errors)
        .build();

    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(apiError);
  }
}