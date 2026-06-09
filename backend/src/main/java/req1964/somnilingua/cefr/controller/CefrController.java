package req1964.somnilingua.cefr.controller;

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
public class CefrController {
  private final CefrService cefrService;

  @GetMapping
  ResponseEntity<List<CefrResponse>> getAllCefrs() {
    return ResponseEntity.ok().body(cefrService.getAllCefrs());
  }

}
