package req1964.somnilingua.enrollment.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record ActivityStatsResponse(
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    long todayMinutes,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    long totalMinutes) {
}
