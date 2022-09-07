package com.singsong.common.auth;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

/**
 * 현재 액세스 토큰으로 부터 인증된 유저의 부가 상세정보(활성화 여부, 만료, 롤 등) 정의.
 */
public class MemberDetails implements UserDetails {
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return null;
	}

	@Override
	public String getPassword() {
		return null;
	}

	@Override
	public String getUsername() {
		return null;
	}

	@Override
	public boolean isAccountNonExpired() {
		return false;
	}

	@Override
	public boolean isAccountNonLocked() {
		return false;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return false;
	}

	@Override
	public boolean isEnabled() {
		return false;
	}
//	@Autowired
//	Member member;
//	boolean accountNonExpired;
//    boolean accountNonLocked;
//    boolean credentialNonExpired;
//    boolean enabled = false;
//    List<GrantedAuthority> roles = new ArrayList<>();
//
//    public MemberDetails(Member member) {
//    		super();
//    		this.member = member;
//    }
//
//    public Member getUser() {
//    		return this.member;
//    }
////	public Long getMemberSeq() { return this.member.getSeq();}
//
////	public String getMemberId() {return this.member.getMemberId();}
//
////	public String getMemberNickname() {return this.member.getNickname();}
//	@Override
//	public String getPassword() {
//		return null;
////		return this.member.getPwd();
//	}
//	@Override
//	public String getUsername() {
//		return null;
////		return this.member.getMemberId();
//	}
//	@Override
//	public boolean isAccountNonExpired() {
//		return this.accountNonExpired;
//	}
//	@Override
//	public boolean isAccountNonLocked() {
//		return this.accountNonLocked;
//	}
//	@Override
//	public boolean isCredentialsNonExpired() {
//		return this.credentialNonExpired;
//	}
//	@Override
//	public boolean isEnabled() {
//		return this.enabled;
//	}
//	@Override
//	public Collection<? extends GrantedAuthority> getAuthorities() {
//		return this.roles;
//	}
//	public void setAuthorities(List<GrantedAuthority> roles) {
//		this.roles = roles;
//	}
}
