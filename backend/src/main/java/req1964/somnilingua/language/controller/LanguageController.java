package req1964.somnilingua.language.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import req1964.somnilingua.language.dto.LanguageResponse;
import req1964.somnilingua.language.service.LanguageService;

import java.util.List;

@Tag(name = "Language", description = "Api to manage languages")
@RestController
@RequestMapping("/api/languages")
@RequiredArgsConstructor
public class LanguageController {
  private final LanguageService service;

  @Operation(summary = "List of all languages", description = "It returns a list of all the available languages")
  @GetMapping
  public List<LanguageResponse> getLanguages() {
    return service.getLanguages();
  }
}
