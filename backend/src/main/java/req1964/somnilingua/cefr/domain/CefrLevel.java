package req1964.somnilingua.cefr.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity(name = "cefr_level")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CefrLevel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String level;

  @Column(nullable = false)
  private Integer minutes;

  @Column(nullable = false)
  private Integer words;

  @Column(name = "description_key", nullable = false)
  private String descriptionKey;

  @Column(name = "sort_order", nullable = false, unique = true)
  private Integer sortOrder;
}
