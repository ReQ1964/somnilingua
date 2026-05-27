package req1964.somnilingua.language.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import req1964.somnilingua.language.dto.LanguageResponse;
import req1964.somnilingua.language.mapper.LanguageMapper;
import req1964.somnilingua.language.repository.LanguageRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LanguageService {
  private final LanguageRepository repository;

  public List<LanguageResponse> getLanguages() {
    return repository.findAll().stream().map(LanguageMapper::toLanguageResponse).collect(Collectors.toList());
  }
}
