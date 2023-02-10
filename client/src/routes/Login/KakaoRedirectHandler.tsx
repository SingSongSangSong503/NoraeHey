import axios from 'axios';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BASE_URL = window.location.href.split('/')[2];
const REDIRECT_URL =
  BASE_URL === 'localhost:3000'
    ? 'https://t8c01.p.ssafy.io/api/v1/kakao/callback2'
    : 'https://t8c01.p.ssafy.io/api/v1/kakao/callback';

const KakaoRedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const KAKAO_CODE = location.search.split('=')[1];

  const tokenRequest = async () => {
    const result = await axios.get(`${REDIRECT_URL}?code=${KAKAO_CODE}`);
    const { accessToken, refreshToken } = result.data;
    localStorage.setItem('refreshToken', refreshToken);
    sessionStorage.setItem('accessToken', accessToken);
    navigate('/');
  };

  useEffect(() => {
    tokenRequest();
  }, []);
  return <></>;
};

export default KakaoRedirectHandler;
