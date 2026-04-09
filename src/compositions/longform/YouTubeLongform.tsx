import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';

export const YouTubeLongform: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill className="bg-ipark-dark flex items-center justify-center">
      <div className="text-white text-6xl font-bold font-['Pretendard'] text-shadow-md">
        YouTube Longform Template
      </div>
      <div className="text-ipark-gray text-3xl mt-8">
        {width}x{height}
      </div>
    </AbsoluteFill>
  );
};
