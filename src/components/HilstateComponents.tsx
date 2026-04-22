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
import { getCurrentCue } from '../data/hilstate-srt';

const { fontFamily: blackHanSans } = loadBlackHanSans();
const { fontFamily: notoSans } = loadNotoSansKR();

// ──────────────────────────────────────────────────────────────
// 1. 일반 자막 트랙 — SRT 타이밍에 맞춰 화면 하단에 표시
// ──────────────────────────────────────────────────────────────
export const SRTSubtitleTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = getCurrentCue(frame, fps);

  if (!cue) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 60,
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        maxWidth: '85%',
        fontFamily: notoSans,
        fontSize: 38,
        fontWeight: 600,
        color: '#ffffff',
        lineHeight: 1.45,
        textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,1)',
        backgroundColor: 'rgba(0,0,0,0.45)',
        borderRadius: 8,
        padding: '10px 24px',
        backdropFilter: 'blur(2px)',
      }}
    >
      {cue.text}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────
// 2. 타이틀 카드 — 섹션 도입부 / 인트로
// ──────────────────────────────────────────────────────────────
export const HilstateTitleCard: React.FC<{
  mainTitle: string;
  subTitle?: string;
}> = ({ mainTitle, subTitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ fps, frame, config: { damping: 14, stiffness: 120 } });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [40, 0]);

  // 바 애니메이션
  const barProgress = spring({ fps, frame, delay: 8, config: { damping: 18 } });
  const barWidth = interpolate(barProgress, [0, 1], [0, 100]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 100%)',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          opacity,
          transform: `translateY(${translateY}px)`,
          fontFamily: notoSans,
          color: 'white',
          padding: '40px 80px',
        }}
      >
        {/* 상단 브랜드 뱃지 */}
        <div
          style={{
            display: 'inline-block',
            backgroundColor: '#1A56DB',
            color: 'white',
            fontWeight: 700,
            fontSize: 26,
            padding: '6px 20px',
            borderRadius: 4,
            letterSpacing: '0.08em',
            marginBottom: 24,
            fontFamily: notoSans,
          }}
        >
          힐스테이트 모종 블랑루체
        </div>

        {/* 메인 타이틀 */}
        <div
          style={{
            fontFamily: blackHanSans,
            fontSize: 96,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            textShadow: `
              -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000,
              5px 5px 0 rgba(0,0,0,0.5)
            `,
            marginBottom: 20,
          }}
        >
          {mainTitle}
        </div>

        {/* 구분선 */}
        <div
          style={{
            height: 4,
            width: `${barWidth}%`,
            backgroundColor: '#FFF500',
            margin: '0 auto 20px',
            boxShadow: '0 2px 8px rgba(255,245,0,0.5)',
          }}
        />

        {/* 서브 타이틀 */}
        {subTitle && (
          <div
            style={{
              fontSize: 36,
              color: '#E5E7EB',
              fontWeight: 500,
              letterSpacing: '0.03em',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            }}
          >
            {subTitle}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ──────────────────────────────────────────────────────────────
// 3. 강조 자막 — 핵심 수치·팩트 강조 (빨강/노랑)
// ──────────────────────────────────────────────────────────────
export const HilstateEmphasisSubtitle: React.FC<{
  text: string;
  subText?: string;
  theme?: 'red' | 'yellow';
}> = ({ text, subText, theme = 'yellow' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    fps,
    frame,
    config: { damping: 10, stiffness: 220 },
  });

  const isYellow = theme === 'yellow';
  const mainColor = isYellow ? '#FFF500' : '#ffffff';
  const shadowColor = isYellow ? '#000000' : '#D50000';
  const outline = `-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000`;
  const blockShadow = `4px 4px 0 ${shadowColor}, 6px 6px 0 ${shadowColor}, 8px 8px 0 rgba(0,0,0,0.6), 10px 10px 0 rgba(0,0,0,0.3)`;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '14%',
        width: '100%',
        textAlign: 'center',
        fontFamily: blackHanSans,
        transform: `scale(${scale})`,
        transformOrigin: 'center bottom',
      }}
    >
      {/* 메인 강조 텍스트 */}
      <div
        style={{
          fontSize: 108,
          color: mainColor,
          textShadow: `${outline}, ${blockShadow}`,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
        }}
      >
        {text}
      </div>

      {/* 서브 텍스트 */}
      {subText && (
        <div
          style={{
            display: 'inline-block',
            backgroundColor: isYellow ? '#1A56DB' : '#D50000',
            color: 'white',
            fontSize: 44,
            fontWeight: 700,
            padding: '6px 28px',
            borderRadius: 6,
            marginTop: 12,
            fontFamily: notoSans,
            textShadow: '0 2px 6px rgba(0,0,0,0.5)',
          }}
        >
          {subText}
        </div>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────
// 4. 포인트 자막 — 사이드 패널 형태의 포인트/이유 설명
// ──────────────────────────────────────────────────────────────
export const HilstatePointSubtitle: React.FC<{
  badge: string;       // e.g. "POINT", "이유 ①"
  title: string;
  description?: string;
  side?: 'left' | 'right';
  accentColor?: string;
}> = ({ badge, title, description, side = 'left', accentColor = '#1A56DB' }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const slideProgress = spring({
    fps,
    frame,
    config: { damping: 14, stiffness: 100 },
  });

  const panelW = width * 0.42;
  const fromX = side === 'left' ? -panelW : width;
  const toX = side === 'left' ? 0 : width - panelW;
  const translateX = interpolate(slideProgress, [0, 1], [fromX, toX]);

  const textOpacity = spring({ fps, frame, delay: 12, config: { damping: 18 } });

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: panelW,
        transform: `translateX(${translateX}px)`,
        background:
          side === 'left'
            ? 'linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 75%, transparent 100%)'
            : 'linear-gradient(to left, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 75%, transparent 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: side === 'left' ? '0 60px 0 8%' : '0 8% 0 60px',
        color: 'white',
        fontFamily: notoSans,
      }}
    >
      <div style={{ opacity: textOpacity }}>
        {/* 뱃지 */}
        <div
          style={{
            display: 'inline-block',
            backgroundColor: accentColor,
            color: 'white',
            fontSize: 26,
            fontWeight: 700,
            padding: '5px 18px',
            borderRadius: 4,
            letterSpacing: '0.06em',
            marginBottom: 18,
          }}
        >
          {badge}
        </div>

        {/* 메인 타이틀 */}
        <div
          style={{
            fontFamily: blackHanSans,
            fontSize: 72,
            color: '#FFF500',
            lineHeight: 1.15,
            marginBottom: 20,
            textShadow: `-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000`,
          }}
        >
          {title}
        </div>

        {/* 구분선 */}
        <div
          style={{
            height: 3,
            width: 80,
            backgroundColor: accentColor,
            marginBottom: 16,
          }}
        />

        {/* 설명 */}
        {description && (
          <div
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: '#D1D5DB',
              lineHeight: 1.5,
            }}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  );
};
