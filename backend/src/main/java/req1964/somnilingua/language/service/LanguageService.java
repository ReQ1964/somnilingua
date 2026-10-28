package req1964.somnilingua.language.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import req1964.somnilingua.language.domain.Language;
import req1964.somnilingua.language.dto.LanguageResponse;
import req1964.somnilingua.language.mapper.LanguageMapper;
import req1964.somnilingua.language.repository.LanguageRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LanguageService {

  private final LanguageRepository repository;

  public List<LanguageResponse> getLanguages(List<Long> exclude) {
    List<Language> languages = CollectionUtils.isEmpty(exclude) ? repository.findAll()
        : repository.findAllByIdNotIn(exclude);

    return languages.stream().map(LanguageMapper::toLanguageResponse)
        .collect(Collectors.toList());
  }
}
