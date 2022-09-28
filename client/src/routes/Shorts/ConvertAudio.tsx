import { createFFmpeg } from '@ffmpeg/ffmpeg';
import { useRef, useState } from 'react';

interface ConvertType {
  start: number;
  end: number;
  m4a: any;
}

const ConvertAudio = (props: ConvertType) => {
  const { start, end, m4a } = props;
  const [message, setMessage] = useState('Click Start to import');
  const [downloadLink, setDownloadLink] = useState('');
  const ffmpeg = createFFmpeg({
    log: true,
  });

  const doImport = async () => {
    setMessage('Loading ffmpeg-core.js');
    await ffmpeg.load();
    if (m4a) {
      console.log(m4a);
      ffmpeg.FS(
        'writeFile',
        'test.m4a',
        new Uint8Array(await m4a.arrayBuffer()),
      );
      setMessage('Start Import');
      const args = [
        '-ss',
        `${start}ms`,
        '-i',
        'test.m4a',
        '-t',
        `${end - start}ms`,
        '-acodec',
        'copy',
        'output.m4a',
      ];
      await ffmpeg.run(...args);
      setMessage('Complete Import');
      const data = ffmpeg.FS('readFile', 'output.m4a');
      console.log(data);
      URL.revokeObjectURL(downloadLink);
      setDownloadLink(
        URL.createObjectURL(new Blob([data.buffer], { type: 'audio' })),
      );
    } else {
      setMessage('Can not Import. need file check. 😪');
    }
  };
  return (
    <>
      <button onClick={doImport}>Start</button>
      <p>{message}</p>
      {downloadLink.length !== 0 && (
        <a href={downloadLink} download="result.m4a">
          download
        </a>
      )}
    </>
  );
};

export default ConvertAudio;
