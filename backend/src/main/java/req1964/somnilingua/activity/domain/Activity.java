package req1964.somnilingua.activity.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import req1964.somnilingua.activity.dto.ActivityType;
import req1964.somnilingua.enrollment.domain.LanguageEnrollment;

import java.time.Instant;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Activity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "fk_language_enrollment_id", nullable = false)
  private LanguageEnrollment languageEnrollment;

  @Enumerated(EnumType.STRING)
  private ActivityType type;
  private int minutes;

  private String notes;

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  @Column(name = "modified_at")
  private Instant modifiedAt;

  public static Activity createStarterActivity(LanguageEnrollment languageEnrollment, int minutes) {
    Activity activity = new Activity();
    activity.setType(ActivityType.OTHER);
    activity.setLanguageEnrollment(languageEnrollment);
    activity.setMinutes(minutes);
    activity.setNotes("This is your chosen starter level. You can edit it anytime.");
    return activity;
  }
}
