import { loadFont as loadBlackHanSans } from '@remotion/google-fonts/BlackHanSans';
import { loadFont as loadNotoSansKR } from '@remotion/google-fonts/NotoSansKR';
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const { fontFamily: blackHan } = loadBlackHanSans();
const { fontFamily: notoSans } = loadNotoSansKR();

// 도입부 0~30초 (frames 0~900) 모션 그래픽
// 구간 1 (0~150f): "서울 청약" — 충격 선언
// 구간 2 (150~360f): "수학적으로 불가능" — 데이터 강조
// 구간 3 (550~900f): "그 통장 쓸 곳이 있습니다" — 반전 희망

type Phase = 1 | 2 | 3;

const BigStatement: React.FC<{
  text: string;
  sub?: string;
  color?: string;
  delay?: number;
}> = ({ text, sub, color = '#FFFFFF', delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ fps, frame: frame - delay, config: { damping: 10, stiffness: 180, mass: 0.6 } });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const scale  = interpolate(enter, [0, 1], [1.15, 1]);

  return (
    <div style={{ opacity, transform: `scale(${scale})`, textAlign: 'center', willChange: 'transform' }}>
      <div style={{
        fontFamily: blackHan,
        fontSize: 120,
        color,
        textShadow: '-4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 4px 4px 0 #000, 6px 6px 0 rgba(0,0,0,0.5)',
        lineHeight: 1.05,
        letterSpacing: '-0.02em',
      }}>
        {text}
      </div>
      {sub && (
        <div style={{
          fontFamily: notoSans,
          fontSize: 44,
          color: 'rgba(255,255,255,0.85)',
          marginTop: 16,
          fontWeight: 500,
          textShadow: '0 2px 12px rgba(0,0,0,0.8)',
        }}>
          {sub}
        </div>
      )}
    </div>
  );
};

const NumberCounter: React.FC<{ value: string; label: string; delay?: number }> = ({ value, label, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ fps, frame: frame - delay, config: { damping: 12, stiffness: 150 } });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const y = interpolate(enter, [0, 1], [30, 0]);

  return (
    <div style={{ opacity, transform: `translateY(${y}px)`, textAlign: 'center' }}>
      <div style={{
        fontFamily: blackHan,
        fontSize: 96,
        color: '#F59E0B',
        textShadow: '-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000',
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: notoSans,
        fontSize: 38,
        color: '#fff',
        fontWeight: 600,
        textShadow: '0 2px 8px rgba(0,0,0,0.9)',
        marginTop: 8,
      }}>
        {label}
      </div>
    </div>
  );
};

// 붉은 강조 라인
const AccentLine: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ fps, frame: frame - delay, config: { damping: 14, stiffness: 120 } });
  const width = interpolate(enter, [0, 1], [0, 320]);

  return (
    <div style={{
      width,
      height: 6,
      backgroundColor: '#EF4444',
      borderRadius: 3,
      margin: '20px auto',
      boxShadow: '0 0 20px rgba(239,68,68,0.6)',
    }} />
  );
};

export const HookMotionGraphic: React.FC<{ phase: Phase }> = ({ phase }) => {
  const frame = useCurrentFrame();
  useVideoConfig(); // fps not used directly here, children use it

  // 페이드아웃 공통
  const fadeOut = (startF: number, endF: number) =>
    interpolate(frame, [startF, endF], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  if (phase === 1) {
    // 구간 1: "서울 청약, 당첨 안 됩니다"
    // 0~30f 등장, 120f부터 페이드아웃
    const opacity = fadeOut(120, 150);
    return (
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <BigStatement text="서울 청약" color="#FFFFFF" delay={0} />
          <AccentLine delay={15} />
          <BigStatement text="당첨 안 됩니다" color="#EF4444" delay={20} />
        </div>
      </AbsoluteFill>
    );
  }

  if (phase === 2) {
    // 구간 2: 숫자 충격 — "91만 명 해지"
    // 0~20f 등장
    const opacity = fadeOut(150, 180);
    return (
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{
            fontFamily: notoSans,
            fontSize: 40,
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 500,
            textShadow: '0 2px 8px rgba(0,0,0,0.9)',
            marginBottom: 12,
          }}>
            올해 1분기에만
          </div>
          <NumberCounter value="91만 명" label="청약통장 해지" delay={10} />
          <AccentLine delay={25} />
          <div style={{
            fontFamily: notoSans,
            fontSize: 36,
            color: 'rgba(255,255,255,0.75)',
            fontWeight: 500,
            textShadow: '0 2px 8px rgba(0,0,0,0.9)',
            marginTop: 8,
            textAlign: 'center',
          }}>
            그분들이 놓친 곳이 있습니다
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  if (phase === 3) {
    // 구간 3: "그 통장, 쓸 곳이 있습니다" — 희망 반전
    const opacity = fadeOut(300, 360);
    return (
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <div style={{
            fontFamily: notoSans,
            fontSize: 40,
            color: 'rgba(255,255,255,0.7)',
            marginBottom: 16,
            fontWeight: 500,
            textShadow: '0 2px 8px rgba(0,0,0,0.9)',
          }}>
            오히려 반대예요
          </div>
          <BigStatement text="그 통장" color="#FFFFFF" delay={10} />
          <BigStatement text="쓸 곳이 있습니다" color="#34D399" delay={25} />
          <AccentLine delay={35} />
          <div style={{
            fontFamily: notoSans,
            fontSize: 38,
            color: 'rgba(255,255,255,0.8)',
            fontWeight: 600,
            marginTop: 8,
            textShadow: '0 2px 8px rgba(0,0,0,0.9)',
          }}>
            서울이 아닌 곳에서
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  return null;
};
