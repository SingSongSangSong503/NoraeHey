package com.singsong.api.service;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.singsong.common.exception.code.ErrorCode;
import com.singsong.common.exception.member.MemberNotFoundException;
import com.singsong.common.model.response.KakaoMemberInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

@Service
public class KakaoServiceImpl implements KakaoService {

    @Value("${kakao.restkey}")
    String kakaoRestKey;

    @Override
    public String getKakaoAccessToken(String code) throws IOException {
        String accessToken = "";
        String refreshToken = "";
        String reqURL = "https://kauth.kakao.com/oauth/token";

        URL url = new URL(reqURL);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("POST");
        conn.setDoOutput(true);

        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
        StringBuffer sb = new StringBuffer();

        sb.append("grant_type=authorization_code");
        sb.append("&client_id=" + kakaoRestKey);
        sb.append("&redirect_uri=https://t8c01.p.ssafy.io/kakao/callback");
//        sb.append("&redirect_uri=http://localhost:3000/kakao/callback"); // TODO: 인가코드 받은 redirect_uri 입력
//        sb.append("&redirect_uri=http://localhost:8081/api/v1/kakao/callback");
        sb.append("&code=" + code);
        bw.write(sb.toString());
        bw.flush();

        // 성공 시 200, 실패 시 400
        // TODO: 실패 시 예외처리
        int responseCode = conn.getResponseCode();
        System.out.println("responseCode : " + responseCode);

        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        String line = "";
        String result = "";

        while ((line = br.readLine()) != null) {
            result += line;
        }
        System.out.println("response body : " + result);

        //Gson 라이브러리에 포함된 클래스로 JSON파싱 객체 생성
        JsonParser parser = new JsonParser();
        JsonElement element = parser.parse(result);

        accessToken = element.getAsJsonObject().get("access_token").getAsString();
        refreshToken = element.getAsJsonObject().get("refresh_token").getAsString();

        System.out.println("accessToken : " + accessToken);
        System.out.println("refreshToken : " + refreshToken);

        br.close();
        bw.close();


        return accessToken;
    }

    @Override
    public String getKakaoAccessToken2(String code) throws IOException {
        String accessToken = "";
        String refreshToken = "";
        String reqURL = "https://kauth.kakao.com/oauth/token";

        URL url = new URL(reqURL);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("POST");
        conn.setDoOutput(true);

        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
        StringBuffer sb = new StringBuffer();

        sb.append("grant_type=authorization_code");
        sb.append("&client_id=" + kakaoRestKey);
        sb.append("&redirect_uri=http://localhost:3000/kakao/callback"); // TODO: 인가코드 받은 redirect_uri 입력
//        sb.append("&redirect_uri=http://localhost:8081/api/v1/kakao/callback");
        sb.append("&code=" + code);
        bw.write(sb.toString());
        bw.flush();

        // 성공 시 200, 실패 시 400
        // TODO: 실패 시 예외처리
        int responseCode = conn.getResponseCode();
        System.out.println("responseCode : " + responseCode);

        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        String line = "";
        String result = "";

        while ((line = br.readLine()) != null) {
            result += line;
        }
        System.out.println("response body : " + result);

        //Gson 라이브러리에 포함된 클래스로 JSON파싱 객체 생성
        JsonParser parser = new JsonParser();
        JsonElement element = parser.parse(result);

        accessToken = element.getAsJsonObject().get("access_token").getAsString();
        refreshToken = element.getAsJsonObject().get("refresh_token").getAsString();

        System.out.println("accessToken : " + accessToken);
        System.out.println("refreshToken : " + refreshToken);

        br.close();
        bw.close();


        return accessToken;
    }

    public KakaoMemberInfo getKakaoEmailAndKakaoId(String accessToken) throws IOException {
        String reqURL = "https://kapi.kakao.com/v2/user/me";
        //accessToken을 이용하여 사용자 정보 조회
        URL url = new URL(reqURL);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("POST");
        conn.setDoOutput(true);
        conn.setRequestProperty("Authorization", "Bearer " + accessToken); //전송할 header 작성, access_token전송

        //결과 코드가 200이라면 성공
        int responseCode = conn.getResponseCode();
        System.out.println("responseCode : " + responseCode);

        //요청을 통해 얻은 JSON타입의 Response 메세지 읽어오기
        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        String line = "";
        String result = "";

        while ((line = br.readLine()) != null) {
            result += line;
        }
        System.out.println("response body : " + result);

        //Gson 라이브러리로 JSON파싱
        JsonParser parser = new JsonParser();
        JsonElement element = parser.parse(result);

        String email = "";
        Long id = element.getAsJsonObject().get("id").getAsLong();
        boolean hasEmail = element.getAsJsonObject().get("kakao_account").getAsJsonObject().get("has_email").getAsBoolean();
        if (hasEmail) {
            email = element.getAsJsonObject().get("kakao_account").getAsJsonObject().get("email").getAsString();
        }

        System.out.println("id : " + id);
        System.out.println("email : " + email);

        br.close();
        
        // 1. 이메일이 DB에 있는지 없는지 검색
        // 2-1. 이미 존재하는 이메일 (이미 가입된 회원) -> accessToken, refreshToken 생성 후 전달
        // 2-2. 없는 이메일 -> 회원 가입 후 accessToken, refreshToken 생성 후 전달
        KakaoMemberInfo kakaoMemberInfo = KakaoMemberInfo.builder()
                .email(email)
                .id(id)
                .build();

        return kakaoMemberInfo;
    }
}
