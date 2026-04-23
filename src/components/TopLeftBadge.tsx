import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { loadFont as loadNotoSansKR } from '@remotion/google-fonts/NotoSansKR';

const { fontFamily: notoSans } = loadNotoSansKR();

export const TopLeftBadge: React.FC<{
  text1: string;
  text2: string;
}> = ({ text1, text2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    fps,
    frame,
    config: { damping: 14, stiffness: 100 },
  });
  
  const translateX = interpolate(entrance, [0, 1], [-300, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'flex-start', padding: '40px 50px' }}>
      <div
        style={{
          transform: `translateX(${translateX}px)`,
          opacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          fontFamily: notoSans,
        }}
      >
        <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
            <div style={{ backgroundColor: '#1A365D', color: 'white', padding: '8px 20px', borderRadius: 30, fontSize: 24, fontWeight: 700, boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                {text1}
            </div>
            <div style={{ backgroundColor: '#FF6B00', color: 'white', padding: '8px 20px', borderRadius: 30, fontSize: 24, fontWeight: 700, boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                {text2}
            </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
