import { loadFont as loadNotoSansKR } from '@remotion/google-fonts/NotoSansKR';
import { loadFont as loadBlackHanSans } from '@remotion/google-fonts/BlackHanSans';
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { BarChartConfig } from '../content/cheongak_tts/timeline';

const { fontFamily: notoSans } = loadNotoSansKR();
const { fontFamily: blackHan } = loadBlackHanSans();

// 자막 영역 침범 방지: 하단 200px 확보
// 카드 최대 높이 약 350px → top: 460px 이내에서 시작하면 안전
// 좌측 배치: paddingLeft 80px, width 760px

export const CinematicBarChart: React.FC<BarChartConfig & { durationFrames: number }> = ({
  title, bars, unit, maxValue, durationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerEnter = spring({ fps, frame, config: { damping: 14, stiffness: 90, mass: 0.8 } });
  const exit = interpolate(
    frame, [durationFrames - 20, durationFrames],
    [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const containerOpacity = Math.min(interpolate(containerEnter, [0, 1], [0, 1]), exit);
  const containerY = interpolate(containerEnter, [0, 1], [30, 0]);

  return (
    <AbsoluteFill style={{
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      paddingLeft: 80,
      paddingBottom: 200, // 자막 영역 확보
    }}>
      <div style={{
        opacity: containerOpacity,
        transform: `translateY(${containerY}px)`,
        background: 'rgba(0,0,0,0.80)',
        backdropFilter: 'blur(16px)',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '32px 44px 36px',
        width: 760,
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
      }}>
        {/* 타이틀 */}
        <div style={{
          fontFamily: notoSans,
          fontSize: 24,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.6)',
          marginBottom: 30,
          letterSpacing: 0.3,
        }}>
          {title}
        </div>

        {/* 막대들 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {bars.map((bar, i) => {
            const barEnter = spring({
              fps, frame: frame - 8 - i * 10,
              config: { damping: 12, stiffness: 100, mass: 0.5 },
            });
            const barW = interpolate(barEnter, [0, 1], [0, (bar.value / maxValue) * 580]);
            const labelOpacity = interpolate(barEnter, [0, 0.3], [0, 1]);
            const color = bar.highlight ? '#F59E0B' : '#60A5FA';

            return (
              <div key={i}>
                {/* 레이블 + 수치 행 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 10,
                  opacity: labelOpacity,
                }}>
                  <span style={{
                    fontFamily: notoSans,
                    fontSize: 24,
                    fontWeight: bar.highlight ? 700 : 500,
                    color: bar.highlight ? '#F59E0B' : 'rgba(255,255,255,0.65)',
                    whiteSpace: 'nowrap',
                  }}>
                    {bar.label}
                  </span>
                  <span style={{
                    fontFamily: blackHan,
                    fontSize: 38,
                    color,
                    textShadow: bar.highlight ? `0 0 20px ${color}66` : 'none',
                  }}>
                    {bar.value.toLocaleString()}{unit}
                  </span>
                </div>

                {/* 막대 트랙 */}
                <div style={{
                  height: 20,
                  backgroundColor: 'rgba(255,255,255,0.07)',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: barW,
                    height: '100%',
                    borderRadius: 10,
                    background: bar.highlight
                      ? 'linear-gradient(90deg, #D97706, #F59E0B)'
                      : 'linear-gradient(90deg, #1D4ED8, #60A5FA)',
                    boxShadow: bar.highlight
                      ? '0 0 16px rgba(245,158,11,0.5)'
                      : '0 0 12px rgba(96,165,250,0.3)',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
