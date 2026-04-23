import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { loadFont as loadNotoSansKR } from '@remotion/google-fonts/NotoSansKR';

const { fontFamily: notoSans } = loadNotoSansKR();

export const CtaOverlay: React.FC<{
  phone: string;
  label: string;
}> = ({ phone, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    fps,
    frame,
    config: { damping: 14, stiffness: 100 },
  });
  
  const translateX = interpolate(entrance, [0, 1], [300, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'flex-end', padding: '40px 50px' }}>
      <div
        style={{
          transform: `translateX(${translateX}px)`,
          opacity,
          backgroundColor: 'rgba(26, 54, 93, 0.9)', // Main Color: #1A365D
          padding: '15px 30px',
          borderRadius: '50px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          border: '3px solid #FF6B00', // Accent Color
          fontFamily: notoSans,
        }}
      >
        <div style={{ color: 'white', fontSize: 24, fontWeight: 500, marginRight: 20 }}>
          {label}
        </div>
        <div style={{ color: '#FF6B00', fontSize: 38, fontWeight: 800 }}>
          ☎ {phone}
        </div>
      </div>
    </AbsoluteFill>
  );
};
