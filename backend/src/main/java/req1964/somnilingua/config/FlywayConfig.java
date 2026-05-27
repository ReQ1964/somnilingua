package req1964.somnilingua.config;

import org.flywaydb.core.Flyway;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

@Configuration
public class FlywayConfig {

  @Bean
  public Flyway flyway(DataSource dataSource) throws Exception {
    try (Connection conn = dataSource.getConnection();
         Statement stmt = conn.createStatement()) {
      stmt.execute("CREATE SCHEMA IF NOT EXISTS somnilingua");
    }

    Flyway flyway = Flyway.configure()
        .dataSource(dataSource)
        .schemas("somnilingua")
        .defaultSchema("somnilingua")
        .locations("classpath:db/migration")
        .baselineOnMigrate(true)
        .baselineVersion("0")
        .validateOnMigrate(true)
        .table("flyway_schema_history")
        .load();

    flyway.migrate();
    return flyway;
  }
}