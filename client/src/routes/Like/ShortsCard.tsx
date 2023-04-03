import { useNavigate } from 'react-router';
import styled from 'styled-components';
import getCreatedTime from '../../utils/getCreatedTime';

const ShortsCard = (props: any) => {
  const { shorts } = props;
  const createdTime = getCreatedTime(shorts.shortsCreateTime);
  const navigate = useNavigate();
  return (
    <ShortsBox
      albumUrl={shorts.songImageUrl}
      onClick={() => {
        navigate(`/shorts/${shorts.shortsId}`);
      }}>
      <div>
        <div className="songInfo">
          <p className="title">{shorts.songTitle}</p>
          <p className="singer">{shorts.songSinger}</p>
        </div>
        <p className="time">{createdTime}</p>
      </div>
    </ShortsBox>
  );
};

const ShortsBox = styled.div<{ albumUrl: string }>`
  width: 100%;
  border: lightgrey 1px solid;
  aspect-ratio: 1;
  box-sizing: border-box;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  background-image: url(${({ albumUrl }) => albumUrl});
  background-size: 115%;
  background-position: center center;
  display: flex;
  align-items: flex-end;
  & > div {
    background-image: linear-gradient(
      rgba(255, 255, 255, 0) 0%,
      rgba(0, 0, 0, 0.9) 80%
    );
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 5px;
    padding-top: 25px;
    gap: 2px;
    p {
      font-size: 10px;
      color: white;
      font-family: 'omni025';
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: break-word;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .songInfo {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .title {
      font-size: 12px;
    }
    .singer {
      font-family: 'omni025';
      font-size: 10px;
      color: #ffd132;
    }
    .time {
      flex-shrink: 0;
      align-self: flex-end;
      color: ${(props) => props.theme.colors.lineGray};
    }
  }
`;

export default ShortsCard;
