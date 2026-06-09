package req1964.somnilingua.enrollment.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import req1964.somnilingua.activity.domain.Activity;
import req1964.somnilingua.language.domain.Language;
import req1964.somnilingua.user.domain.User;

import java.util.List;

@Entity(name = "user_language")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserLanguage {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @Column(name = "daily_goal_minutes")
  Integer dailyGoalMinutes;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "fk_user_id", nullable = false)
  private User user;

  @ManyToOne
  @JoinColumn(name = "fk_language_id", nullable = false)
  private Language language;

  @OneToMany(mappedBy = "userLanguage", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Activity> activities;
}
