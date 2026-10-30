package req1964.somnilingua.enrollment.controller;

import java.util.List;
import org.junit.jupiter.api.Test;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import req1964.somnilingua.cefr.dto.CefrProgressResponse;
import req1964.somnilingua.enrollment.dto.ActivityStatsResponse;
import req1964.somnilingua.enrollment.dto.CreateEnrollmentRequest;
import req1964.somnilingua.enrollment.dto.LanguageEnrollmentResponse;
import req1964.somnilingua.enrollment.dto.LanguageEnrollmentsSearchRequest;
import req1964.somnilingua.enrollment.service.EnrollmentService;
import req1964.somnilingua.language.dto.LanguageResponse;
import req1964.somnilingua.shared.dto.PageResponse;
import req1964.somnilingua.shared.exception.ConflictException;
import req1964.somnilingua.shared.exception.GlobalExceptionHandler;
import req1964.somnilingua.shared.exception.ResourceNotFoundException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EnrollmentController.class)
@Import(GlobalExceptionHandler.class)
@AutoConfigureMockMvc(addFilters = false)
class EnrollmentControllerTest {

  @Autowired
  MockMvc mockMvc;

  @MockitoBean
  EnrollmentService enrollmentService;

  ObjectMapper objectMapper = new ObjectMapper();

  @Test
  void createEnrollment_returns204() throws Exception {
    CreateEnrollmentRequest request = new CreateEnrollmentRequest(1L, 42, 10);

    doNothing().when(enrollmentService).enroll(any(CreateEnrollmentRequest.class));

    mockMvc.perform(post("/api/enrollments")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status()
            .isNoContent());
  }

  @Test
  void createEnrollment_withInvalidData_returns400_withValidation_Errors() throws Exception {
    CreateEnrollmentRequest invalidRequest = new CreateEnrollmentRequest(1L, -10, -10);

    mockMvc.perform(post("/api/enrollments")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(invalidRequest)))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.fieldErrors.starterMinutes").exists())
        .andExpect(jsonPath("$.fieldErrors.dailyGoalMinutes").exists())
    ;
  }

  @Test
  void createEnrollment_withDuplicateData_returns409() throws Exception {
    CreateEnrollmentRequest request =
        new CreateEnrollmentRequest(1L, 42, 10);

    doThrow(new ConflictException("Already enrolled"))
        .when(enrollmentService)
        .enroll(any(CreateEnrollmentRequest.class));

    mockMvc.perform(
            post("/api/enrollments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
        )
        .andExpect(status().isConflict());
  }

  @Test
  void createEnrollment_withLanguageNotExists_returns404() throws Exception {
    CreateEnrollmentRequest request =
        new CreateEnrollmentRequest(1000L, 42, 10);

    doThrow(new ResourceNotFoundException("Language", 1000L))
        .when(enrollmentService)
        .enroll(any(CreateEnrollmentRequest.class));

    mockMvc.perform(
            post("/api/enrollments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
        )
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.message").value("Language not found with id: 1000"));
  }

  @Test
  void createEnrollment_withUserNotExists_returns404() throws Exception {
    CreateEnrollmentRequest request =
        new CreateEnrollmentRequest(10L, 42, 10);

    doThrow(new ResourceNotFoundException("User", 1L))
        .when(enrollmentService)
        .enroll(any(CreateEnrollmentRequest.class));

    mockMvc.perform(
            post("/api/enrollments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
        )
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.message").value("User not found with id: 1"));
  }

  @Test
  void getEnrollments_returnsPaginatedEnrollmentData() throws Exception {
    LanguageEnrollmentResponse enrollment = LanguageEnrollmentResponse.builder()
        .id(10L)
        .dailyGoalMinutes(30)
        .language(LanguageResponse.builder()
            .id(1L)
            .name("English")
            .code("en")
            .build())
        .activityStats(new ActivityStatsResponse(20L, 100L))
        .cefrProgress(CefrProgressResponse.builder()
            .currentLevel("A1")
            .nextLevel("A2")
            .minutesUntilNextLevel(8900L)
            .progressPercent(1)
            .build())
        .build();

    PageResponse<LanguageEnrollmentResponse> response = new PageResponse<>(
        List.of(enrollment),
        new PageResponse.Meta(0, 10, 1, 1)
    );

    when(enrollmentService.getPaginatedLanguageEnrollments(any(LanguageEnrollmentsSearchRequest.class)))
        .thenReturn(response);

    mockMvc.perform(get("/api/enrollments")
            .param("page", "0")
            .param("size", "10")
            .param("sort", "name,asc"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data[0].id").value(10))
        .andExpect(jsonPath("$.data[0].dailyGoalMinutes").value(30))
        .andExpect(jsonPath("$.data[0].language.code").value("en"))
        .andExpect(jsonPath("$.data[0].activityStats.todayMinutes").value(20))
        .andExpect(jsonPath("$.data[0].activityStats.totalMinutes").value(100))
        .andExpect(jsonPath("$.data[0].cefrProgress.currentLevel").value("A1"))
        .andExpect(jsonPath("$.meta.page").value(0))
        .andExpect(jsonPath("$.meta.size").value(10))
        .andExpect(jsonPath("$.meta.totalElements").value(1))
        .andExpect(jsonPath("$.meta.totalPages").value(1));
  }

}
