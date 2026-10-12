package req1964.somnilingua.cefr.service;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import req1964.somnilingua.cefr.domain.CefrLevel;
import req1964.somnilingua.cefr.dto.CefrProgressResponse;
import req1964.somnilingua.cefr.repository.CefrRepository;

@ExtendWith(MockitoExtension.class)
public class CefrServiceTest {

  @Mock
  private CefrRepository cefrRepository;

  @InjectMocks
  private CefrService cefrService;

  private static final List<CefrLevel> LEVELS = List.of(
      new CefrLevel(null, "A0", 0, 0, "level.a0", 0),
      new CefrLevel(null, "A1", 3000, 500, "level.a1", 1),
      new CefrLevel(null, "A2", 9000, 1200, "level.a2", 2),
      new CefrLevel(null, "B1", 24000, 2500, "level.b1", 3),
      new CefrLevel(null, "B2", 54000, 5000, "level.b2", 4),
      new CefrLevel(null, "C1", 108000, 10000, "level.c1", 5),
      new CefrLevel(null, "C2", 180000, 16000, "level.c2", 6)
  );


  @Test
  void shouldReturnA0ForZeroMinutes() {
    //when
    CefrProgressResponse response = cefrService.calculateCefrLevel(0, LEVELS);

    //then
    assertThat(response.getCurrentLevel()).isEqualTo(LEVELS.get(0).getLevel());
    assertThat(response.getNextLevel()).isEqualTo(LEVELS.get(1).getLevel());
    assertThat(response.getProgressPercent()).isEqualTo(0);
    assertThat(response.getMinutesUntilNextLevel())
        .isEqualTo((long) LEVELS.get(1).getMinutes());

  }

  @Test
  void shouldReturnA1AtExactThreshold() {
    //when
    CefrProgressResponse response = cefrService.calculateCefrLevel(LEVELS.get(1).getMinutes(),
        LEVELS);

    //then
    assertThat(response.getCurrentLevel()).isEqualTo(LEVELS.get(1).getLevel());
    assertThat(response.getNextLevel()).isEqualTo(LEVELS.get(2).getLevel());
    assertThat(response.getProgressPercent()).isEqualTo(0);
    assertThat(response.getMinutesUntilNextLevel())
        .isEqualTo(6000L);

  }

  @Test
  void shouldCalculateProgressBetweenB1AndB2() {
    //when
    CefrProgressResponse response = cefrService.calculateCefrLevel(28000,
        LEVELS);

    //then
    assertThat(response.getCurrentLevel()).isEqualTo(LEVELS.get(3).getLevel());
    assertThat(response.getNextLevel()).isEqualTo(LEVELS.get(4).getLevel());
    assertThat(response.getProgressPercent()).isEqualTo(13);
    assertThat(response.getMinutesUntilNextLevel())
        .isEqualTo(26000L);

  }

  @Test
  void shouldReturnMaxLevelWhenMinutesExceedHighestThreshold() {
    //when
    CefrProgressResponse response = cefrService.calculateCefrLevel(200000,
        LEVELS);

    //then
    assertThat(response.getCurrentLevel()).isEqualTo(LEVELS.getLast().getLevel());
    assertThat(response.getNextLevel()).isNull();
    assertThat(response.getProgressPercent()).isEqualTo(100);
    assertThat(response.getMinutesUntilNextLevel())
        .isEqualTo(0L);

  }

  @Test
  void shouldThrowExceptionWhenMinutesAreNegative() {
    assertThatThrownBy(() -> cefrService.calculateCefrLevel(-1000,
        LEVELS)).isInstanceOf(IllegalStateException.class);

  }

  @Test
  void shouldThrowExceptionWhenLevelsAreEmpty() {
    assertThatThrownBy(() -> cefrService.calculateCefrLevel(1000,
        List.of())).isInstanceOf(IllegalStateException.class);

  }
}
