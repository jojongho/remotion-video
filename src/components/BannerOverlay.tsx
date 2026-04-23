import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate, Audio, staticFile } from 'remotion';
import { loadFont as loadNotoSansKR } from '@remotion/google-fonts/NotoSansKR';

const { fontFamily: notoSans } = loadNotoSansKR();

export const BannerOverlay: React.FC<{
  text: string;
}> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const entrance = spring({ fps, frame, config: { damping: 20 } });
  const exit = spring({ fps, frame: frame - (durationInFrames - 30), config: { damping: 20 } });
  
  const translateYIn = interpolate(entrance, [0, 1], [150, 0]);
  const translateYOut = interpolate(exit, [0, 1], [0, 150]);
  const opacityIn = interpolate(entrance, [0, 1], [0, 1]);
  const opacityOut = interpolate(exit, [0, 1], [1, 0]);
  
  const translateY = frame > durationInFrames - 30 ? translateYOut : translateYIn;
  const opacity = frame > durationInFrames - 30 ? opacityOut : opacityIn;

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
      
      <div
        style={{
          transform: `translateY(${translateY}px)`,
          opacity,
          backgroundColor: '#1A365D',
          width: '100%',
          padding: '30px 50px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 -10px 25px rgba(0,0,0,0.5)',
          borderTop: '5px solid #FF6B00',
          fontFamily: notoSans,
        }}
      >
        <div style={{ color: '#FFF500', fontSize: 45, fontWeight: 800, letterSpacing: '-0.02em', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};
