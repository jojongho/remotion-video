import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

const FPS = 30;

// 씬 타이밍 (초 → 프레임)
const s = (sec: number) => Math.round(sec * FPS);

const SCENES = [
  // 씬 1: 도입 (0~15s)
  {
    from: s(0), duration: s(15),
    bg: '#0A1628',
    type: 'title' as const,
    title: '청약 가점\n몇 점인지 아세요?',
    sub: '이 영상 하나로 계산 + 전략까지',
    accent: '#4A9EFF',
  },
  // 씬 2: 가점제란 (15~45s)
  {
    from: s(15), duration: s(30),
    bg: '#0A1628',
    type: 'points' as const,
    title: '가점제 84점 만점',
    items: [
      { label: '무주택 기간', score: '최대 32점', color: '#4A9EFF' },
      { label: '부양가족 수', score: '최대 35점', color: '#00D4AA' },
      { label: '청약통장 납입', score: '최대 17점', color: '#FFB347' },
    ],
  },
  // 씬 3: 무주택 기간 (45~100s)
  {
    from: s(45), duration: s(55),
    bg: '#0A1628',
    type: 'detail' as const,
    badge: '① 무주택 기간',
    badgeColor: '#4A9EFF',
    title: '최대 32점',
    items: [
      '1년에 2점씩 → 15년 = 30점',
      '만 30세 or 결혼일 중 빠른 날부터',
      '배우자 결혼 전 무주택 기간도 합산 (2023~)',
    ],
  },
  // 씬 4: 부양가족 (100~140s)
  {
    from: s(100), duration: s(40),
    bg: '#0A1628',
    type: 'detail' as const,
    badge: '② 부양가족 수',
    badgeColor: '#00D4AA',
    title: '최대 35점',
    items: [
      '본인 제외 1명당 5점 (6명↑ 만점)',
      '배우자·직계비속·직계존속 포함',
      '직계존속은 3년 이상 동거 필수',
    ],
  },
  // 씬 5: 청약통장 (140~175s)
  {
    from: s(140), duration: s(35),
    bg: '#0A1628',
    type: 'detail' as const,
    badge: '③ 청약통장 납입',
    badgeColor: '#FFB347',
    title: '최대 17점',
    items: [
      '24회(2년) 이상 납입 → 17점 만점',
      '2026년~ 배우자 통장 50% 합산 (+3점)',
      '주택청약종합저축만 인정',
    ],
  },
  // 씬 6: 함정 (175~215s)
  {
    from: s(175), duration: s(40),
    bg: '#1A0A20',
    type: 'trap' as const,
    title: '자주 틀리는 함정 3가지',
    traps: [
      { num: '1', text: '무주택 기간 → 세대원 전체 기준' },
      { num: '2', text: '직계존속 → 3년 이상 동거 필수' },
      { num: '3', text: '청약통장 → 종류 확인 필수' },
    ],
  },
  // 씬 7: 전략 + CTA (215~232s)
  {
    from: s(215), duration: s(17),
    bg: '#0A1628',
    type: 'cta' as const,
    rows: [
      { range: '55점 이상', action: '인기 단지 정면 승부', color: '#4A9EFF' },
      { range: '40~50점대', action: '비선호 타입 / 외곽 공략', color: '#00D4AA' },
      { range: '30점 이하', action: '추첨제만 노려라', color: '#FFB347' },
    ],
    next: '다음 영상: 추첨제 전략 완전 정복',
  },
];

// ─── 공통 헬퍼 ───────────────────────────────────────────────────────────────

const fadeIn = (frame: number, start = 0, duration = 20) =>
  interpolate(frame, [start, start + duration], [0, 1], { extrapolateRight: 'clamp' });

// ─── 씬 컴포넌트 ─────────────────────────────────────────────────────────────

const TitleScene: React.FC<typeof SCENES[0] & { type: 'title' }> = ({ title, sub, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const prog = spring({ frame, fps, config: { damping: 18, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 80 }}>
      <div style={{
        transform: `translateY(${interpolate(prog, [0, 1], [60, 0])}px)`,
        opacity: prog,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 96, fontWeight: 900, color: '#fff', lineHeight: 1.2,
          whiteSpace: 'pre-line', marginBottom: 40,
          textShadow: `0 0 80px ${accent}66`,
        }}>
          {title}
        </div>
        <div style={{
          fontSize: 42, color: accent, fontWeight: 600,
          opacity: fadeIn(frame, 15),
        }}>
          {sub}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PointsScene: React.FC<typeof SCENES[1] & { type: 'points' }> = ({ title, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 80 }}>
      <div style={{ width: '100%', maxWidth: 1400 }}>
        <div style={{
          fontSize: 64, fontWeight: 800, color: '#fff', marginBottom: 60,
          opacity: fadeIn(frame, 0),
          textAlign: 'center',
        }}>
          {title}
        </div>
        {items.map((item, i) => {
          const prog = spring({ frame: frame - i * 8, fps, config: { damping: 20, stiffness: 120 } });
          return (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: `${item.color}18`,
              border: `2px solid ${item.color}44`,
              borderRadius: 20, padding: '36px 56px', marginBottom: 24,
              transform: `translateX(${interpolate(prog, [0, 1], [80, 0])}px)`,
              opacity: prog,
            }}>
              <span style={{ fontSize: 52, fontWeight: 700, color: '#fff' }}>{item.label}</span>
              <span style={{ fontSize: 56, fontWeight: 900, color: item.color }}>{item.score}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const DetailScene: React.FC<typeof SCENES[2] & { type: 'detail' }> = ({ badge, badgeColor, title, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ justifyContent: 'center', padding: '0 120px' }}>
      <div>
        <div style={{
          display: 'inline-block',
          background: badgeColor, color: '#fff',
          fontSize: 36, fontWeight: 700,
          padding: '12px 32px', borderRadius: 40, marginBottom: 32,
          opacity: fadeIn(frame, 0, 15),
        }}>
          {badge}
        </div>
        <div style={{
          fontSize: 80, fontWeight: 900, color: badgeColor,
          marginBottom: 56, opacity: fadeIn(frame, 5, 15),
        }}>
          {title}
        </div>
        {items.map((item, i) => {
          const prog = spring({ frame: frame - 5 - i * 10, fps, config: { damping: 20 } });
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 28,
              marginBottom: 32,
              transform: `translateX(${interpolate(prog, [0, 1], [60, 0])}px)`,
              opacity: prog,
            }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%',
                background: badgeColor, flexShrink: 0,
              }} />
              <span style={{ fontSize: 46, color: '#E8EEFF', fontWeight: 500 }}>{item}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const TrapScene: React.FC<typeof SCENES[5] & { type: 'trap' }> = ({ title, traps }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 80 }}>
      <div style={{ width: '100%', maxWidth: 1400 }}>
        <div style={{
          fontSize: 60, fontWeight: 800, color: '#FF6B6B',
          marginBottom: 60, textAlign: 'center',
          opacity: fadeIn(frame),
        }}>
          ⚠️ {title}
        </div>
        {traps.map((trap, i) => {
          const prog = spring({ frame: frame - i * 10, fps, config: { damping: 20 } });
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 36,
              background: '#FF6B6B18', border: '2px solid #FF6B6B44',
              borderRadius: 20, padding: '32px 48px', marginBottom: 24,
              transform: `translateX(${interpolate(prog, [0, 1], [80, 0])}px)`,
              opacity: prog,
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: '#FF6B6B', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 36, fontWeight: 900, color: '#fff',
                flexShrink: 0,
              }}>
                {trap.num}
              </div>
              <span style={{ fontSize: 46, color: '#fff', fontWeight: 600 }}>{trap.text}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const CtaScene: React.FC<typeof SCENES[6] & { type: 'cta' }> = ({ rows, next }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 80 }}>
      <div style={{ width: '100%', maxWidth: 1400 }}>
        {rows.map((row, i) => {
          const prog = spring({ frame: frame - i * 8, fps, config: { damping: 20 } });
          return (
            <div key={i} style={{
              display: 'flex', gap: 40, alignItems: 'center',
              marginBottom: 28,
              transform: `translateY(${interpolate(prog, [0, 1], [40, 0])}px)`,
              opacity: prog,
            }}>
              <div style={{
                fontSize: 44, fontWeight: 900, color: row.color,
                minWidth: 260,
              }}>
                {row.range}
              </div>
              <div style={{
                flex: 1, background: `${row.color}22`,
                border: `2px solid ${row.color}55`,
                borderRadius: 16, padding: '24px 36px',
                fontSize: 42, color: '#fff', fontWeight: 600,
              }}>
                {row.action}
              </div>
            </div>
          );
        })}
        <div style={{
          marginTop: 60, textAlign: 'center',
          fontSize: 40, color: '#888', fontWeight: 500,
          opacity: fadeIn(frame, 20),
        }}>
          👇 {next}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── 메인 컴포지션 ────────────────────────────────────────────────────────────

export const CheongakGajum: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A1628', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <Audio src={staticFile('audio/cheongak_gajum.mp3')} />

      {SCENES.map((scene, i) => (
        <Sequence key={i} from={scene.from} durationInFrames={scene.duration}>
          <AbsoluteFill style={{ backgroundColor: scene.bg }}>
            {scene.type === 'title' && <TitleScene {...scene as any} />}
            {scene.type === 'points' && <PointsScene {...scene as any} />}
            {scene.type === 'detail' && <DetailScene {...scene as any} />}
            {scene.type === 'trap' && <TrapScene {...scene as any} />}
            {scene.type === 'cta' && <CtaScene {...scene as any} />}
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
