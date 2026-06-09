package req1964.somnilingua.cefr.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import req1964.somnilingua.cefr.dto.CefrResponse;
import req1964.somnilingua.cefr.mapper.CefrMapper;
import req1964.somnilingua.cefr.repository.CefrRepository;

import java.util.Comparator;
import java.util.List;

@Transactional
@Service
@RequiredArgsConstructor
public class CefrService {
  private final CefrRepository cefrRepository;

  public List<CefrResponse> getAllCefrs() {
    return cefrRepository.findAll().stream()
        .map(CefrMapper::toResponse)
        .sorted(Comparator.comparingInt(CefrResponse::getOrder))
        .toList();
  }

}
