package com.singsong.api.controller;

import com.singsong.api.request.PyRecommendPostReq;
import com.singsong.api.response.RecommendRes;
import com.singsong.api.response.SongEntityRes;
import com.singsong.api.service.SongService;
import com.singsong.api.service.TagService;
import com.singsong.common.model.response.BaseResponseBody;
import com.singsong.common.util.JwtAuthenticationUtil;
import com.singsong.db.entity.Member;
import io.swagger.annotations.Api;
import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import springfox.documentation.annotations.ApiIgnore;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Api(value = "노래 추천 API", tags = {"Recommend"})
@RestController
@RequestMapping("/recommend")
public class RecommendController {

    @Autowired
    JwtAuthenticationUtil jwtAuthenticationUtil;

    @Autowired
    TagService tagService;

    @Autowired
    SongService songService;

    @GetMapping
    public ResponseEntity<?> recommendSongs(@ApiIgnore Authentication authentication) {
        Member member = jwtAuthenticationUtil.jwtTokenAuth(authentication);

        HashMap<String, Object> resultMap = new HashMap<>();

        // 1. 타임아웃 설정시 HttpComponentsClientHttpRequestFactory 객체를 생성합니다.
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        factory.setConnectTimeout(5000); // 타임아웃 설정 5초
        factory.setReadTimeout(5000); // 타임아웃 설정 5초

        //Apache HttpComponents : 각 호스트(IP와 Port의 조합)당 커넥션 풀에 생성가능한 커넥션 수
        HttpClient httpClient = HttpClientBuilder.create()
                .setMaxConnTotal(50)//최대 커넥션 수
                .setMaxConnPerRoute(20).build();
        factory.setHttpClient(httpClient);

        // 2. RestTemplate 객체를 생성합니다.
        RestTemplate restTemplate = new RestTemplate(factory);

        // HTTP Body로 들어갈 것들 만들기

        List<String> tagNameList = tagService.getTagNameList(member);

        PyRecommendPostReq pyRequest = PyRecommendPostReq.builder()
                .memberId(member.getMemberId())
                .memberHighPitch(member.getMemberHighPitch())
                .tagNameList(tagNameList)
                .build();

        // 4. 요청 URL을 정의해줍니다.
        String url = "https://t8c01.p.ssafy.io/api/v2/songs/recommend/";
//        String url = "http://localhost:8000/api/v2/songs/recommend/";

        // 5. postForEntity() 메소드로 api를 호출합니다.
        ResponseEntity<List> response = restTemplate.postForEntity(url, pyRequest, List.class);

        List<SongEntityRes> lowList = new ArrayList<>();
        List<SongEntityRes> fitList = new ArrayList<>();
        List<SongEntityRes> highList = new ArrayList<>();
        List<Map<String, Object>> resLowList = (List) response.getBody().get(0);
        List<Map<String, Object>> resFitList = (List) response.getBody().get(1);
        List<Map<String, Object>> resHighList = (List) response.getBody().get(2);
        for(int i = 0; i < resLowList.size();i++){
            lowList.add(SongEntityRes.builder()
                    .songId(Long.parseLong(String.valueOf(resLowList.get(i).get("songId"))))
                    .songTitle((String)resLowList.get(i).get("songTitle"))
                    .songSinger((String)resLowList.get(i).get("songSinger"))
                    .songImageUrl((String)resLowList.get(i).get("songImageUrl"))
                    .songHighPitch((int)resLowList.get(i).get("songHighPitch"))
                    .songTj((String)resLowList.get(i).get("songTj"))
                    .songKy((String)resLowList.get(i).get("songKy"))
                    .build());
        }
        for(int i = 0; i < resFitList.size();i++){
            fitList.add(SongEntityRes.builder()
                    .songId(Long.parseLong(String.valueOf(resFitList.get(i).get("songId"))))
                    .songTitle((String)resFitList.get(i).get("songTitle"))
                    .songSinger((String)resFitList.get(i).get("songSinger"))
                    .songImageUrl((String)resFitList.get(i).get("songImageUrl"))
                    .songHighPitch((int)resFitList.get(i).get("songHighPitch"))
                    .songTj((String)resFitList.get(i).get("songTj"))
                    .songKy((String)resFitList.get(i).get("songKy"))
                    .build());
        }
        for(int i = 0; i < resHighList.size();i++){
            highList.add(SongEntityRes.builder()
                    .songId(Long.parseLong(String.valueOf(resHighList.get(i).get("songId"))))
                    .songTitle((String)resHighList.get(i).get("songTitle"))
                    .songSinger((String)resHighList.get(i).get("songSinger"))
                    .songImageUrl((String)resHighList.get(i).get("songImageUrl"))
                    .songHighPitch((int)resHighList.get(i).get("songHighPitch"))
                    .songTj((String)resHighList.get(i).get("songTj"))
                    .songKy((String)resHighList.get(i).get("songKy"))
                    .build());
        }

        if(response.getStatusCode() == HttpStatus.OK){
            return ResponseEntity.status(200).body(RecommendRes.of(lowList, fitList, highList));
        } else
            return ResponseEntity.status(409).body(BaseResponseBody.of(409, "fail"));
    }
}
