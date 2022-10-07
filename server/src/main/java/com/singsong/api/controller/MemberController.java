package com.singsong.api.controller;

import com.singsong.api.request.TagPostReq;
import com.singsong.api.response.MemberInfoRes;
import com.singsong.api.response.MemberTokenRes;
import com.singsong.api.response.MyInfoRes;
import com.singsong.api.service.MemberService;
import com.singsong.api.service.TagService;
import com.singsong.common.exception.code.ErrorCode;
import com.singsong.common.exception.member.MemberImageNotFoundException;
import com.singsong.common.util.JwtAuthenticationUtil;
import com.singsong.common.util.JwtTokenUtil;
import com.singsong.common.util.S3Util;
import com.singsong.common.util.auth.MemberDetails;
import com.singsong.db.entity.Member;
import com.singsong.db.entity.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import springfox.documentation.annotations.ApiIgnore;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/member")
public class MemberController {

    @Autowired
    JwtAuthenticationUtil jwtAuthenticationUtil;
    @Autowired
    MemberService memberService;

    @Autowired
    TagService tagService;

    @Autowired
    S3Util s3Util;

    @GetMapping("/refresh")
    public ResponseEntity<?> tokenRefresh(@RequestHeader(value = "REFRESH-TOKEN") String refreshToken) {

        Map<String, String> tokens = memberService.modifyRefreshToken(refreshToken);

        MemberTokenRes memberTokenRes = MemberTokenRes.builder()
                .accessToken(tokens.get("accessToken"))
                .refreshToken(tokens.get("refreshToken"))
                .build();

        return ResponseEntity.status(200).body(memberTokenRes);
    }

    @GetMapping("/info")
    public ResponseEntity<?> myInfoDetail(@ApiIgnore Authentication authentication) {
        Member member = jwtAuthenticationUtil.jwtTokenAuth(authentication);
        List<Tag> tags = tagService.getMyInfo(member);

        MyInfoRes myInfoRes = MyInfoRes.builder()
                .memberId(member.getMemberId())
                .memberEmail(member.getMemberEmail())
                .memberNickname(member.getMemberNickname())
                .memberHighPitch(member.getMemberHighPitch())
                .memberProfileUrl(member.getMemberProfileUrl())
                .memberTagList(tags)
                .build();

        return ResponseEntity.status(200).body(myInfoRes);
    }

    @GetMapping("/nickname/{nickname}")
    public ResponseEntity<?> nickNameValidate(@PathVariable String nickname) {

        memberService.getMemberByNickname(nickname);

        return ResponseEntity.status(200).build();
    }

    @PatchMapping("/nickname")
    public ResponseEntity<?> nickNameModify(@ApiIgnore Authentication authentication,
                                            @RequestBody Map<String, String> req) {
        MemberDetails memberDetails = (MemberDetails) authentication.getDetails();
        Member member = memberDetails.getUser();
        memberService.modifyNickName(member, req.get("nickname"));

        return ResponseEntity.status(200).build();
    }

    @PatchMapping("/profileimg")
    public ResponseEntity<?> profileModify(@ApiIgnore Authentication authentication, @RequestPart MultipartFile profileImg) throws IOException {
        Member member = jwtAuthenticationUtil.jwtTokenAuth(authentication);
        String s3Url = s3Util.uploadMemberProfileImageFile(profileImg, member.getMemberId());

        String memberImageUrl = member.getMemberProfileUrl();
        if (memberImageUrl == null) throw new MemberImageNotFoundException("member image not found", ErrorCode.MEMBER_IMAGE_NOT_FOUND);
        // 기본 이미지가 아니라면 삭제 (url의 56번째에 폴더 명 (기본 이미지는 폴더 명 0))
//        if (memberImageUrl.charAt(56) != '0') s3Util.deleteFile(memberImageUrl.substring(49));
        memberService.modifyProfile(member, s3Url);

        return ResponseEntity.status(200).build();
    }

    @PatchMapping("/delete")
    public ResponseEntity<?> memberRemove(@ApiIgnore Authentication authentication) {
        Member member = jwtAuthenticationUtil.jwtTokenAuth(authentication);
        memberService.removeMember(member);

        return ResponseEntity.status(200).build();
    }

    @PatchMapping("/tag")
    public ResponseEntity<?> memberTagAdd(@RequestBody TagPostReq tagPostReq, @ApiIgnore Authentication authentication) {
        Member member = jwtAuthenticationUtil.jwtTokenAuth(authentication);
        tagService.modifyMemberTags(member, tagPostReq.getTagIdList());

        return ResponseEntity.status(200).build();
    }

    @PatchMapping("/highpitch")
    public ResponseEntity<?> highPitchModifiy(@RequestParam(value = "highpitch") int highPitch, @ApiIgnore Authentication authentication) {
        MemberDetails memberDetails = (MemberDetails) authentication.getDetails();
        Member member = memberDetails.getUser();

        memberService.modifyHighPitch(member, highPitch);

        return ResponseEntity.status(200).build();
    }

    @GetMapping("/info/{memberId}")
    public ResponseEntity<?> memberDetail(@PathVariable Long memberId) {

        Member member = memberService.getMemberInfoRes(memberId);

        MemberInfoRes memberInfoRes = MemberInfoRes.builder()
                .memberNickname(member.getMemberNickname())
                .memberProfileUrl(member.getMemberProfileUrl())
                .memberHighPitch(member.getMemberHighPitch())
                .build();

        return ResponseEntity.status(200).body(memberInfoRes);
    }

    //Todo: 개발 끝나면 삭제
    @GetMapping("/login")
    public ResponseEntity<?> devLogin() {
        Member member = memberService.getMemberByMemberEmail("kst5428136@naver.com");

       // Todo : 유저 늘릴때 이거 쓰면될듯?
//        if (member == null) {
//            member = memberService.createMember(kakaoMemberInfo);
//        }

        // accessToken, refreshToken 생성
        Map<String, String> tokens = JwtTokenUtil.generateTokenSet(member.getMemberEmail());

        // refreshToken DB에 초기화
        memberService.saveRefreshToken(member, tokens.get("refreshToken"));

        MemberTokenRes memberTokenRes = MemberTokenRes.builder()
                .accessToken(tokens.get("accessToken"))
                .refreshToken(tokens.get("refreshToken"))
                .build();

        return ResponseEntity.status(200).body(memberTokenRes);
    }

}
