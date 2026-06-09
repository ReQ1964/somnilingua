package req1964.somnilingua.language.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import req1964.somnilingua.language.dto.LanguageResponse;
import req1964.somnilingua.language.service.LanguageService;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(LanguageController.class)
class LanguageControllerTest {
  @Autowired
  MockMvc mockMvc;

  @MockitoBean
  LanguageService languageService;

  @Test
  void getLanguages_returnsLanguages() throws Exception {
    //given
    List<LanguageResponse> languages = List.of(LanguageResponse.builder().id(1L).name("Polish").code("PL").build());
    //when
    when(languageService.getLanguages()).thenReturn(languages);

    //then
    mockMvc.perform(get("/api/languages").contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.[0].id").value(1L))
        .andExpect(jsonPath("$.[0].name").value("Polish"))
        .andExpect(jsonPath("$.[0].code").value("PL"));
  }
}
