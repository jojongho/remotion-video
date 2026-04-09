import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';

export const YouTubeShorts: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill className="bg-ipark-dark flex flex-col items-center justify-center p-8">
      <div className="text-white text-7xl font-bold font-['Pretendard'] text-shadow-md text-center leading-tight">
        YouTube Shorts
        <br />
        <span className="text-ipark-red">Template</span>
      </div>
      <div className="text-ipark-gray text-4xl mt-12">
        {width}x{height}
      </div>
    </AbsoluteFill>
  );
};
