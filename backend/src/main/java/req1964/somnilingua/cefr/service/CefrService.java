package req1964.somnilingua.cefr.service;

import jakarta.transaction.Transactional;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import req1964.somnilingua.cefr.domain.CefrLevel;
import req1964.somnilingua.cefr.dto.CefrProgressResponse;
import req1964.somnilingua.cefr.dto.CefrResponse;
import req1964.somnilingua.cefr.mapper.CefrMapper;
import req1964.somnilingua.cefr.repository.CefrRepository;

@Transactional
@Service
@RequiredArgsConstructor
public class CefrService {

  private final CefrRepository cefrRepository;

  public List<CefrResponse> getAllCefrs() {
    return cefrRepository.findAllByOrderBySortOrderAsc().stream().map(CefrMapper::toResponse)
        .toList();
  }

  public CefrProgressResponse calculateCefrLevel(long totalMinutes, List<CefrLevel> cefrLevels) {
    CefrLevel currentLevel = cefrLevels.stream().filter(level -> level.getMinutes() <= totalMinutes)
        .max(Comparator.comparingInt(CefrLevel::getMinutes))
        .orElseThrow(() -> new IllegalStateException("No matching CEFR level"));

    Optional<CefrLevel> nextCefrLevel = cefrLevels.stream()
        .filter(level -> level.getMinutes() > totalMinutes)
        .min(Comparator.comparingInt(CefrLevel::getMinutes));

    if (nextCefrLevel.isEmpty()) {
      return CefrProgressResponse
          .builder()
          .currentLevel(currentLevel.getLevel())
          .nextLevel(null)
          .minutesUntilNextLevel(0L)
          .progressPercent(100L)
          .build();
    }

    CefrLevel next = nextCefrLevel.orElseThrow();
    long minutesUntilNextLevel = next.getMinutes() - totalMinutes;

    long completed = totalMinutes - currentLevel.getMinutes();
    long range = next.getMinutes() - currentLevel.getMinutes();
    long progress = completed * 100 / range;

    return CefrProgressResponse
        .builder()
        .currentLevel(currentLevel.getLevel())
        .minutesUntilNextLevel(minutesUntilNextLevel)
        .nextLevel(next.getLevel())
        .progressPercent(progress)
        .build();
  }

}
