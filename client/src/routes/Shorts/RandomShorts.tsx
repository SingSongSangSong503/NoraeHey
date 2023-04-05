import styled, { css } from 'styled-components';
import Container from '../../style/style';
import { IoClose } from 'react-icons/io5';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { shortsListState } from '../../Atom';
import { fetchData } from '../../utils/api/api';
import React from 'react';
import { shortsDetailType } from './ShortsDetailCard';
import ShortsDetailCard from './ShortsDetailCard';

const RandomShorts = () => {
  const [nowIndex, setNowIndex] = useState(0);
  const shortsDatas = useRecoilValue(shortsListState);
  const [play, setPlay] = useState(false);
  const audioRef = useRef(new Audio());
  let url = shortsDatas[nowIndex].shortsAudioUrl;
  const setScreenSize = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  setScreenSize();
  window.addEventListener('resize', () => setScreenSize());

  const handlePlay = () => {
    audioRef.current.play();
  }

  const handlePause = () => {
    audioRef.current.pause();
  }

  const handleAudio = ()=>{
    if(play){
      handlePlay();
    }
    else {
      handlePause();
    }
  };

  useEffect(()=>{
    audioRef.current.pause();
  },[]);

  useEffect(()=>{
    handleAudio();
  },[play]);

  useEffect(()=>{
    url = shortsDatas[nowIndex].shortsAudioUrl;
//     console.log(nowIndex);
    handleAudio();
  }, [nowIndex]);


  return (
    <Container>
      <audio src={url} ref={audioRef} loop></audio>
      <Shorts>
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          onActiveIndexChange={(swiper) => {
            setNowIndex(swiper.realIndex);
            // audio.pause();
          }}>
          {shortsDatas.map((item, i) => (
            <SwiperSlide
              key={i}
              style={{ display: 'flex', justifyContent: 'center' }}>
              <ShortsDetailCard
                key={i}
                shortsData={item}
                play={play}
                setPlay={setPlay}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Shorts>
    </Container>
  );
};

const Shorts = styled.div`
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  background-color: #242424;
  padding: 20px 0;
  display: flex;
  justify-content: center;
`;

export default RandomShorts;
