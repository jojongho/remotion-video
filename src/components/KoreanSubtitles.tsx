import { loadFont as loadBlackHanSans } from '@remotion/google-fonts/BlackHanSans';
import { loadFont as loadNotoSansKR } from '@remotion/google-fonts/NotoSansKR';
import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// Load fonts
const { fontFamily: blackHanSans } = loadBlackHanSans();
const { fontFamily: notoSans } = loadNotoSansKR();

// ------------------------------------------------------------------
// 1. YouTube Emphasis Subtitle - "붙박이장 기본제공!!"
// ------------------------------------------------------------------
export const YouTubeEmphasisSubtitle: React.FC<{
  text: string;
  subText?: string;
  theme?: 'red' | 'yellow' | 'gradient';
}> = ({ text, subText, theme = 'red' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    fps,
    frame,
    config: { damping: 12, stiffness: 200 },
  });

  const mainColor = theme === 'red' ? '#ffffff' : theme === 'yellow' ? '#FFF500' : '#ffffff';
  const shadowColor = theme === 'red' ? '#D50000' : '#000000';
  const outline = `-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000`;
  const blockShadow = `4px 4px 0 ${shadowColor}, 5px 5px 0 ${shadowColor}, 6px 6px 0 ${shadowColor}, 7px 7px 0 ${shadowColor}, 8px 8px 0 ${shadowColor}, 9px 9px 0 #000, 10px 10px 0 #000`;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '15%',
        width: '100%',
        textAlign: 'center',
        fontFamily: blackHanSans,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          fontSize: 100,
          color: mainColor,
          textShadow: `${outline}, ${blockShadow}`,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
        }}
      >
        {text}
      </div>
      {subText && (
        <div
          style={{
            fontSize: 50,
            color: '#ffffff',
            marginTop: 10,
            textShadow: `-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 4px 4px 0 #111`,
          }}
        >
          {subText}
        </div>
      )}
    </div>
  );
};

// ------------------------------------------------------------------
// 2. Space Entry Subtitle - "공용욕실 / 건식 세면대 분리형"
// ------------------------------------------------------------------
export const SpaceEntrySubtitle: React.FC<{
  title: string;
  subtitle: string;
}> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ fps, frame, config: { damping: 15 } });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [30, 0]);

  const lineProgress = spring({ fps, frame, delay: 10, config: { damping: 20 } });
  const lineWidth = interpolate(lineProgress, [0, 1], [0, 100]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '10%',
        left: '8%',
        fontFamily: notoSans,
        opacity,
        transform: `translateY(${translateY}px)`,
        color: 'white',
        textShadow: '0px 2px 10px rgba(0,0,0,0.5)',
      }}
    >
      <div style={{ fontSize: 70, fontWeight: 800, marginBottom: 10 }}>
        {title}
      </div>
      <div
        style={{
          height: 4,
          backgroundColor: 'white',
          width: `${lineWidth}%`,
          marginBottom: 15,
          boxShadow: '0px 2px 4px rgba(0,0,0,0.3)',
        }}
      />
      <div style={{ fontSize: 36, fontWeight: 500, letterSpacing: '0.05em' }}>
        {subtitle}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// 3. Sliding Info Panel - "핵심 포인트 ① / 거실 양창"
// ------------------------------------------------------------------
export const SlidingInfoPanel: React.FC<{
  brandName: string;
  pointNumber: number;
  mainTitle: string;
  description: string;
  direction?: 'left' | 'right';
}> = ({ brandName, pointNumber, mainTitle, description, direction = 'left' }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const isLeft = direction === 'left';

  const slideProgress = spring({
    fps,
    frame,
    config: { damping: 14, stiffness: 100 },
  });

  const panelWidth = width * 0.45;
  const startX = isLeft ? -panelWidth : width;
  const endX = isLeft ? 0 : width - panelWidth;
  
  const translateX = interpolate(slideProgress, [0, 1], [startX, endX]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: panelWidth,
        transform: `translateX(${translateX}px)`,
        background: isLeft 
          ? 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 80%, transparent 100%)'
          : 'linear-gradient(to left, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 80%, transparent 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: isLeft ? '0 50px 0 8%' : '0 8% 0 50px',
        color: 'white',
        fontFamily: notoSans,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ backgroundColor: '#FF6B00', padding: '5px 15px', borderRadius: 4, fontWeight: 700, fontSize: 24, marginRight: 10 }}>
          아산탕정
        </div>
        <div style={{ fontSize: 24, fontWeight: 500 }}>{brandName}</div>
      </div>

      <div style={{ fontSize: 55, fontWeight: 800, marginBottom: 30, display: 'flex', alignItems: 'center' }}>
        핵심 포인트 
        <span style={{ 
          display: 'inline-flex', justifyContent: 'center', alignItems: 'center',
          width: 50, height: 50, borderRadius: '50%', border: '3px solid white', 
          marginLeft: 15, fontSize: 35 
        }}>
          {pointNumber}
        </span>
      </div>

      <div style={{ fontSize: 80, fontWeight: 900, color: '#FFF500', marginBottom: 40, fontFamily: blackHanSans }}>
        {mainTitle}
      </div>

      <div style={{ fontSize: 36, fontWeight: 400, lineHeight: 1.4, color: '#E5E7EB' }}>
        {description.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
