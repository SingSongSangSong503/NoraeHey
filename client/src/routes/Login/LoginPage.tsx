import styled from 'styled-components';
import coupleSinging from '../../assets/images/coupleSinging.png';
import kakaoLogin from '../../assets/images/kakaoLogin.png';

const BASE_URL = window.location.href.split('/')[2];
const CLIENT_ID = '7751ec01f50361d6bce9db46f9383a9a';
const REDIRECT_URL =
  BASE_URL === 'localhost:3000'
    ? 'http://localhost:3000/kakao/callback'
    : 'https://t8c01.p.ssafy.io/kakao/callback';
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=code`;

const LoginPage = () => {
  const setScreenSize = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  setScreenSize();
  window.addEventListener('resize', () => setScreenSize());
  return (
    <LoginContainer>
      <TitleBox>
        <LeftBox>
          <p className={'no'}>노</p>
          <p className={'rae'}>래</p>
          <p className={'hey'}>해</p>
        </LeftBox>
        <RightBox>
          <p>
            당신이 부를수있는
            <br />
            최고의 노래를
            <br />
            찾아보세요
          </p>
          <ImgBox src={coupleSinging} />
        </RightBox>
      </TitleBox>
      <LoginBox>
        <a href={KAKAO_AUTH_URL}>
          <KakaoButton src={kakaoLogin} />
        </a>
      </LoginBox>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  background: ${(props) => props.theme.colors.gradientPurpleToYellow};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  gap: 30px;
`;

const TitleBox = styled.div`
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: start;
  box-sizing: border-box;
`;

const LeftBox = styled.div`
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  padding-left: 30px;
  align-items: start;
  background-color: transparent;
  .no {
    animation: fadeIn 2s forwards;
    font-size: 90px;
    color: white;
  }
  .rae {
    animation: fadeIn 3s forwards;
    padding: 0 25px;
    font-size: 90px;
    color: white;
  }
  .hey {
    animation: fadeIn 4s forwards;
    padding: 0 50px;
    font-size: 90px;
    color: white;
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
      top: 30px;
    }
    100% {
      opacity: 1;
      top: -10px;
    }
  }
`;

const RightBox = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;
  p {
    animation: fadeIn 3s forwards;
    font-family: 'omni025';
    margin-top: 3px;
    font-size: 20px;
    color: white;
  }
`;

const ImgBox = styled.img`
  position: relative;
  top: 30px;
  width: 150%;
  margin-left: 20px;
  animation: fadeIn 4s forwards;
`;

const LoginBox = styled.div`
  width: 100%;
  gap: 20px;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  p {
    font-size: 14px;
    font-family: 'omni025';
    border-bottom: 0.5px solid;
    color: #575757;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
  }
  a {
    width: 75%;
  }
`;

const KakaoButton = styled.img`
  width: 100%;
  cursor: pointer;
  &:active {
    scale: 0.95;
    opacity: 0.8;
  }
`;

export default LoginPage;
