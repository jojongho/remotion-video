import { loadFont as loadNotoSansKR } from '@remotion/google-fonts/NotoSansKR';
import { loadFont as loadBlackHanSans } from '@remotion/google-fonts/BlackHanSans';
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const { fontFamily: notoSans } = loadNotoSansKR();
const { fontFamily: blackHan } = loadBlackHanSans();

export interface StatItem {
  label: string;
  value: string;
  highlight?: boolean;
  accent?: 'red' | 'yellow' | 'green' | 'blue';
}

export interface CinematicStatCardConfig {
  id: string;
  startFrame: number;
  durationFrames: number;
  tag: string;
  items: StatItem[];
  layout?: 'top-center' | 'top-left' | 'top-right';
  columns?: 2 | 3 | 4;
}

const ACCENT = {
  red:    '#EF4444',
  yellow: '#F59E0B',
  green:  '#34D399',
  blue:   '#60A5FA',
  default:'#FFFFFF',
};

const SingleItem: React.FC<{ item: StatItem; delay: number }> = ({ item, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ fps, frame: frame - delay, config: { damping: 14, stiffness: 120, mass: 0.6 } });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const y = interpolate(enter, [0, 1], [20, 0]);
  const color = item.accent ? ACCENT[item.accent] : (item.highlight ? '#F59E0B' : '#FFFFFF');

  return (
    <div style={{ opacity, transform: `translateY(${y}px)`, flex: 1, padding: '0 28px' }}>
      <div style={{
        fontFamily: notoSans,
        fontSize: 22,
        fontWeight: 500,
        color: 'rgba(255,255,255,0.55)',
        marginBottom: 10,
        letterSpacing: 0.3,
        whiteSpace: 'nowrap',
      }}>
        {item.label}
      </div>
      <div style={{
        fontFamily: blackHan,
        fontSize: item.value.length > 10 ? 36 : 52,
        color,
        lineHeight: 1.1,
        textShadow: item.highlight ? `0 0 30px ${color}44` : 'none',
        whiteSpace: 'nowrap',
      }}>
        {item.value}
      </div>
      {item.highlight && (
        <div style={{
          height: 3,
          width: 40,
          backgroundColor: color,
          borderRadius: 2,
          marginTop: 10,
          boxShadow: `0 0 12px ${color}88`,
        }} />
      )}
    </div>
  );
};

export const CinematicStatCard: React.FC<CinematicStatCardConfig> = ({
  tag, items, layout = 'top-center', columns = 4, startFrame, durationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 컨테이너 등장
  const enter = spring({ fps, frame, config: { damping: 14, stiffness: 100, mass: 0.7 } });
  // 퇴장 페이드
  const exit = interpolate(
    frame, [durationFrames - 20, durationFrames],
    [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const opacity = Math.min(interpolate(enter, [0, 1], [0, 1]), exit);
  const y = interpolate(enter, [0, 1], [-40, 0]);

  const alignMap = { 'top-center': 'center', 'top-left': 'flex-start', 'top-right': 'flex-end' };

  // 구분선 색 — 태그 배경
  const visibleItems = items.slice(0, columns);
  const hasHighlight = visibleItems.some(i => i.highlight);

  return (
    <AbsoluteFill style={{
      justifyContent: 'flex-start',
      alignItems: alignMap[layout] as 'center' | 'flex-start' | 'flex-end',
      paddingTop: 60,
      paddingLeft: layout === 'top-left' ? 80 : 0,
      paddingRight: layout === 'top-right' ? 80 : 0,
    }}>
      <div style={{
        opacity,
        transform: `translateY(${y}px)`,
        background: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(16px)',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '32px 0 36px',
        width: columns === 4 ? 1200 : columns === 3 ? 900 : 640,
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
      }}>
        {/* 태그 헤더 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 40,
          paddingRight: 40,
          marginBottom: 28,
          gap: 16,
        }}>
          <div style={{
            backgroundColor: hasHighlight ? '#F59E0B' : '#2563EB',
            color: '#000',
            fontFamily: notoSans,
            fontSize: 22,
            fontWeight: 800,
            padding: '7px 20px',
            borderRadius: 8,
            letterSpacing: 0.5,
            whiteSpace: 'nowrap',
          }}>
            {tag}
          </div>
          <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.12)' }} />
        </div>

        {/* 아이템 그리드 */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          paddingLeft: 12,
          paddingRight: 12,
        }}>
          {visibleItems.map((item, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <div style={{
                  width: 1,
                  height: 80,
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  alignSelf: 'center',
                  flexShrink: 0,
                }} />
              )}
              <SingleItem item={item} delay={6 + i * 8} />
            </React.Fragment>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 여러 카드를 타임라인으로 관리하는 래퍼
export const CinematicStatCardTimeline: React.FC<{ cards: CinematicStatCardConfig[] }> = ({ cards }) => {
  const frame = useCurrentFrame();
  const active = cards.find(c => frame >= c.startFrame && frame < c.startFrame + c.durationFrames);
  if (!active) return null;
  const localFrame = frame - active.startFrame;
  return (
    <LocalFrameProvider localFrame={localFrame}>
      <CinematicStatCard {...active} />
    </LocalFrameProvider>
  );
};

// localFrame 주입을 위한 간단한 래퍼
// Remotion의 Sequence를 쓰면 useCurrentFrame이 자동으로 로컬 프레임 반환
// 여기서는 직접 durationFrames 내 상대 frame을 쓰기 위해 Sequence로 분리하는 게 더 정확
// → CheongakTTSVideo에서 Sequence로 감싸서 사용
const LocalFrameProvider: React.FC<{ localFrame: number; children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
