package req1964.somnilingua.enrollment.controller;

import org.junit.jupiter.api.Test;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import req1964.somnilingua.enrollment.dto.CreateEnrollmentRequest;
import req1964.somnilingua.enrollment.service.EnrollmentService;
import req1964.somnilingua.shared.exception.ConflictException;
import req1964.somnilingua.shared.exception.GlobalExceptionHandler;
import req1964.somnilingua.shared.exception.ResourceNotFoundException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
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

    mockMvc.perform(post("/api/enrollments").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(request))).andExpect(status().isNoContent());
  }

  @Test
  void createEnrollment_withInvalidData_returns400_withValidation_Errors() throws Exception {
    CreateEnrollmentRequest invalidRequest = new CreateEnrollmentRequest(1L, 0, 0);

    mockMvc.perform(post("/api/enrollments").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(invalidRequest))).andExpect(status().isBadRequest())
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

}
