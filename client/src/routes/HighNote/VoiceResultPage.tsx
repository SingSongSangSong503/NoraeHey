import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { userInfoState } from '../../Atom';
import { keyList } from '../../utils/constants/constants';
import { FiArrowLeft } from 'react-icons/fi';

const setScreenSize = () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};
setScreenSize();
window.addEventListener('resize', () => setScreenSize());

const VoiceResultPage = () => {
  const navigate = useNavigate();
  const user = useRecoilValue(userInfoState);

  return (
    <ResultContainer>
      <Title>
        <p className={'title2'}>측정결과</p>
        <p className={'title2'}>{keyList[user.memberHighPitch]}</p>
      </Title>
      <Button onClick={() => navigate('/')}>
        <a>노래Hey로 떠나기</a>
      </Button>
      <Footer onClick={() => navigate('/voice')}>
        <FiArrowLeft />
        <a>재측정하기</a>
      </Footer>
    </ResultContainer>
  );
};

const ResultContainer = styled.div`
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  background: ${(props) => props.theme.colors.gradientPurpleToYellow};
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

const Title = styled.div`
  position: relative;
  width: 100%;
  max-width: 420px;
  font-size: 20px;
  font-family: 'omni035';
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 60px;
  text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);
  p {
    position: relative;
  }
  .title1 {
    animation: fadeIn 1s ease-in;
  }
  .title2 {
    top: -10px;
    font-size: 60px;
    animation: fadeIn 1.5s ease-in forwards;
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      top: 0px;
      opacity: 1;
    }
  }
`;

const Footer = styled.div`
  font-size: 20px;
  width: 100%;
  position: fixed;
  color: white;
  top: 0;
  padding: 30px;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  svg {
    position: relative;
    top: -2px;
  }
`;

const Button = styled.div`
  gap: 20px;
  padding: 20px;
  font-size: 20px;
  color: white;
  border-radius: 30px;
  background: linear-gradient(180deg, #a793fe 0%, #9278ff 100%);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);
`;

export default VoiceResultPage;