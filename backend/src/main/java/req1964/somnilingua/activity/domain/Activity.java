package req1964.somnilingua.activity.domain;

import jakarta.persistence.*;
import lombok.*;
import req1964.somnilingua.activity.dto.ActivityType;
import req1964.somnilingua.enrollment.domain.UserLanguage;

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
  @JoinColumn(name = "fk_user_language_id", nullable = false)
  private UserLanguage userLanguage;

  @Enumerated(EnumType.STRING)
  private ActivityType type;
  private int minutes;
  private String notes;

  public static Activity createStarterActivity(UserLanguage userLanguage, int minutes) {
    Activity activity = new Activity();
    activity.setType(ActivityType.OTHER);
    activity.setUserLanguage(userLanguage);
    activity.setMinutes(minutes);
    activity.setNotes("This is your chosen starter level. You can edit it anytime.");
    return activity;
  }
}
