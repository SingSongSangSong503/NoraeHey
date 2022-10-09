import styled, { css, keyframes } from 'styled-components';
import {
  AiFillHeart,
  AiOutlineHeart,
  AiFillPauseCircle,
  AiFillPlayCircle,
} from 'react-icons/ai';
import { useEffect, useState } from 'react';
import { fetchData } from '../../utils/api/api';
import getCreatedTime from '../../utils/getCreatedTime';
import { useNavigate } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';
import { userInfoState } from '../../Atom';
import { useRecoilValue } from 'recoil';
export interface shortsDetailType {
  shortsId: number;
  shortsComment: string;
  shortsAudioUrl: string;
  shortsCreateTime: string;
  songId: number;
  songTitle: string;
  songSinger: string;
  songHighPitch: number;
  songImageUrl: string;
  songTj: string;
  songKy: string;
  memberId: number;
  memberNickname: string;
  memberProfileUrl: string;
  likeCount: number;
  isLiked: boolean;
}

const ShortsModalCard = (props: any) => {
  const { shortsData } = props;
  const [audio, setAudio] = useState(new Audio(shortsData.shortsAudioUrl));
  const [isPlay, setIsPlay] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const createdTime = getCreatedTime(shortsData.shortsCreateTime);
  const memberId = useRecoilValue(userInfoState).memberId;
  const navigate = useNavigate();

  useEffect(() => {
    setLikeCount(shortsData.likeCount);
    setLiked(shortsData.liked);
  }, [props]);

  const start = () => {
    console.log('start');
    audio.play();
    audio.loop = true;
  };

  const stop = () => {
    console.log('stop');
    audio.pause();
    audio.loop = false;
  };

  useEffect(() => {
    return isPlay ? start() : stop();
  }, [isPlay]);

  return (
    <>
      <ShortsCard>
        <Profile>
          <img
            src={shortsData.memberProfileUrl}
            alt=""
            onClick={() => {
              navigate(`/profile/${shortsData.memberId}`);
            }}
          />
          <div>
            <p>{shortsData.memberNickname}</p>
            <span>{createdTime}</span>
          </div>
          <IoClose
            size={32}
            onClick={() => {
              navigate(-1);
            }}
          />
        </Profile>
        <Album
          play={isPlay}
          onClick={() => {
            setIsPlay(!isPlay);
          }}>
          <div>
            <i></i>
            <img src={shortsData.songImageUrl} alt="" />
            {isPlay ? (
              <AiFillPauseCircle size={70} />
            ) : (
              <AiFillPlayCircle size={70} />
            )}
          </div>
        </Album>
        <SongInfo>
          <p>{shortsData.songTitle}</p>
          <p>{shortsData.songSinger}</p>
        </SongInfo>
        <Content>{shortsData.shortsComment}</Content>
        <LikeHeart>
          {memberId === shortsData.memberId && (
            <p
              onClick={() => {
                if (window.confirm('삭제하시겠습니까?')) {
                  fetchData
                    .delete(`/api/v1/shorts`, {
                      data: { shortsId: shortsData.shortsId },
                    })
                    .then(() => {
                      navigate('/');
                    });
                }
              }}>
              삭제
            </p>
          )}
          <div className="heart">
            {liked ? (
              <AiFillHeart
                size={30}
                color={'#f47b73'}
                onClick={() => {
                  fetchData
                    .delete(`/api/v1/shorts/like`, {
                      data: {
                        shortsId: shortsData.shortsId,
                      },
                    })
                    .then((res) => {
                      setLikeCount(res.data.likeCount);
                      setLiked(res.data.liked);
                    });
                }}
              />
            ) : (
              <AiOutlineHeart
                size={30}
                color={'#f47b73'}
                onClick={() => {
                  fetchData
                    .post(`/api/v1/shorts/like`, {
                      shortsId: shortsData.shortsId,
                    })
                    .then((res) => {
                      setLikeCount(res.data.likeCount);
                      setLiked(res.data.liked);
                    });
                }}
              />
            )}

            <p>{likeCount}</p>
          </div>
        </LikeHeart>
      </ShortsCard>
    </>
  );
};

const ShortsCard = styled.div`
  width: 90%;
  min-height: 500px;
  height: 90%;
  max-height: 750px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  position: relative;
  border-radius: 20px;
  background: linear-gradient(
    153.96deg,
    #ebe7ff 5.39%,
    #ffffff 53.42%,
    #e9e4ff 98.54%
  );
`;
const SongInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 0;
  gap: 5px;
  word-break: break-all;
  text-align: center;
  p:first-child {
    font-size: 18px;
  }
  p:last-child {
    font-size: 14px;
    color: ${(props) => props.theme.colors.textGray};
  }
`;
const Profile = styled.div`
  display: flex;
  width: 100%;
  padding-bottom: 10px;
  justify-content: space-between;
  align-items: center;
  gap: 20px;

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
  }
  & > div {
    display: flex;
    flex-grow: 1;
    gap: 8px;
    align-items: center;
    & > span {
      font-size: 12px;
      color: ${(props) => props.theme.colors.textGray};
    }
  }
  svg {
    align-self: flex-start;
    cursor: pointer;
    &:active {
      scale: 0.95;
      opacity: 0.8;
    }
  }
`;
const boxFade = keyframes`
  0% {
    transform:translate(-50%, -50%) scale(0,0);
    opacity: 0;
  }
  50% {
    transform:translate(-50%, -50%) scale(1,1);
    opacity: 1;
  }
  100% {
    
    opacity: 0;
  }
`;
const boxFade2 = keyframes`
  0% {
    transform:translate(-50%, -50%) scale(0,0);
    opacity: 0;
  }
  100% {
    transform:translate(-50%, -50%) scale(1,1);
    opacity: 1;
  }
 
`;
const Album = styled.div<{ play: boolean }>`
  position: relative;
  display: flex;
  justify-content: center;
  div {
    position: relative;
    svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: rgba(83, 83, 83, 0.7);
      animation: ${(props) =>
        props.play
          ? css`
              ${boxFade} 1s
            `
          : css`
              ${boxFade2} .5s
            `};
      opacity: ${(props) => (props.play ? 0 : 1)};
    }
    img {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      margin: 14px;
    }

    i {
      content: '';
      width: 228px;
      height: 228px;
      position: absolute;
      inset: 0;
      border-radius: 50%;
      padding: 8px;
      -webkit-mask: linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      mask: default;
      transition: 1s;
      ${(props) =>
        props.play &&
        css`
          animation: rotate 2s linear infinite;
          @keyframes rotate {
            100% {
              transform: rotate(1turn);
            }
          }
        `}
    }

    i::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 228px;
      height: 228px;
      background: ${(props) => props.theme.colors.gradientPurpleToYellow};
      transform: translate(-50%, -50%) rotate(45deg);
    }

    @keyframes rotate {
      from {
        -webkit-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      to {
        -webkit-transform: rotate(360deg);
        -o-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
  }
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  padding: 15px 0;
  height: 150px;
  text-align: center;
`;

const LikeHeart = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  & > p {
    font-size: 12px;
    flex-grow: 1;
    align-self: flex-end;
    color: gray;
    text-decoration: underline;
    cursor: pointer;
  }
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    p {
      font-size: 10px;
    }
  }
  .heart {
    cursor: pointer;
    &:active {
      scale: 0.95;
      opacity: 0.8;
    }
  }
`;
export default ShortsModalCard;
