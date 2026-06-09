package req1964.somnilingua.cefr.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import req1964.somnilingua.cefr.dto.CefrResponse;
import req1964.somnilingua.cefr.service.CefrService;

import java.util.List;

@RestController
@RequestMapping("/api/cefrs")
@RequiredArgsConstructor
@Tag(name = "CEFR Controller", description = "Operations related to CEFR levels")
public class CefrController {

  private final CefrService cefrService;

  @GetMapping
  @Operation(
      summary = "Get all CEFR levels",
      description = "Returns a list of all CEFR entries available in the system"
  )
  public ResponseEntity<List<CefrResponse>> getAllCefrs() {
    return ResponseEntity.ok(cefrService.getAllCefrs());
  }
}